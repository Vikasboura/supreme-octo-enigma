import paramiko
import os
import logging
import time
from typing import Dict, Tuple, Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure logging
logger = logging.getLogger(__name__)

ALLOWED_COMMANDS = {
    "list_files": "ls -la",
    "uptime": "uptime",
    "whoami": "whoami",
    "read_n": "cat /root/n.txt"
}

class RemoteExecutor:
    def __init__(self):
        # Load from multiple potential .env locations
        load_dotenv()  # Default root
        load_dotenv(os.path.join(os.getcwd(), 'backend', '.env'))  # Backend subfolder
        
        self.hostname = os.getenv("REMOTE_SSH_HOST")
        self.username = os.getenv("REMOTE_SSH_USER")
        self.key_path = os.getenv("REMOTE_SSH_KEY_PATH")
        self.port = int(os.getenv("REMOTE_SSH_PORT", 22))
        self.timeout = 10
        self.client = None

    def connect(self):
        """Establish SSH connection using RSA key."""
        if not all([self.hostname, self.username, self.key_path]):
            raise ValueError("Missing required SSH environment variables.")
        
        try:
            self.client = paramiko.SSHClient()
            self.client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            
            # Load RSA private key (updated from Ed25519)
            private_key = paramiko.RSAKey.from_private_key_file(str(self.key_path))
            
            self.client.connect(
                hostname=str(self.hostname),
                port=self.port,
                username=str(self.username),
                pkey=private_key,
                timeout=self.timeout
            )
            logger.info(f"Successfully connected to {self.hostname}")
        except Exception as e:
            logger.error(f"Failed to connect to {self.hostname}: {str(e)}")
            raise ConnectionError(f"SSH Connection failed: {str(e)}")

    def execute(self, command_key: str) -> Dict:
        """Execute a whitelisted command and return the result."""
        if command_key not in ALLOWED_COMMANDS:
            logger.warning(f"Unauthorized command attempt: {command_key}")
            return {
                "success": False,
                "output": "",
                "error": "Invalid command",
                "execution_time": 0
            }

        start_time = time.time()
        command = ALLOWED_COMMANDS[command_key]
        
        try:
            if not self.client:
                self.connect()
            
            if self.client is None:
                raise ConnectionError("SSH client could not be initialized.")

            logger.info(f"Executing command: {command_key}")
            stdin, stdout, stderr = self.client.exec_command(command, timeout=self.timeout)
            
            out = stdout.read().decode().strip()
            err = stderr.read().decode().strip()
            
            execution_time = time.time() - start_time
            
            if err and not out:
                return {
                    "success": False,
                    "output": out,
                    "error": err,
                    "execution_time": execution_time
                }

            return {
                "success": True,
                "output": out if out else "Command executed with no output",
                "error": err,
                "execution_time": execution_time
            }

        except Exception as e:
            execution_time = time.time() - start_time
            logger.error(f"Execution error for {command_key}: {str(e)}")
            return {
                "success": False,
                "output": "",
                "error": str(e),
                "execution_time": execution_time
            }

    def close(self):
        """Close the SSH connection."""
        if self.client:
            self.client.close()
            logger.info("SSH connection closed")
