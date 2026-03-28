# SecureWay Railway Deployment - NO NPM/CLI Required

## 🚀 Deploy via Railway Web Dashboard (Browser Only)

Since you're using Python/Django and don't want npm, here's the **web-based deployment** method:

---

## Method 1: GitHub + Railway Dashboard (Recommended)

### Step 1: Push Code to GitHub

```bash
# In your project folder
git init
git add .
git commit -m "Initial commit for Railway deployment"

# Create GitHub repo first, then:
git remote add origin https://github.com/YOUR_USERNAME/secureway.git
git push -u origin main
```

### Step 2: Deploy via Railway Web UI

1. **Go to**: https://railway.app/
2. **Login** with GitHub/Google
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose your `secureway` repository
6. Railway auto-detects Python and deploys!

### Step 3: Add PostgreSQL Database

1. In Railway Dashboard, click **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway auto-connects it to your app

### Step 4: Set Environment Variables

In Railway Dashboard:
1. Go to your project → **"Variables"** tab
2. Click **"New Variable"** and add each:

```
SECRET_KEY=your-generated-secret-key
DEBUG=False
DJANGO_SETTINGS_MODULE=secureway.settings
KALI_HOST=192.168.179.183
KALI_USER=kali
KALI_PASS=your-kali-password
KALI_PORT=22
OPENROUTER_API_KEY=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
OPENROUTER_MODEL=arcee-ai/trinity-large-preview:free
```

Generate SECRET_KEY:
```python
import secrets
print(secrets.token_urlsafe(50))
```

### Step 5: Deploy!

Railway automatically deploys when you push to GitHub or click "Deploy" in dashboard.

---

## Method 2: Railway Template (One-Click)

1. Go to: https://railway.app/templates
2. Search "Django" or use this URL directly:
   ```
   https://railway.app/new/template/python-django
   ```
3. Fill in your GitHub repo URL
4. Railway configures everything automatically

---

## Method 3: Upload ZIP (No Git)

If you don't use Git:

1. Zip your project folder (without venv/)
2. Go to https://railway.app/
3. **New Project** → **"Upload"** → Select ZIP
4. Railway detects Python and deploys

---

## 📋 Post-Deploy Setup (Railway Dashboard)

### Run Migrations:

1. In Railway Dashboard, go to your service
2. Click **"Shell"** tab (opens browser terminal)
3. Run:
```bash
python manage.py migrate
python manage.py createsuperuser
```

### Collect Static Files:

This runs automatically via `railway.yaml` build command.

---

## 🔧 Files Required (Already Created)

1. **railway.yaml** - Deployment configuration
2. **requirements.txt** - Dependencies
3. **Procfile** - Process config
4. **runtime.txt** - Python version

---

## 🌐 Access Your Deployed App

1. In Railway Dashboard → your service
2. Click **"Settings"** tab
3. Under **"Public Domain"**, click **"Generate Domain"**
4. Your app is live at: `https://your-app-name.up.railway.app`

---

## 📊 Railway Dashboard Features

| Feature | How to Access |
|---------|---------------|
| **Logs** | Service → "Logs" tab |
| **Variables** | Service → "Variables" tab |
| **Database** | Project → "secureway-db" → "Connect" tab |
| **Shell** | Service → "Shell" tab |
| **Metrics** | Service → "Metrics" tab |
| **Settings** | Service → "Settings" tab |

---

## 🔄 Redeploy

**Option A**: Push new code to GitHub → Auto redeploy
**Option B**: Railway Dashboard → Click **"Deploy"** button

---

## 💰 Free Tier Limits

- **Database**: 500 MB storage (PostgreSQL)
- **Compute**: $5 free credit per month
- **Bandwidth**: 100 GB/month
- **Sleep**: Free tier doesn't sleep (unlike Render)

---

## 🆘 Troubleshooting (Web UI)

### Check Build Logs:
Dashboard → Service → "Deployments" → Click latest deployment → "Build Logs"

### Check Runtime Logs:
Dashboard → Service → "Logs" tab

### Restart Service:
Dashboard → Service → "Settings" → Click **"Restart"**

### Database Issues:
Dashboard → "secureway-db" → "Variables" → Check `DATABASE_URL`

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Railway project created
- [ ] PostgreSQL database added
- [ ] Environment variables set
- [ ] Domain generated
- [ ] Migrations run
- [ ] Superuser created
- [ ] Kali SSH connection tested

---

## 🎯 Next Steps

1. **Test**: Visit your deployed URL
2. **Login**: Use superuser credentials
3. **Test AI SSH**: Go to `/ai-ssh-terminal/`
4. **Check Kali**: Verify SSH connection works

**No npm, no CLI, pure Python/Django! 🐍🚀**
