from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.analysis import Analysis


router = APIRouter()


@router.get("/analyses")
def get_all_analyses(
    db: Session = Depends(get_db)
):
    analyses = (
        db.query(Analysis)
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