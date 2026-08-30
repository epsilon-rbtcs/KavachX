from fastapi import APIRouter, Depends

from app.core.security import get_current_user


router = APIRouter()


@router.get("/health")
def health_check(
    current_user: str = Depends(get_current_user)
):
    return {
        "status": "healthy",
        "user_id": current_user
    }