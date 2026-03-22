from flask import Flask
from flask_cors import CORS
from config import Config
from models import db
from routes.auth import auth_bp
from routes.vitals import vitals_bp
from routes.medication import medication_bp
from routes.reminders import reminders_bp
from scheduler import start_scheduler
import os

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

def create_app(config_class=None):
    app = Flask(__name__)
    
    # Use passed config or default to Config
    if config_class:
        app.config.from_object(config_class)
    else:
        app.config.from_object(Config)
    
    # Enable CORS for all routes
    CORS(app, resources={
        r"/api/*": {
            "origins": ["*"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    db.init_app(app)

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(vitals_bp, url_prefix="/api/vitals")
    app.register_blueprint(medication_bp, url_prefix="/api/medication")
    app.register_blueprint(reminders_bp, url_prefix="/api/reminders")

    @app.route("/")
    def index():
        return {"message": "MediTracker API running", "status": "ok"}
    
    @app.route("/health")
    def health():
        """Health check endpoint for Render"""
        return {"status": "healthy"}, 200

    with app.app_context():
        # create tables
        db.create_all()

    # start reminder scheduler
    start_scheduler(app)

    return app

if __name__ == "__main__":
    app = create_app()
    # Get port from environment or default to 5000
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=os.environ.get("FLASK_DEBUG", False), port=port, host="0.0.0.0")
