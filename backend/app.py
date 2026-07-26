import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.db import Base, engine
from api.routes import auth, dataset, eda, forecasting, reports

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Industrial Material Consumption Forecasting System API",
    description="Production-ready REST API for AI time series forecasting, dataset analysis, ABC classification, and PDF report generation.",
    version="1.0.0"
)

# Enable CORS for Next.js frontend (local dev & production deployment)
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://*.vercel.app",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for seamless deployment & API testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth.router, prefix="/api")
app.include_router(dataset.router, prefix="/api")
app.include_router(eda.router, prefix="/api")
app.include_router(forecasting.router, prefix="/api")
app.include_router(reports.router, prefix="/api")

@app.get("/")
def root():
    return {
        "status": "online",
        "system": "Industrial Material Consumption Forecasting System API",
        "version": "1.0.0",
        "documentation": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
