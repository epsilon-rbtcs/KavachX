from fastapi import FastAPI

from app.api.routes.health import router as health_router
from app.api.routes.upload import router as upload_router
from app.api.routes.analysis import router as analysis_router
from app.api.routes import states
from app.api.routes import analyses

app = FastAPI(
    title="AI Network Attack Forecasting API",
    description="Backend for AI-based Network Attack Forecasting System",
    version="1.0.0"
)


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


@app.get("/")
def root():
    return {
        "message": "Network Attack Forecasting Backend is running"
    }