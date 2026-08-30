from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from pathlib import Path
from sqlalchemy.orm import Session

import hashlib
import uuid

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.analysis import Analysis


router = APIRouter()


UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_EXTENSIONS = {".csv", ".pcap", ".pcapng"}


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Filename is missing"
        )

    extension = Path(file.filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only CSV, PCAP and PCAPNG files are allowed"
        )

    analysis_id = str(uuid.uuid4())

    file_content = await file.read()

    file_hash = hashlib.sha256(file_content).hexdigest()

    saved_filename = f"{analysis_id}{extension}"

    file_path = UPLOAD_DIR / saved_filename

    with open(file_path, "wb") as buffer:
        buffer.write(file_content)

    analysis = Analysis(
        id=analysis_id,
        user_id=int(current_user),
        original_filename=file.filename,
        file_type=extension,
        sha256=file_hash,
        status="uploaded"
    )

    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    return {
        "analysis_id": analysis.id,
        "original_filename": analysis.original_filename,
        "saved_filename": saved_filename,
        "file_type": analysis.file_type,
        "sha256": analysis.sha256,
        "status": analysis.status
    }