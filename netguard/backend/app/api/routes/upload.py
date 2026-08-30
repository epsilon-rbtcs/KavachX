from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from pathlib import Path
from sqlalchemy.orm import Session

import hashlib
import uuid

from app.core.database import get_db
from app.models.analysis import Analysis


router = APIRouter()


# Folder where uploaded files will be stored
UPLOAD_DIR = Path("uploads")

# Create uploads folder if it doesn't exist
UPLOAD_DIR.mkdir(exist_ok=True)


# Allowed file extensions
ALLOWED_EXTENSIONS = {".csv", ".pcap", ".pcapng"}


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    # -----------------------------
    # 1. Validate filename
    # -----------------------------

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Filename is missing"
        )

    # Get file extension
    extension = Path(file.filename).suffix.lower()

    # Check extension
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only CSV, PCAP and PCAPNG files are allowed"
        )

    # -----------------------------
    # 2. Generate analysis ID
    # -----------------------------

    analysis_id = str(uuid.uuid4())

    # -----------------------------
    # 3. Read file contents
    # -----------------------------

    file_content = await file.read()

    # -----------------------------
    # 4. Calculate SHA-256 hash
    # -----------------------------

    file_hash = hashlib.sha256(file_content).hexdigest()

    # -----------------------------
    # 5. Create safe filename
    # -----------------------------

    saved_filename = f"{analysis_id}{extension}"

    file_path = UPLOAD_DIR / saved_filename

    # -----------------------------
    # 6. Save file
    # -----------------------------

    with open(file_path, "wb") as buffer:
        buffer.write(file_content)

    # -----------------------------
    # 7. Create database record
    # -----------------------------

    analysis = Analysis(
        id=analysis_id,
        original_filename=file.filename,
        file_type=extension,
        sha256=file_hash,
        status="uploaded"
    )

    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    # -----------------------------
    # 8. Return information
    # -----------------------------

    return {
        "analysis_id": analysis.id,
        "original_filename": analysis.original_filename,
        "saved_filename": saved_filename,
        "file_type": analysis.file_type,
        "sha256": analysis.sha256,
        "status": analysis.status
    }