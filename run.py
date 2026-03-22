"""
Main entry point to run both backend and frontend together.
This ensures the backend is running before starting the frontend.
"""

import os
import sys
import subprocess
import time
import signal
from pathlib import Path

# Get the project root directory
PROJECT_ROOT = Path(__file__).parent
BACKEND_DIR = PROJECT_ROOT / "backend"
FRONTEND_DIR = PROJECT_ROOT / "frontend"

def run_backend():
    """Start the Flask backend server"""
    print("🚀 Starting Backend Server...")
    backend_process = subprocess.Popen(
        [sys.executable, "app.py"],
        cwd=BACKEND_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    return backend_process

def run_frontend():
    """Start the React frontend server"""
    print("🚀 Starting Frontend Server...")
    # Set environment variable to avoid browser opening automatically
    env = os.environ.copy()
    env['BROWSER'] = 'none'
    
    frontend_process = subprocess.Popen(
        ["npm", "start"],
        cwd=FRONTEND_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        env=env
    )
    return frontend_process

def wait_for_backend(timeout=30):
    """Wait for backend to be ready"""
    import requests
    start_time = time.time()
    
    while time.time() - start_time < timeout:
        try:
            response = requests.get("http://localhost:5000/")
            if response.status_code == 200:
                print("✅ Backend is ready!")
                return True
        except requests.exceptions.ConnectionError:
            time.sleep(1)
    
    print("⚠️  Backend might not be ready, proceeding anyway...")
    return False

def signal_handler(signum, frame):
    """Handle Ctrl+C gracefully"""
    print("\n\n🛑 Shutting down servers...")
    if backend_process:
        backend_process.terminate()
    if frontend_process:
        frontend_process.terminate()
    sys.exit(0)

if __name__ == "__main__":
    # Register signal handler for graceful shutdown
    signal.signal(signal.SIGINT, signal_handler)
    
    backend_process = None
    frontend_process = None
    
    try:
        # Start backend first
        backend_process = run_backend()
        print("⏳ Waiting for backend to initialize...")
        time.sleep(3)  # Give backend time to start
        
        # Check if backend started successfully
        if backend_process.poll() is not None:
            print("❌ Backend failed to start!")
            sys.exit(1)
        
        # Wait for backend to be ready
        wait_for_backend()
        
        # Start frontend
        frontend_process = run_frontend()
        print("⏳ Waiting for frontend to initialize...")
        time.sleep(5)  # Give frontend time to start
        
        print("\n" + "="*60)
        print("✨ MediTracker is running!")
        print("="*60)
        print("🌐 Frontend: http://localhost:3000")
        print("🔌 Backend:  http://localhost:5000")
        print("="*60)
        print("Press Ctrl+C to stop servers\n")
        
        # Keep processes running
        while True:
            if backend_process.poll() is not None:
                print("⚠️  Backend process exited!")
                break
            if frontend_process.poll() is not None:
                print("⚠️  Frontend process exited!")
                break
            time.sleep(1)
            
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
    finally:
        # Cleanup
        if backend_process:
            backend_process.terminate()
        if frontend_process:
            frontend_process.terminate()
