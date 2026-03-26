<div align="center">
  <h1>🔐 SECUREWAY</h1>
  <p><b>The Phase 0 Cognitive Security Logic Engine</b></p>
  <p><i>Developed for India Innovation 2026 Hackathon</i></p>
  <br/>
  <p>
    <img src="https://img.shields.io/badge/Python-3.12-blue?style=for-the-badge&logo=python" />
    <img src="https://img.shields.io/badge/Django-5.x-green?style=for-the-badge&logo=django" />
    <img src="https://img.shields.io/badge/PyTorch-LSTM-red?style=for-the-badge&logo=pytorch" />
    <img src="https://img.shields.io/badge/TailwindCSS-Luxury_Cream-teal?style=for-the-badge&logo=tailwind-css" />
    <img src="https://img.shields.io/badge/Celery_Redis-Async-darkred?style=for-the-badge&logo=redis" />
  </p>
</div>

---

## 🚀 Overview

**SECUREWAY** is an advanced, autonomous web application security platform. Unlike traditional scanners that rely on static regex patterns and basic payloads, SECUREWAY operates as a **Cognitive Security Agent**. It understands the *intention* and *business logic* of modern web applications, effectively mimicking a human red-team operator.

Presented in an exclusive **"Luxury Technical" Ivory/Tan aesthetic**, the platform delivers unparalleled user experience. Our engine autonomously maps complex Shadow DOMs, correlates network responses to discover Business Object Level Authorization (BOLA) flaws, verifies Server-Side Request Forgery (SSRF) via Out-of-Band (OAST) networks, and provides dynamic, self-healing mitigation patches.

---

## 🏆 Hackathon Demo Features (Working vs. Roadmap)

### ✅ Fully Implemented & Working for Demo
*   **Authentication & Protected Routing**: Secure login/registration flows. Routes like `/features/` are intelligently protected requiring active sessions.
*   **Luxury Cream UI/UX**: Completely bespoke frontend styled with Tailwind CSS, featuring glassmorphism, precise typography, overflow-protected data tables, and an interactive theme toggler.
*   **Fast-Track Domain Verification**: Administrators can register and instantly verify external domains to orchestrate immediate scanning without tedious DNS waiting periods.
*   **Dynamic Shadow Map Graphing**: The logic map dynamically generates dense network clusters (35+ nodes) client-side using mathematical SVG plotting, visualizing the spider's exact pathing.
*   **Anomaly Prediction Dashboard**: Real-time rendering of outlier scores utilizing exact mathematical offsets for circle-graph animations.
*   **BOLA & Threat Intelligence Analytics**: Interfaces that report generated exploit variants and logic-flaw scores.
*   **API/Environment Context Loading**: `.env` configurations are automatically piped directly into Django on startup ensuring LLM API keys (OpenAI/OpenRouter) are safely managed.
*   **Contact & Support Infrastructure**: Integrated communication routes linking directly to our Elite Operational Command.

### 🚧 Roadmap (Needs Work for Production)
*   **Full Headless Crawling at Scale**: The current prototype executes concurrent tasks, but full-scale recursive Playwright scraping across 1000+ pages requires a serverless orchestration layer.
*   **Production Vector Database**: Migrating historical attack patterns from JSON memory to a production Pinecone instance.
*   **Live Webhook Execution**: Connecting the simulated Slack/Teams alerts directly into corporate CI/CD pipeline triggers.
*   **Rust PyO3 Extension Native Compilation**: JIT-compiled regex scanning is scaffolded but needs native environment compilation to achieve 100x speeds.

---

## 🧠 Advanced Tech Stack (Deep Dive)

| Layer | Technology | Purpose | Status |
|-------|-----------|---------|--------|
| **Core Logic Server** | Django / Python 3.12 | Backend routing, ORM, authentication, REST API | ✅ Working |
| **Frontend UI** | Tailwind CSS + Vanilla JS | Premium "Luxury Cream" operational dashboard | ✅ Working |
| **AI Reasoning Engine** | OpenRouter / OpenAI API | LLM-powered BOLA/IDOR vulnerability analysis | ✅ Working |
| **Self-Healing Model** | PyTorch LSTM | Classifies traceback signatures → suggests code patches | ✅ Working |
| **Anomaly Detection Model**| PyTorch LSTM | Predicts system crash patterns from scanner metrics | ✅ Working |
| **Statistical Anomaly** | PyOD (Isolation Forest) | Detects metric outliers in scan telemetry | ✅ Working |
| **PII Protection** | Microsoft Presidio | Redacts emails, credit cards, IPs from scan reports | ✅ Working |
| **Task Queue** | Celery + Redis | Async pipeline execution for concurrent scans | ✅ Working |
| **Database** | SQLite3 (Demo) / PostgreSQL | Scan results, user registry, domain verification | ✅ Working |
| **Shadow DOM Crawler** | Playwright (Headless) | Maps hidden DOM elements, SPAs, async endpoints | ⚠️ Simulated |
| **OAST Network** | Interactsh-style callbacks| Blind SSRF / DNS exfiltration verification | ⚠️ Simulated |
| **CI/CD Pipeline** | Bandit SAST + Pytest | Automated security scanning and code patching | ✅ Working |

---

## 🔌 Core Engine Modules

### 1. The Autonomous Scanner
The engine conducts automated dynamic spidering of the target asset. Unlike standard DAST tools, our scanner categorizes URLs structurally, identifying which parameters dictate authorization levels before launching mutation attacks. 

### 2. High-Density Shadow Map
A standout feature of the frontend is the **Shadow Map DOM Logic Visualization**. Using custom-built backend Python generators mapped to dynamic HTML templating, we render a live, breathing representation of the target asset's internal infrastructure, highlighting potential vulnerabilities in real-time.

### 3. Predictive "Oracle" Anomaly Engine
The Oracle is a predictive crash prevention system. It monitors the history of concurrent scan requests and uses an `AnomalyDetectorLSTM` PyTorch model to predict an impending system overload *before* it happens, ensuring stable scanning telemetry.

### 4. BOLA Intelligence Center 
Focuses explicitly on identifying Broken Object Level Authorization (BOLA). It feeds endpoint responses into advanced AI logic engines to deduce whether manipulating parameter IDs results in unauthorized privilege execution.

---

## 💻 Local Setup & Implementation

### Prerequisites
- Python 3.10+
- Git

### Step-by-Step

```bash
# 1. Clone the repository
git clone https://github.com/Ritiksingh96-cmd/SecureWay.git
cd SecureWay

# 2. Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment variables
# Create a .env file in the root directory to store your API keys:
echo OPENAI_API_KEY=your-sk-key-here > .env

# 5. Run database migrations
python manage.py makemigrations
python manage.py migrate

# 6. Start the Django Development Server
python manage.py runserver
# Or use the provided batch script on Windows: run_secureway.bat

# 7. Access the platform
# Open: http://127.0.0.1:8000
```

---

## 👨‍💻 Primary Author & Maintainer

**Ritik Singh**
- Contact Direct Line: +91 - 9315908389
- Operational Support: support@secureway.tech
- GitHub: [Ritiksingh96-cmd](https://github.com/Ritiksingh96-cmd)

<div align="center">
  <br/>
  <p><b>Securing the global logic fabric through autonomous agents.</b></p>
</div>
