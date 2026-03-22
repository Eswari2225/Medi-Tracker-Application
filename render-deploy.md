# 🚀 Deploying MediTracker to Render

## Prerequisites
- Render.com account (sign up at https://render.com)
- GitHub account with this repository pushed
- Environment variables ready

## Step 1: Prepare Your Repository

1. Make sure all code is committed to GitHub:
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

2. Ensure `.env` and sensitive files are in `.gitignore` (already included)

## Step 2: Set Up Database on Render (Optional)

If you want to use PostgreSQL instead of SQLite:

1. Go to Render dashboard
2. Create a new PostgreSQL database
3. Copy the connection string (it will look like: `postgresql://user:password@host:port/database`)

## Step 3: Deploy Backend

1. Go to https://render.com/dashboard
2. Click "New +" → "Web Service"
3. Select your GitHub repository
4. Configure:
   - **Name**: `meditracker-backend`
   - **Runtime**: `Python 3.11`
   - **Build Command**: `cd backend && pip install -r requirements.txt`
   - **Start Command**: `cd backend && gunicorn app:create_app()`
   - **Plan**: Free (or paid as needed)

5. Add Environment Variables:
   - `SECRET_KEY`: Generate a secure key (use: `python -c "import secrets; print(secrets.token_hex(32))"`)
   - `FLASK_ENV`: `production`
   - `FLASK_DEBUG`: `False`
   - `DATABASE_URL`: Your PostgreSQL connection string (if using PostgreSQL)
   - `MAIL_USERNAME`: Your Gmail address
   - `MAIL_PASSWORD`: Your Gmail app password
   - `MAIL_SERVER`: `smtp.gmail.com`
   - `MAIL_PORT`: `587`

6. Click "Deploy"

## Step 4: Deploy Frontend

1. Click "New +" → "Web Service"
2. Select your GitHub repository (same one)
3. Configure:
   - **Name**: `meditracker-frontend`
   - **Runtime**: `Node.js`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Start Command**: `cd frontend && npm install -g serve && serve -s build -l 3000`
   - **Plan**: Free (or paid as needed)

4. Add Environment Variables:
   - `REACT_APP_API_URL`: `https://your-backend-url.onrender.com` (backend's public URL)

5. Click "Deploy"

## Step 5: Update Frontend API Configuration

After deployment, update `frontend/src/services/api.js`:

```javascript
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
```

Or for production:
```javascript
const API_BASE = process.env.NODE_ENV === 'production' 
  ? "https://your-backend-url.onrender.com/api"
  : "http://localhost:5000/api";
```

## Step 6: Configure CORS

The backend already has CORS enabled. Verify in `backend/app.py`:
```python
CORS(app)  # This allows frontend to communicate with backend
```

## Monitoring & Troubleshooting

1. **Check Logs**:
   - Go to your service → "Logs"
   - Look for any errors

2. **Common Issues**:
   - **502 Bad Gateway**: Backend crashed. Check logs.
   - **Connection Refused**: Frontend can't reach backend. Check `REACT_APP_API_URL`.
   - **Database Errors**: Make sure PostgreSQL URL is correct in env variables.

3. **Free Tier Limits**:
   - Services spin down after 15 minutes of inactivity
   - Spinning up takes 30-50 seconds
   - Free SSL certificate included
   - Automatic deployments on git push

## Local Testing Before Deployment

Test locally first:
```bash
python run.py
```

This will start:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

## Getting Gmail App Password

For email notifications to work:
1. Enable 2FA on your Google account
2. Go to https://myaccount.google.com/apppasswords
3. Generate app-specific password
4. Use this in `MAIL_PASSWORD` environment variable

## Custom Domain (Optional)

1. Go to your service settings
2. Add custom domain
3. Update DNS records as instructed
4. Update `REACT_APP_API_URL` to use your domain

## Database Backups

For free PostgreSQL, Render includes automatic backups. For production:
1. Go to Database → Backups
2. Enable automated backups
3. Adjust backup frequency as needed

---

**Happy Deploying! 🎉**
