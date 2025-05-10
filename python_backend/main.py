"""
Main script to start the FastAPI service
"""

import uvicorn

if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=5100, reload=True)