import paramiko
import os
import logging
from typing import Dict, Tuple, Optional
from dotenv import load_dotenv
from .ai_brain import SSHAIBrain

# Load environment variables from .env file
load_dotenv()

logger = logging.getLogger(__name__)

class AIPoweredSSHClient:
    """
    AI-powered SSH client that uses OpenRouter to translate natural language
    into Linux commands and executes them on Kali Linux.
    """
    
    def __init__(self):
        # SSH Configuration
        self.host = os.getenv('KALI_HOST', '192.168.179.183')
        self.port = int(os.getenv('KALI_PORT', 22))
        self.username = os.getenv('KALI_USER', 'kali')
        self.password = os.getenv('KALI_PASS', 'kali')
        self.key_path = os.getenv('KALI_KEY_PATH', None)
        
        self.client = None
        self.ai_brain = SSHAIBrain()
        
        # Command history for context
        self.command_history = []

    def connect(self) -> Tuple[bool, str]:
        """Establishes SSH connection to Kali."""
        try:
            self.client = paramiko.SSHClient()
            self.client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            
            if self.key_path and os.path.exists(self.key_path):
                logger.info(f"Connecting using SSH key: {self.key_path}")
                private_key = paramiko.RSAKey.from_private_key_file(self.key_path)
                self.client.connect(
                    hostname=self.host,
                    port=self.port,
                    username=self.username,
                    pkey=private_key,
                    timeout=10
                )
            else:
                logger.info(f"Connecting using password auth")
                self.client.connect(
                    hostname=self.host,
                    port=self.port,
                    username=self.username,
                    password=self.password,
                    timeout=10
                )
            return True, "Connected"
            
        except Exception as e:
            logger.error(f"SSH connection failed: {e}")
            return False, str(e)

    def execute_natural_language(self, user_request: str) -> Dict:
        """
        Main method: Takes natural language, converts to command via AI, executes via SSH.
        """
        result = {
            'success': False,
            'user_request': user_request,
            'generated_command': '',
            'command_output': '',
            'ai_analysis': '',
            'error': ''
        }
        
        try:
            # Step 1: AI translates natural language to command
            success, command_or_error = self.ai_brain.translate_to_command(user_request)
            
            if not success:
                result['error'] = f"AI Translation Failed: {command_or_error}"
                return result
            
            generated_command = command_or_error
            result['generated_command'] = generated_command
            logger.info(f"AI Command: {generated_command}")
            
            # Step 2: Execute the command via SSH
            exec_success, output = self._execute_raw_command(generated_command)
            
            if not exec_success:
                result['error'] = f"Execution Failed: {output}"
                return result
            
            result['command_output'] = output
            result['success'] = True
            
            # Step 3: AI analyzes the output
            result['ai_analysis'] = self.ai_brain.analyze_output(generated_command, output)
            
            # Store in history
            self.command_history.append({
                'request': user_request,
                'command': generated_command,
                'output': output[:500]  # Truncate for storage
            })
            
        except Exception as e:
            logger.exception("Error in AI-powered execution")
            result['error'] = str(e)
        
        return result

    def _execute_raw_command(self, command: str) -> Tuple[bool, str]:
        """Internal method to execute raw command via SSH."""
        if not self.client:
            success, msg = self.connect()
            if not success:
                return False, msg
        
        if self.client is None:
            return False, "SSH connection not established"
        
        try:
            logger.info(f"Executing: {command}")
            stdin, stdout, stderr = self.client.exec_command(command, timeout=60)
            
            output = stdout.read().decode('utf-8')
            error = stderr.read().decode('utf-8')
            
            exit_code = stdout.channel.recv_exit_status()
            
            if error and exit_code != 0:
                return False, f"Exit code {exit_code}: {error}"
            
            full_output = output
            if error:
                full_output += f"\n[stderr]: {error}"
            
            return True, full_output
            
        except Exception as e:
            logger.error(f"Command execution error: {e}")
            return False, str(e)

    def execute_whitelisted(self, command_key: str) -> Tuple[bool, str]:
        """
        Execute pre-defined safe commands without AI translation.
        """
        ALLOWED_COMMANDS = {
            'whoami': 'whoami',
            'ls': 'ls -la',
            'uptime': 'uptime',
            'pwd': 'pwd',
            'check_n': 'cat /root/n.txt',
            'scan_ports': 'nmap -p- localhost',
            'list_tools': 'which nmap sqlmap gobuster ffuf nuclei dirsearch',
            'system_info': 'uname -a && cat /etc/os-release',
        }
        
        if command_key not in ALLOWED_COMMANDS:
            return False, "Command not in whitelist"
        
        return self._execute_raw_command(ALLOWED_COMMANDS[command_key])

    def close(self):
        """Closes SSH connection."""
        if self.client:
            self.client.close()
            self.client = None
