# 🚀 MediTracker - Quick Start Guide

## ⚡ Local Development (Windows)

### 1️⃣ First Time Setup

```powershell
# Install Python dependencies
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cd ..

# Install Node dependencies
cd frontend
npm install
cd ..
```

### 2️⃣ Run Everything Together

```powershell
# From project root, run both backend and frontend automatically
python run.py
```

✅ **Done!** Access:
- 🌐 Frontend: http://localhost:3000
- 🔌 Backend API: http://localhost:5000

---

## 🎯 Run Separately (If Needed)

### Backend Only
```powershell
cd backend
venv\Scripts\activate
python app.py
```

### Frontend Only
```powershell
cd frontend
npm start
```

---

## 🌐 Deploy to Render

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

### Step 2: Deploy on Render

**Option A: Automatic (Recommended)**
1. Go to https://render.com
2. Click "New" → "Blueprint"
3. Connect your GitHub repo
4. Render auto-deploys using `render.yaml`

**Option B: Manual**
1. Create Backend Service:
   - Runtime: Python 3.11
   - Build: `cd backend && pip install -r requirements.txt`
   - Start: `cd backend && gunicorn wsgi:app`

2. Create Frontend Service:
   - Runtime: Node 18
   - Build: `cd frontend && npm install && npm run build`
   - Start: `serve -s build -l 3000`

### Step 3: Set Environment Variables

**Backend variables:**
```
SECRET_KEY = (run: python -c "import secrets; print(secrets.token_hex(32))")
FLASK_ENV = production
FLASK_DEBUG = False
MAIL_USERNAME = your-email@gmail.com
MAIL_PASSWORD = your-app-password
```

**Frontend variables:**
```
REACT_APP_API_URL = https://your-backend.onrender.com
```

---

## 📝 File Descriptions

| File | Purpose |
|------|---------|
| `run.py` | Run both frontend & backend together locally |
| `Procfile` | Render deployment config |
| `render.yaml` | Infrastructure as Code for Render |
| `wsgi.py` | WSGI entry point for production |
| `.env.example` | Environment variables template |
| `.env.local` | Local dev environment variables |
| `DEPLOYMENT_GUIDE.md` | Detailed deployment steps |

---

## ✅ Checklist Before Production

- [ ] Updated `SECRET_KEY` in Render env variables
- [ ] Set `FLASK_DEBUG=False` in production
- [ ] Configured email credentials (Gmail app password)
- [ ] Set `REACT_APP_API_URL` to your backend's URL
- [ ] Enabled HTTPS (automatic on Render)
- [ ] Tested locally with `python run.py`
- [ ] All code pushed to GitHub

---

## 🔧 Common Commands

```powershell
# Clear Python cache
Remove-Item -Path backend\__pycache__ -Recurse
Remove-Item -Path backend\routes\__pycache__ -Recurse

# Clear Node modules and reinstall
Remove-Item -Path frontend\node_modules -Recurse
cd frontend
npm install
cd ..

# Test backend health
curl http://localhost:5000/health

# Kill port processes (if stuck)
# For Windows, find what's using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check Python 3.8+, reinstall requirements |
| Frontend won't start | Check Node 16+, delete node_modules & npm install |
| API connection error | Check backend URL in frontend/src/services/api.js |
| Port already in use | Kill process using the port |
| Database error | Delete backend/meditracker.db and restart |

---

**Need more details?** See `DEPLOYMENT_GUIDE.md` for comprehensive documentation.

**Let's build something amazing! 💪**
