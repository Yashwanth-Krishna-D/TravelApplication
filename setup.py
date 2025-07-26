#!/usr/bin/env python3
"""
AI Travel Planner Setup Script
Automates the installation and configuration of the travel planning application.
"""

import os
import sys
import subprocess
import shutil
from pathlib import Path

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e.stderr}")
        return False

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        return False
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} detected")
    return True

def setup_backend():
    """Setup the Flask backend"""
    print("\n🚀 Setting up Flask Backend...")
    
    # Install Python dependencies
    if not run_command("pip install -r requirements.txt", "Installing Python dependencies"):
        return False
    
    # Create .env file if it doesn't exist
    env_file = Path(".env")
    if not env_file.exists():
        print("📝 Creating .env file...")
        shutil.copy(".env.example", ".env")
        print("✅ .env file created. Please edit it with your API keys.")
    else:
        print("✅ .env file already exists")
    
    return True

def setup_frontend():
    """Setup the React frontend"""
    print("\n🎨 Setting up React Frontend...")
    
    client_dir = Path("client")
    if not client_dir.exists():
        print("❌ Client directory not found. Please ensure the React app is properly scaffolded.")
        return False
    
    # Check if Node.js is installed
    if not run_command("node --version", "Checking Node.js installation"):
        print("❌ Node.js is not installed. Please install Node.js from https://nodejs.org/")
        return False
    
    # Install npm dependencies
    os.chdir("client")
    if not run_command("npm install", "Installing npm dependencies"):
        os.chdir("..")
        return False
    os.chdir("..")
    
    return True

def check_requirements():
    """Check if all required tools are installed"""
    print("\n🔍 Checking Requirements...")
    
    requirements = [
        ("python", "Python"),
        ("pip", "Pip"),
        ("node", "Node.js"),
        ("npm", "npm"),
    ]
    
    all_good = True
    for command, name in requirements:
        if not run_command(f"{command} --version", f"Checking {name}"):
            all_good = False
    
    return all_good

def print_next_steps():
    """Print next steps for the user"""
    print("\n" + "="*60)
    print("🎉 Setup Complete!")
    print("="*60)
    print("\n📋 Next Steps:")
    print("1. Edit the .env file with your API keys:")
    print("   - MONGODB_URI: Your MongoDB connection string")
    print("   - OPENTRIPMAP_API_KEY: Get from https://opentripmap.io/")
    print("   - OPENAI_API_KEY: Get from https://platform.openai.com/")
    print("   - WEATHER_API_KEY: Get from https://openweathermap.org/")
    print("\n2. Start the backend:")
    print("   python app.py")
    print("\n3. Start the frontend (in a new terminal):")
    print("   cd client && npm start")
    print("\n4. Open your browser to http://localhost:3000")
    print("\n🌍 Happy Travel Planning!")

def main():
    """Main setup function"""
    print("🌍 AI Travel Planner Setup")
    print("="*40)
    
    # Check requirements
    if not check_requirements():
        print("\n❌ Setup failed. Please install missing requirements.")
        return
    
    # Setup backend
    if not setup_backend():
        print("\n❌ Backend setup failed.")
        return
    
    # Setup frontend
    if not setup_frontend():
        print("\n❌ Frontend setup failed.")
        return
    
    # Print next steps
    print_next_steps()

if __name__ == "__main__":
    main() 