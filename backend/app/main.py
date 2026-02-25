"""
MetaboLens - Personalized Metabolic Health Navigator
FastAPI Application Entry Point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api import router

app = FastAPI(
    title="MetaboLens API",
    description="AI-powered platform for personalized metabolic health insights using multi-modal contrastive learning",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(router)


@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "name": "MetaboLens API",
        "version": "1.0.0",
        "description": "Personalized Metabolic Health Navigator",
        "docs": "/docs",
        "health": "/api/health",
        "disclaimer": "This is a research prototype. Results require clinical validation."
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
