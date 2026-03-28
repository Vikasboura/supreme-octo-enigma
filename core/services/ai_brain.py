import os
import json
import logging
import requests
from typing import Dict, Tuple, Optional

logger = logging.getLogger(__name__)

class SSHAIBrain:
    """
    AI Brain that uses OpenRouter API to translate natural language
    into Linux commands for the Kali SSH environment.
    """
    
    def __init__(self):
        self.api_key = os.getenv('OPENROUTER_API_KEY', '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')
        self.model = os.getenv('OPENROUTER_MODEL', 'arcee-ai/trinity-large-preview:free')
        self.api_url = 'https://openrouter.ai/api/v1/chat/completions'
        
        # Safety - restricted commands that AI should NEVER generate
        self.DANGEROUS_PATTERNS = [
            'rm -rf /', 'mkfs', 'dd if=/dev/zero', '>:', 'shred', 'del /',
            'format', 'init 0', 'poweroff', 'reboot', 'shutdown',
            'passwd root', 'usermod -G', 'chmod 777 /etc'
        ]
        
        # Context about available tools - Updated with SecureWay Dashboard Features
        self.TOOLS_CONTEXT = """
You are an AI assistant for the SECUREWAY Security Platform integrated with Kali Linux via SSH.

## SECUREWAY DASHBOARD FEATURES (Now Executable via SSH):

### 1. Port Recon (Port Scanning)
- nmap -sS -sV -O [target] (Stealth SYN scan with version detection)
- nmap -p- [target] (Full port scan all 65535 ports)
- nmap --script vuln [target] (Vulnerability scanning scripts)

### 2. BOLA Engine (Broken Object Level Authorization)
- python3 -c "import requests; ..." (Custom auth bypass testing)
- curl -H "Authorization: Bearer ..." (Token manipulation tests)
- jwt_tool [token] (JWT token analysis)

### 3. Pipelines (Automated Scanning Workflows)
- nuclei -u [target] -t [templates] (Automated vulnerability pipelines)
- subfinder -d [domain] | httpx | nuclei (Subdomain enumeration pipeline)
- amass enum -d [domain] (Asset discovery pipeline)

### 4. Global Intelligence (Threat Intel)
- curl https://intel.domain.com/api/... (Threat intelligence APIs)
- whois [domain] (Domain intelligence)
- dig +short [domain] (DNS reconnaissance)

### 5. Shadow Map (Attack Surface Mapping)
- gospider -s [target] (Web crawler for attack surface)
- katana -u [target] (Fast crawler)
- hakrawler -url [target] (URL discovery)

### 6. Anomaly Lab (Anomaly Detection)
- python3 /usr/share/seclists/... (Anomaly detection scripts)
- zaproxy -cmd [options] (OWASP ZAP automation)
- ffuf -u [target]/FUZZ -w [wordlist] (Fuzzing anomalies)

### 7. PII Scrubber (Data Privacy)
- grep -E "[pattern]" [file] (PII pattern matching)
- python3 -m presidio (PII detection)
- sed 's/[pattern]/***/g' [file] (Data masking)

### 8. OAST Mesh (Out-of-Band Testing)
- interactsh-client (OAST interaction client)
- burpsuite --oast (Burp OAST integration)

### 9. Target Management
- mkdir -p /var/secureway/targets (Target directory creation)
- touch /var/secureway/targets/[domain].txt (Target registration)

### 10. Infrastructure/Kernel Health
- uname -a (System info)
- systemctl status [service] (Service health)
- df -h && free -m (Resource monitoring)

## STANDARD PENTESTING TOOLS:
- nmap: Network scanning
- subfinder: Subdomain discovery  
- nuclei: Vulnerability scanning
- gobuster/dirsearch: Directory brute-forcing
- sqlmap: SQL injection testing
- amass: Asset discovery
- httpx: HTTP probing
- curl/wget: Web requests
- python3: Scripting
- john/hashcat: Password cracking
- metasploit: Exploitation framework
- ffuf: Web fuzzing
- wfuzz: Web fuzzer
- zap: OWASP ZAP

## COMMAND TRANSLATION RULES:
1. Map user requests to the appropriate SECUREWAY feature above
2. Use specific tools mentioned in each feature category
3. Always prefer automated tools (nuclei, amass) over manual scripts
4. Include proper output formatting (-json, -o file) when relevant
5. Never generate destructive commands (rm -rf, mkfs, etc.)

Translate user requests into safe, effective Linux commands.
Only return the command itself, no explanation.
If the request is dangerous or unclear, return "ERROR: [reason]"
        """
    
    def translate_to_command(self, user_request: str) -> Tuple[bool, str]:
        """
        Translates natural language user request to Linux command.
        Returns: (success, command_or_error)
        """
        try:
            headers = {
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://secureway.local'
            }
            
            payload = {
                'model': self.model,
                'messages': [
                    {
                        'role': 'system',
                        'content': self.TOOLS_CONTEXT
                    },
                    {
                        'role': 'user',
                        'content': f"Translate this to a Linux command: {user_request}"
                    }
                ],
                'temperature': 0.2,
                'max_tokens': 150
            }
            
            logger.info(f"Sending request to OpenRouter: {user_request}")
            
            response = requests.post(
                self.api_url,
                headers=headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code != 200:
                logger.error(f"OpenRouter API error: {response.status_code} - {response.text}")
                return False, f"API Error: {response.status_code}"
            
            data = response.json()
            
            if 'choices' not in data or len(data['choices']) == 0:
                return False, "No response from AI"
            
            ai_response = data['choices'][0]['message']['content'].strip()
            
            # Check if AI returned an error
            if ai_response.startswith('ERROR:'):
                return False, ai_response
            
            # Clean the command (remove markdown code blocks if present)
            command = ai_response.replace('```bash', '').replace('```', '').strip()
            
            # Validate command is not dangerous
            is_safe, safety_msg = self._validate_command_safety(command)
            if not is_safe:
                return False, safety_msg
            
            logger.info(f"AI translated command: {command}")
            return True, command
            
        except requests.Timeout:
            logger.error("OpenRouter API timeout")
            return False, "AI service timeout"
        except Exception as e:
            logger.exception("Error calling OpenRouter API")
            return False, f"AI translation error: {str(e)}"
    
    def _validate_command_safety(self, command: str) -> Tuple[bool, str]:
        """
        Validates that the generated command is safe to execute.
        """
        command_lower = command.lower()
        
        # Check for dangerous patterns
        for pattern in self.DANGEROUS_PATTERNS:
            if pattern.lower() in command_lower:
                logger.warning(f"Dangerous command blocked: {command}")
                return False, f"Command blocked for safety: contains '{pattern}'"
        
        # Additional safety checks
        if command.count(';') > 2 or command.count('&&') > 2:
            return False, "Command too complex (multiple chained commands)"
        
        if '>' in command and ('/etc' in command or '/sys' in command or '/proc' in command):
            return False, "Command attempts to write to system directories"
        
        return True, "Safe"
    
    def analyze_output(self, command: str, output: str) -> str:
        """
        Uses AI to analyze command output and provide insights.
        """
        try:
            headers = {
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://secureway.local'
            }
            
            payload = {
                'model': self.model,
                'messages': [
                    {
                        'role': 'system',
                        'content': 'You are a security analyst. Analyze the command output briefly.'
                    },
                    {
                        'role': 'user',
                        'content': f"Command: {command}\n\nOutput:\n{output[:2000]}\n\nProvide a brief analysis of what this means for security testing."
                    }
                ],
                'temperature': 0.3,
                'max_tokens': 300
            }
            
            response = requests.post(
                self.api_url,
                headers=headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'choices' in data and len(data['choices']) > 0:
                    return data['choices'][0]['message']['content'].strip()
            
            return "Analysis unavailable"
            
        except Exception as e:
            logger.error(f"Error analyzing output: {e}")
            return "Analysis error"
