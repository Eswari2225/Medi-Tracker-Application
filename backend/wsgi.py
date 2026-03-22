"""
WSGI entry point for production deployment with gunicorn.
This file is used when running: gunicorn wsgi:app
"""

import os
from app import create_app

# Create the Flask app
app = create_app()

if __name__ == "__main__":
    app.run()
