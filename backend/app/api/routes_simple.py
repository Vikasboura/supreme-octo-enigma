from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import time
import random
import asyncio
import requests

# Import OpenRouter Service
from app.services.openrouter_service import OpenRouterReasoner

router = APIRouter()

# Initialize Services
reasoner = OpenRouterReasoner()

# --- Simple Mock Endpoints for Prototype ---

class ScanRequest(BaseModel):
    url: str

class ScrubRequest(BaseModel):
    text: str

class BolaAnalysisRequest(BaseModel):
    endpoint: str
    user_id: int


class CodeIssue(BaseModel):
    rule_id: str
    severity: str
    message: str
    hint: Optional[str] = None


class CodeAnalysisRequest(BaseModel):
    code: str
    language: Optional[str] = None
    auto_deploy: bool = False


def _analyze_code_security(code: str, language: Optional[str] = None) -> dict:
    text = code.lower()
    issues: List[dict] = []

    if "eval(" in text or "exec(" in text:
        issues.append(
            {
                "rule_id": "PY-001",
                "severity": "High",
                "message": "Use of eval/exec detected. This is often unsafe and can lead to remote code execution.",
                "hint": "Replace eval/exec with safe parsing or explicit mappings.",
            }
        )

    if "os.system(" in text or "subprocess.Popen".lower() in text:
        issues.append(
            {
                "rule_id": "PY-002",
                "severity": "Medium",
                "message": "Shell command execution detected. Validate and sanitize any user-controlled input.",
                "hint": "Prefer high-level libraries and strict allow-lists for commands.",
            }
        )

    if "password" in text or "api_key" in text or "secret" in text:
        issues.append(
            {
                "rule_id": "GEN-001",
                "severity": "Medium",
                "message": "Potential hardcoded credential or secret detected.",
                "hint": "Move secrets to environment variables or a secrets manager.",
            }
        )

    if "http://" in text and "https://" not in text:
        issues.append(
            {
                "rule_id": "GEN-002",
                "severity": "Low",
                "message": "Insecure HTTP URL detected. Prefer HTTPS for production traffic.",
                "hint": "Upgrade URLs to HTTPS where possible.",
            }
        )

    severities = {"Low": 1, "Medium": 2, "High": 3}
    max_sev_score = max((severities.get(i["severity"], 1) for i in issues), default=0)

    if not issues:
        decision = "allow"
        message = "No obvious vulnerabilities detected in static heuristics."
    elif max_sev_score >= 3:
        decision = "block"
        message = "High-risk patterns detected. Fix issues before deployment."
    else:
        decision = "warn"
        message = "Potential issues detected. Review before deployment."

    return {
        "decision": decision,
        "message": message,
        "issues": issues,
    }


class DomainVerificationRequest(BaseModel):
    domain: str
    token: str


verified_domains: set[str] = set()

@router.get("/")
async def root():
    """Root endpoint - system status"""
    return {
        "system": "SECUREWAY Logic Engine",
        "status": "operational",
        "version": "2.0.0",
        "timestamp": time.time()
    }

@router.get("/docs")
async def docs():
    """API documentation endpoint"""
    return {
        "system": "SECUREWAY Logic Engine",
        "status": "operational",
        "endpoints": [
            "GET /",
            "GET /docs", 
            "POST /scan/start",
            "GET /scan/{scan_id}/status",
            "POST /privacy/scrub"
        ]
    }

@router.post("/scan/start")
async def start_scan(request: ScanRequest):
    """Start a security scan - only for verified domains"""

    # Very simple gating: require the exact URL host to be in verified_domains
    from urllib.parse import urlparse

    parsed = urlparse(request.url)
    host = parsed.hostname

    if not host:
        raise HTTPException(status_code=400, detail="Invalid URL provided for scan.")

    if host not in verified_domains:
        raise HTTPException(
            status_code=403,
            detail=f"Domain '{host}' is not verified for active scans. Complete domain verification first.",
        )

    scan_id = f"scan_{int(time.time())}"
    return {
        "scan_id": scan_id,
        "status": "queued",
        "target": request.url,
        "message": "Scan started successfully",
        "domain": host,
    }

@router.get("/scan/{scan_id}/status")
async def scan_status(scan_id: str):
    """Get scan status"""
    progress = random.randint(10, 100)
    threats = []
    
    if progress > 30:
        threats.append({
            "module": "Agentic Discovery", 
            "severity": "Info", 
            "description": "Mapped 15 shadow DOM nodes (Mock)"
        })
    if progress > 60:
        threats.append({
            "module": "Logic Lab", 
            "severity": "Critical", 
            "description": "BOLA Vulnerability detected (Mock)"
        })
    
    return {
        "scan_id": scan_id,
        "progress": progress,
        "status": "processing" if progress < 100 else "completed",
        "live_threats": threats
    }

@router.post("/privacy/scrub")
async def scrub_pii(request: ScrubRequest):
    """Scrub PII from text"""
    text = request.text
    # Simple mock PII scrubbing
    redacted = text.replace("john.doe@example.com", "[EMAIL_REDACTED]")
    redacted = redacted.replace("555-1234", "[PHONE_REDACTED]")
    
    return {
        "original": text,
        "redacted": redacted,
        "engine": "Mock Scrubber"
    }

@router.post("/analyze/bola")
async def analyze_bola(request: BolaAnalysisRequest):
    """Analyze BOLA/IDOR vulnerability using OpenRouter AI"""
    result = await reasoner.analyze_bole_flaw(request.endpoint, request.user_id)
    return result

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "services": {
            "api": "operational",
            "scanner": "operational", 
            "scrubber": "operational"
        }
    }


@router.post("/authorized/verify")
async def verify_domain(request: DomainVerificationRequest):
    """Attempt a simple HTTP-based ownership check before marking domain as verified.

    This is still a lightweight check, but it no longer blindly accepts every domain.
    It expects the target domain to expose a well-known file containing a verification token.
    """

    domain = request.domain.strip().lower()
    token = request.token.strip()

    if not domain:
        raise HTTPException(status_code=400, detail="Domain is required.")
    if not token:
        raise HTTPException(status_code=400, detail="Verification token is required.")

    # Basic sanity checks
    if " " in domain or "/" in domain:
        raise HTTPException(status_code=400, detail="Domain must not contain spaces or paths.")

    # Very simple HTTP check: look for a token in a well-known path on the target domain
    # In a real system this would likely be DNS TXT records + multiple fallback strategies.
    url = f"https://{domain}/.well-known/secureway.txt"

    try:
        resp = requests.get(url, timeout=5)
    except requests.RequestException:
        raise HTTPException(status_code=400, detail="Could not reach domain for verification.")

    if resp.status_code != 200:
        raise HTTPException(status_code=400, detail="Verification file not found on target domain.")

    content = resp.text or ""
    if token not in content:
        raise HTTPException(status_code=400, detail="Expected verification token not found in secureway.txt on target domain.")

    # If we get here, treat the domain as verified
    verified_domains.add(domain)

    return {
        "domain": domain,
        "status": "verified",
        "message": "Domain verified via secureway.txt and enabled for SecureWay scans.",
    }


@router.post("/pipeline/analyze_code")
async def analyze_code(request: CodeAnalysisRequest):
    result = _analyze_code_security(request.code, request.language)

    deploy_approved = False
    if result["decision"] == "allow" and request.auto_deploy:
        deploy_approved = True

    return {
        "decision": result["decision"],
        "message": result["message"],
        "issues": result["issues"],
        "auto_deploy": request.auto_deploy,
        "deploy_approved": deploy_approved,
    }
