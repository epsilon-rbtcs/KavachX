from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.analysis import Analysis


router = APIRouter()


@router.get("/analyses")
def get_all_analyses(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    analyses = (
        db.query(Analysis)
        .filter(Analysis.user_id == int(current_user))
        .order_by(Analysis.created_at.desc())
        .all()
    )

    return {
        "total": len(analyses),
        "analyses": [
            {
                "analysis_id": analysis.id,
                "original_filename": analysis.original_filename,
                "file_type": analysis.file_type,
                "sha256": analysis.sha256,
                "status": analysis.status,
                "created_at": analysis.created_at
            }
            for analysis in analyses
        ]
    }