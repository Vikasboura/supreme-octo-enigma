import paramiko
import os
import logging
from django.conf import settings
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure basic logging
logger = logging.getLogger(__name__)

class KaliSSHClient:
    """
    A reusable SSH utility to connect to a Kali Linux machine and execute whitelisted commands.
    """
    
    # Whitelist of allowed commands to prevent command injection
    ALLOWED_COMMANDS = {
        'whoami': 'whoami',
        'ls': 'ls -la',
        'uptime': 'uptime',
        'pwd': 'pwd',
        'check_n': 'cat /root/n.txt',
        'ifconfig': 'ifconfig',
        'netstat': 'netstat -tuln',
        'ps': 'ps aux | head -n 20',
        'df': 'df -h',
    }

    def __init__(self):
        # Configuration - Use environment variables in production
        self.host = os.getenv('KALI_HOST', '192.168.1.100')
        self.port = int(os.getenv('KALI_PORT', 22))
        self.username = os.getenv('KALI_USER', 'kali')
        self.password = os.getenv('KALI_PASS', 'kali')
        self.key_path = os.getenv('KALI_KEY_PATH', None) # Path to private key for key-auth
        
        self.client = None

    def connect(self):
        """
        Establishes an SSH connection.
        Supports both Password and Key-based authentication.
        """
        try:
            self.client = paramiko.SSHClient()
            # Automatically add the remote host's key (In production, use a known_hosts file)
            self.client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            
            if self.key_path and os.path.exists(self.key_path):
                # Key-based authentication (Ed25519 or RSA)
                logger.info(f"Connecting to {self.host} using SSH key: {self.key_path}")
                private_key = paramiko.RSAKey.from_private_key_file(self.key_path)
                self.client.connect(
                    hostname=self.host,
                    port=self.port,
                    username=self.username,
                    pkey=private_key,
                    timeout=10
                )
            else:
                # Password-based authentication
                logger.info(f"Connecting to {self.host} using password")
                self.client.connect(
                    hostname=self.host,
                    port=self.port,
                    username=self.username,
                    password=self.password,
                    timeout=10
                )
            return True, "Connected successfully"
        except paramiko.AuthenticationException:
            return False, "Authentication failed, please check your credentials"
        except paramiko.SSHException as ssh_err:
            return False, f"SSH connection error: {str(ssh_err)}"
        except Exception as e:
            return False, f"Connection error: {str(e)}"

    def execute_command(self, command_key):
        """
        Executes a command from the whitelist.
        """
        if command_key not in self.ALLOWED_COMMANDS:
            return False, "Command not allowed"

        if not self.client:
            success, msg = self.connect()
            if not success:
                return False, msg

        command = self.ALLOWED_COMMANDS[command_key]
        try:
            if self.client is None:
                return False, "SSH connection not established"

            logger.info(f"Executing command: {command}")
            stdin, stdout, stderr = self.client.exec_command(command, timeout=10)
            
            # Read output
            output = stdout.read().decode('utf-8')
            error = stderr.read().decode('utf-8')
            
            if error:
                return True, f"Output: {output}\nError: {error}"
            return True, output
            
        except Exception as e:
            logger.error(f"Execution error: {str(e)}")
            return False, f"Failed to execute command: {str(e)}"
        finally:
            self.close()

    def close(self):
        """Closes the SSH connection."""
        if self.client:
            self.client.close()
            self.client = None
