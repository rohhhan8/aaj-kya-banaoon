"""
Main script to start the FastAPI service
"""

import uvicorn
import os
from setup_mongodb import initialize_mongodb

# Initialize MongoDB with sample data
print("Initializing MongoDB...")
inserted = initialize_mongodb()
print(f"Initialized MongoDB with {inserted} manual dishes")

# Default server settings
port = 5100
host = "0.0.0.0"

if __name__ == "__main__":
    print(f"Starting API server on {host}:{port}")
    uvicorn.run("api:app", host=host, port=port, reload=True)