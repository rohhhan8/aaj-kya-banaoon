#!/bin/bash

# Start the Python ML service in the background
echo "Starting Python ML Service..."
cd python_backend
python3 main.py &
ML_PID=$!

# Go back to root directory
cd ..

# Start the main server
echo "Starting Main Node.js Server..."
npm run dev

# If the Node.js server ends, also kill the Python process
kill $ML_PID