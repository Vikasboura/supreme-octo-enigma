# SecureWay Django Deployment Guide - Railway

## 🚀 Step-by-Step Railway Deployment Guide

### Prerequisites
- Railway CLI installed: `npm install -g @railway/cli`
- Git repository initialized
- Railway account (railway.app)

---

## Step 1: Install Railway CLI

```bash
# Windows (PowerShell as Admin)
npm install -g @railway/cli

# OR using npx (no install)
npx @railway/cli login
```

---

## Step 2: Login to Railway

```bash
railway login
```
This will open a browser window to authenticate.

---

## Step 3: Initialize Project

```bash
# Navigate to your project folder
cd "C:\Users\vikas\OneDrive\Desktop\IP Bhai\SecureWay 27326\SecureConnect"

# Initialize Railway project
railway init
```
Select:
- "New Project" → Name it "secureway"

---

## Step 4: Add PostgreSQL Database

```bash
railway add
```
Select:
- Database → PostgreSQL

This creates a `DATABASE_URL` environment variable automatically.

---

## Step 5: Set Environment Variables

```bash
# Set all required environment variables
railway variables set SECRET_KEY="your-secure-random-key-here"
railway variables set DEBUG="False"
railway variables set KALI_HOST="192.168.179.183"
railway variables set KALI_USER="kali"
railway variables set KALI_PASS="kali"
railway variables set KALI_PORT="22"
railway variables set OPENROUTER_API_KEY="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"
railway variables set OPENROUTER_MODEL="arcee-ai/trinity-large-preview:free"

# Verify variables
railway variables
```

Generate a new SECRET_KEY:
```bash
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

---

## Step 6: Deploy

```bash
railway up
```

This will:
1. Build the project (install requirements)
2. Collect static files
3. Deploy to Railway

---

## Step 7: Run Migrations

```bash
# Open Railway shell
railway shell

# Inside the shell:
python manage.py migrate
python manage.py createsuperuser
exit
```

---

## Step 8: Get Public URL

```bash
railway status
```

Or check Railway Dashboard: https://railway.app/dashboard

---

## 🔄 Redeploy (After Code Changes)

```bash
# Make changes to code
# Then:
railway up
```

---

## 📋 Useful Railway Commands

```bash
# View logs
railway logs

# View logs in real-time
railway logs -f

# Open project in browser
railway open

# View environment variables
railway variables

# Connect to database
railway connect

# Restart service
railway restart
```

---

## 🔧 Troubleshooting

### Issue: Static files not loading
**Solution**: Check `railway.json` build command includes collectstatic

### Issue: Database connection failed
**Solution**: Verify `DATABASE_URL` is set in Railway variables

### Issue: SSH to Kali not working
**Solution**: 
- Check Kali IP is accessible from Railway
- Ensure port 22 is open
- Verify password authentication is enabled

### Issue: Build fails
**Solution**: Check `requirements.txt` has all dependencies

---

## 📁 Files Required for Railway

Your project should have these files:

1. **requirements.txt** - Python dependencies
2. **railway.json** - Railway configuration
3. **Procfile** - Process configuration (optional, railway.json preferred)
4. **runtime.txt** - Python version (optional)

---

## 🌐 Post-Deployment Checklist

- [ ] Website loads without errors
- [ ] Static files (CSS/JS) working
- [ ] Database migrations applied
- [ ] Superuser created
- [ ] SSH connection to Kali working
- [ ] AI commands executing properly
- [ ] All dashboard features accessible

---

## 💰 Railway Pricing

- **Starter Plan**: $5/month credit (includes database)
- **Hobby**: $0 (sleep after inactivity)
- For free tier: Use Railway's free trial ($5 credit)

---

## 📞 Railway Support

- Docs: https://docs.railway.app/
- Discord: https://discord.gg/railway
- Status: https://railway.app/status
