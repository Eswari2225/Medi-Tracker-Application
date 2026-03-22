# 🚀 RENDER WEB SERVICE CONFIGURATION

## COPY-PASTE CONFIGURATION FOR RENDER

This document contains all the exact settings you need to configure your MediTracker web service on Render.

---

## 📋 OPTION 1: DEPLOY BACKEND SERVICE

### Service Details

```
Name:                    meditracker-backend
Language:                Python 3.11
Branch:                  main
Region:                  Singapore (Southeast Asia)
Root Directory:          backend
Build Command:           pip install -r requirements.txt
Start Command:           gunicorn wsgi:app
Instance Type:           Free (or Starter for production)
```

### Environment Variables for Backend

Copy and paste each one:

```
NAME: SECRET_KEY
VALUE: [Generate with: python -c "import secrets; print(secrets.token_hex(32))"]

NAME: FLASK_ENV
VALUE: production

NAME: FLASK_DEBUG
VALUE: False

NAME: MAIL_SERVER
VALUE: smtp.gmail.com

NAME: MAIL_PORT
VALUE: 587

NAME: MAIL_USERNAME
VALUE: your-email@gmail.com

NAME: MAIL_PASSWORD
VALUE: your-16-char-app-password-from-gmail

NAME: MAIL_USE_TLS
VALUE: True

NAME: ALERT_EMAIL_FROM
VALUE: no-reply@meditracker.local
```

---

## 📋 OPTION 2: DEPLOY FRONTEND SERVICE

### Service Details

```
Name:                    meditracker-frontend
Language:                Node
Branch:                  main
Region:                  Singapore (Southeast Asia)
Root Directory:          frontend
Build Command:           npm install && npm run build
Start Command:           npm install -g serve && serve -s build -l 3000
Instance Type:           Free (or Starter for production)
```

### Environment Variables for Frontend

```
NAME: REACT_APP_API_URL
VALUE: https://meditracker-backend.onrender.com
```

*Note: Replace `meditracker-backend` with your actual backend service name if different*

---

## ⭐ OPTION 3: DEPLOY BOTH SERVICES AT ONCE (RECOMMENDED)

### Use Blueprint Method

1. Go to: **https://dashboard.render.com**
2. Click: **"New +"** → **"Blueprint"**
3. Select Repository: **Medi-Tracker-Application**
4. Render automatically reads `render.yaml` and deploys both services!

**No manual configuration needed - Blueprint does it all!**

---

## 🔐 GENERATE SECRET_KEY

Run this command in PowerShell and copy the output:

```powershell
python -c "import secrets; print(secrets.token_hex(32))"
```

Example output:
```
a3f8d2e9c1b4f7a6e2c9d1b8f3a5e7c0d2f4a6b8c0e2f4a6c8d0e2f4a6b8
```

Use this entire string as the SECRET_KEY value.

---

## 📧 GMAIL APP PASSWORD

### How to Get Gmail App Password:

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in to your Google Account
3. Enable 2-Factor Authentication (if not already enabled)
4. Select:
   - App: **Mail**
   - Device: **Windows Computer** (or your OS)
5. Click: **Generate**
6. Google provides a 16-character password
7. Copy this password to `MAIL_PASSWORD` in Render

Example: `xxxx xxxx xxxx xxxx` (4 groups of 4 characters)

---

## 📊 DEPLOYMENT WORKFLOW

### Step-by-Step:

#### **If Using Blueprint (Easiest):**

```
1. Dashboard → New → Blueprint
2. Select: Medi-Tracker-Application
3. Click: Deploy
4. Wait: 10-15 minutes
5. Environment → Add Variables (REACT_APP_API_URL for frontend)
6. Backend Environment → Add Variables (all backend vars)
7. Auto-redeploys with new env vars
8. Done! 🎉
```

#### **If Creating Services Manually:**

```
First, create Backend Service:
1. Dashboard → New → Web Service
2. Select: Medi-Tracker-Application
3. Name: meditracker-backend
4. Language: Python 3.11
5. Branch: main
6. Root Directory: backend
7. Build: pip install -r requirements.txt
8. Start: gunicorn wsgi:app
9. Environment: Add all backend variables
10. Click: Create Web Service

Then, create Frontend Service:
1. Dashboard → New → Web Service
2. Select: Medi-Tracker-Application
3. Name: meditracker-frontend
4. Language: Node
5. Branch: main
6. Root Directory: frontend
7. Build: npm install && npm run build
8. Start: npm install -g serve && serve -s build -l 3000
9. Environment: Add REACT_APP_API_URL = https://meditracker-backend.onrender.com
10. Click: Create Web Service

Wait for both to deploy (15-20 minutes total)
```

---

## 🎯 IMPORTANT SETTINGS

### Build Command Details

**Backend:**
```
pip install -r requirements.txt
```
This installs:
- Flask
- Gunicorn
- SQLAlchemy
- APScheduler
- And all other Python dependencies

**Frontend:**
```
npm install && npm run build
```
This:
1. Installs Node dependencies
2. Builds optimized React bundle
3. Creates `frontend/build/` directory

### Start Command Details

**Backend:**
```
gunicorn wsgi:app
```
This:
1. Starts production WSGI server
2. Runs on port 5000
3. Handles multiple requests
4. Production-grade server

**Frontend:**
```
npm install -g serve && serve -s build -l 3000
```
This:
1. Installs `serve` package globally
2. Serves built React app
3. Runs on port 3000
4. Production-ready static server

---

## ✅ VERIFICATION CHECKLIST

After Services Deploy:

```
[ ] Backend service shows green checkmark
[ ] Frontend service shows green checkmark
[ ] Backend logs show "Application running" or similar
[ ] Frontend logs show "Accepting connections" or similar
[ ] Can access frontend URL in browser
[ ] Frontend loads without errors
[ ] Can register a new user
[ ] Can add medications
[ ] Can record vital signs
[ ] API calls work (check browser console)
```

---

## 🧪 TESTING YOUR DEPLOYMENT

### Test Backend Health:

Open in browser or PowerShell:
```
https://meditracker-backend.onrender.com/health
```

Should return:
```json
{"status": "healthy"}
```

### Test Frontend:

1. Click the frontend service URL
2. Page should load normally
3. Try to register: test@example.com / password123
4. Add a medication: "Aspirin" at times "09:00,21:00"
5. Record vital signs: Heart rate 70, BP 120/80
6. Everything should work!

### Check Logs:

For each service:
1. Click the service name
2. Click **"Logs"** tab
3. Watch real-time logs
4. Look for errors (they'll be red)

---

## 🚨 IF SOMETHING GOES WRONG

### 502 Bad Gateway Error

Means backend crashed. Check:
1. Service logs for Python errors
2. Environment variables are all set
3. No typos in SECRET_KEY
4. gunicorn command is correct

### Frontend Can't Connect to Backend

Check:
1. REACT_APP_API_URL is set correctly
2. Backend service is running (green checkmark)
3. Backend URL matches service name
4. Browser console for CORS errors

### Build Failed

Check:
1. Build command is correct
2. No syntax errors in code
3. All dependencies in requirements.txt/package.json
4. Build logs for specific error

### Deployment Stuck

1. Wait 2-3 minutes (sometimes slow)
2. Check if there are build errors in logs
3. Try manual restart: Service → Settings → Restart
4. Contact Render support if still stuck

---

## 📈 AFTER DEPLOYMENT

### Monitor Services:

1. Dashboard shows all services
2. Green = running, Red = error
3. Click service to see details
4. Logs auto-update in real-time
5. Metrics tab shows CPU/memory/disk

### Update Code:

When you push to GitHub:
```powershell
git add .
git commit -m "Update message"
git push origin main
```

Render automatically:
1. Detects the push
2. Rebuilds services
3. Redeploys changes
4. No manual action needed!

### Scale Up (Later):

If you need more power:
1. Service → Settings
2. Change Instance Type from Free → Starter/Standard/Pro
3. Auto-redeploys with more resources

---

## 💰 PRICING REMINDER

**Free Tier:**
- $0/month
- 512 MB RAM
- Services sleep after 15 min inactivity
- Perfect for testing/development

**Starter (Recommended for Production):**
- $7/month
- 512 MB RAM
- Always running
- Good for small apps

**Standard or higher:**
- More CPU/RAM for high traffic

---

## 🔗 QUICK LINKS

**Render Dashboard:**
https://dashboard.render.com

**Your Repository:**
https://github.com/Eswari2225/Medi-Tracker-Application

**Services Will Be At:**
- Frontend: https://meditracker-frontend.onrender.com
- Backend: https://meditracker-backend.onrender.com

---

## 📝 CONFIGURATION SUMMARY TABLE

| Setting | Backend Value | Frontend Value |
|---------|--------------|----------------|
| **Name** | meditracker-backend | meditracker-frontend |
| **Language** | Python 3.11 | Node |
| **Branch** | main | main |
| **Root Directory** | backend | frontend |
| **Build Command** | pip install -r requirements.txt | npm install && npm run build |
| **Start Command** | gunicorn wsgi:app | npm install -g serve && serve -s build -l 3000 |
| **Region** | Singapore | Singapore |
| **Instance Type** | Free | Free |
| **Port** | 5000 | 3000 |

---

## 🎊 YOU'RE READY!

Everything is configured. Just:

1. Go to Render Dashboard
2. Create new web service (or use Blueprint)
3. Copy settings from this guide
4. Add environment variables
5. Click Deploy
6. Wait 15-20 minutes
7. Your app is LIVE! 🚀

---

*Configuration guide complete. Happy hosting!* ✨
