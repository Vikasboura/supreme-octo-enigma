from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json
import logging
from scanner.utils import scrub_pii
from .services.ssh_executor import RemoteExecutor

logger = logging.getLogger(__name__)

def index(request):
    return render(request, 'index.html')

@login_required
def features(request):
    return render(request, 'core/features.html')

def contact_us(request):
    return render(request, 'core/contact.html')

def pricing(request):
    return render(request, 'core/pricing.html')

def docs(request):
    return render(request, 'core/docs.html')

@login_required
def pii_scrubber(request):
    redacted_text = None
    original_text = None
    if request.method == 'POST':
        original_text = request.POST.get('text')
        if original_text:
            redacted_text = scrub_pii(original_text)
            
    return render(request, 'core/pii_scrubber.html', {
        'original_text': original_text,
        'redacted_text': redacted_text
    })

from .services.kali_client import KaliSSHClient

@csrf_exempt
@require_POST
def execute_kali_command(request):
    """
    API endpoint to execute whitelisted commands on a remote Kali machine.
    """
    try:
        data = json.loads(request.body)
        command_key = data.get('command')
        
        if not command_key:
            return JsonResponse({
                "success": False,
                "output": "",
                "error": "No command provided"
            }, status=400)

        kali = KaliSSHClient()
        success, output = kali.execute_command(command_key)
        
        return JsonResponse({
            "success": success,
            "output": output if success else "",
            "error": "" if success else output
        })

    except json.JSONDecodeError:
        return JsonResponse({
            "success": False,
            "output": "",
            "error": "Invalid JSON input"
        }, status=400)
    except Exception as e:
        logger.exception("Unexpected error in execute_kali_command view")
        return JsonResponse({
            "success": False,
            "output": "",
            "error": str(e)
        }, status=500)

@login_required
def kali_terminal(request):
    """
    Renders the terminal UI for Kali remote execution.
    """
    return render(request, 'core/kali_terminal.html')

from .services.ai_ssh_client import AIPoweredSSHClient

@csrf_exempt
@require_POST
def execute_ai_ssh_command(request):
    """
    API endpoint for AI-powered SSH execution.
    Takes natural language, converts to command via AI, executes on Kali.
    """
    try:
        data = json.loads(request.body)
        user_request = data.get('request', '')
        
        if not user_request:
            return JsonResponse({
                "success": False,
                "error": "No request provided"
            }, status=400)

        ai_ssh = AIPoweredSSHClient()
        result = ai_ssh.execute_natural_language(user_request)
        ai_ssh.close()
        
        return JsonResponse(result)

    except json.JSONDecodeError:
        return JsonResponse({
            "success": False,
            "error": "Invalid JSON input"
        }, status=400)
    except Exception as e:
        logger.exception("Error in AI SSH execution")
        return JsonResponse({
            "success": False,
            "error": str(e)
        }, status=500)

@login_required
def ai_ssh_terminal(request):
    """
    Renders the AI-powered SSH terminal UI.
    """
    return render(request, 'core/ai_ssh_terminal.html')

