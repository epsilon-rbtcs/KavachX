from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.health import router as health_router
from app.api.routes.upload import router as upload_router
from app.api.routes.analysis import router as analysis_router
from app.api.routes import states
from app.api.routes import analyses
from app.api.routes import auth


app = FastAPI(
    title="AI Network Attack Forecasting API",
    description="Backend for AI-based Network Attack Forecasting System",
    version="1.0.0"
)


# ============================================================
# CORS CONFIGURATION
# Allows the KavachX frontend running on port 3000
# to communicate with the FastAPI backend running on port 8000.
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# API ROUTES
# ============================================================

app.include_router(
    health_router,
    prefix="/api"
)

app.include_router(
    upload_router,
    prefix="/api"
)

app.include_router(
    analysis_router,
    prefix="/api"
)

app.include_router(
    states.router,
    prefix="/api"
)

app.include_router(
    analyses.router,
    prefix="/api"
)

app.include_router(
    auth.router,
    prefix="/api"
)


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():
    return {
        "message": "Network Attack Forecasting Backend is running"
    }