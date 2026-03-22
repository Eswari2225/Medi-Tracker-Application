# 📖 MediTracker - Complete Setup & Deployment Guide

## 🏃 Quick Start (Local Development)

### Option 1: Run Both Services Together (Recommended)
```bash
python run.py
```
This will:
- Start backend on http://localhost:5000
- Start frontend on http://localhost:3000
- Ensure backend is ready before starting frontend

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
cd backend
python -m venv venv
# On Windows: venv\Scripts\activate
# On Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
python app.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm start
```

## 🔧 Configuration

### Environment Variables
Copy `.env.example` to `.env` and update:
```bash
cp .env.example .env
```

### Backend Configuration (`backend/config.py`)
- **SECRET_KEY**: Used for session encryption
- **DATABASE_URL**: Database connection string
- **MAIL_***: Email configuration for notifications

### Frontend API Configuration (`frontend/src/services/api.js`)
The frontend automatically connects to:
- Local: `http://localhost:5000/api`
- Production: Set via `REACT_APP_API_URL` env variable

## 📦 Dependencies

### Backend
- Flask 2.3.2
- Flask-CORS
- Flask-SQLAlchemy
- APScheduler (for medication reminders)
- Gunicorn (for production)

### Frontend
- React 18.2.0
- Axios (for API calls)
- Chart.js (for health data visualization)

## 🚀 Deploying to Render

### Method 1: Using render.yaml (Recommended)

1. Push code to GitHub:
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

2. Go to https://render.com
3. Click "New" → "Blueprint"
4. Connect your GitHub repository
5. Render will automatically deploy using `render.yaml`

### Method 2: Manual Deployment

#### Deploy Backend
1. Create new Web Service on Render
2. Configure:
   - Build: `cd backend && pip install -r requirements.txt`
   - Start: `cd backend && gunicorn wsgi:app`
3. Set environment variables (see below)

#### Deploy Frontend
1. Create another Web Service on Render
2. Configure:
   - Build: `cd frontend && npm install && npm run build`
   - Start: `serve -s build -l 3000`
3. Set `REACT_APP_API_URL` = your backend's public URL

### Required Environment Variables

**Backend:**
```
SECRET_KEY = (generate with: python -c "import secrets; print(secrets.token_hex(32))")
FLASK_ENV = production
FLASK_DEBUG = False
MAIL_USERNAME = your-email@gmail.com
MAIL_PASSWORD = your-app-specific-password
DATABASE_URL = postgresql://... (if using PostgreSQL)
```

**Frontend:**
```
REACT_APP_API_URL = https://your-backend.onrender.com
```

## 🗄️ Database Setup

### Local Development
- Uses SQLite (auto-created at `backend/meditracker.db`)

### Production (Render)
1. Create PostgreSQL database on Render
2. Get connection string
3. Set `DATABASE_URL` in backend environment variables
4. Database tables auto-create on first run

## 📧 Email Configuration

For caretaker alerts to work:

1. Enable 2-Factor Authentication on Gmail
2. Generate app password:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Copy the generated password
3. Set `MAIL_PASSWORD` in environment variables

## 🔍 Testing

### Health Check
```bash
curl http://localhost:5000/
# Should return: {"message": "MediTracker API running"}
```

### Frontend Access
Open http://localhost:3000 in browser

## 🐛 Troubleshooting

### Backend Won't Start
```bash
# Check Python version
python --version  # Should be 3.8+

# Clear cache
rm -rf backend/__pycache__
rm -rf backend/.venv

# Reinstall dependencies
pip install -r backend/requirements.txt
```

### Frontend Won't Start
```bash
# Check Node version
node --version  # Should be 16+

# Clear cache
rm -rf frontend/node_modules
rm frontend/package-lock.json

# Reinstall
cd frontend && npm install && npm start
```

### API Connection Issues
1. Check backend is running: `curl http://localhost:5000/`
2. Check frontend API URL in `frontend/src/services/api.js`
3. Check CORS is enabled in `backend/app.py`

### Database Issues
```bash
# Reset database (careful!)
rm backend/meditracker.db

# Tables will be auto-created on next run
python backend/app.py
```

## 📊 Project Structure

```
MediTracker/
├── backend/
│   ├── app.py              # Flask app factory
│   ├── config.py           # Configuration
│   ├── models.py           # Database models
│   ├── scheduler.py        # Reminder scheduler
│   ├── wsgi.py             # Production entry point
│   ├── requirements.txt    # Python dependencies
│   └── routes/             # API endpoints
│       ├── auth.py         # Authentication
│       ├── medication.py   # Medication management
│       ├── vitals.py       # Health vitals tracking
│       └── reminders.py    # Reminder endpoints
│
├── frontend/
│   ├── package.json        # NPM dependencies
│   ├── public/
│   │   └── index.html      # HTML template
│   └── src/
│       ├── App.js          # Main app component
│       ├── services/
│       │   └── api.js      # API client
│       └── components/     # React components
│           ├── Dashboard.js
│           ├── Medication.js
│           ├── VitalSigns.js
│           └── ReminderTest.js
│
├── run.py                  # Run both services
├── Procfile                # Render deployment config
├── render.yaml             # Render Blueprint config
└── .env.example            # Environment template
```

## 🔐 Security Checklist

Before production:
- [ ] Set unique `SECRET_KEY` in environment
- [ ] Enable HTTPS (automatic on Render)
- [ ] Use strong database passwords
- [ ] Never commit `.env` or sensitive data
- [ ] Use environment variables for all secrets
- [ ] Set `FLASK_DEBUG=False` in production
- [ ] Review CORS settings for your domain
- [ ] Enable database backups

## 📝 Additional Resources

- Flask Documentation: https://flask.palletsprojects.com/
- React Documentation: https://react.dev/
- Render Documentation: https://render.com/docs
- SQLAlchemy: https://www.sqlalchemy.org/

## ✨ Features Implemented

- ✅ User authentication (register/login)
- ✅ Medication management with reminders
- ✅ Vital signs tracking
- ✅ Health data visualization
- ✅ Automated reminder system
- ✅ Caretaker email alerts
- ✅ Beautiful responsive UI
- ✅ Production-ready deployment

---

**Need help?** Check the troubleshooting section or review the code comments.
