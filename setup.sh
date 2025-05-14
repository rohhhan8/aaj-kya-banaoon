#!/bin/bash

# CulinaryAI Setup Script

echo "Setting up CulinaryAI..."

# Create a .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env-example .env
    echo "Please update the .env file with your MongoDB credentials."
    echo "MONGODB_URI=mongodb+srv://rohan_mongo18:<db_password>@cluster0.wsbb06d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" > .env
    echo "DB_NAME=culinaryai" >> .env
fi

# Create Python virtual environment if it doesn't exist
if [ ! -d .venv ]; then
    echo "Creating Python virtual environment..."
    python -m venv .venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source .venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r python_backend/requirements.txt

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

echo "Setup complete!"
echo "To start the application, run: npm run dev" 