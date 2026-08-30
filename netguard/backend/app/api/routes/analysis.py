from fastapi import APIRouter, HTTPException, Depends
from pathlib import Path

from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.analysis import Analysis
from app.models.network_state import NetworkState

from app.services.feature_service import (
    load_csv,
    validate_csv,
    extract_features,
    create_network_states
)


router = APIRouter()

UPLOAD_DIR = Path("uploads")


@router.post("/analyses/{analysis_id}/run")
def run_analysis(
    analysis_id: str,
    db: Session = Depends(get_db)
):

    # --------------------------------
    # 1. Check analysis exists
    # --------------------------------

    analysis = db.get(Analysis, analysis_id)

    if not analysis:
        raise HTTPException(
            status_code=404,
            detail="Analysis ID not found"
        )

    # --------------------------------
    # 2. Find uploaded CSV
    # --------------------------------

    matching_files = list(
        UPLOAD_DIR.glob(f"{analysis_id}.*")
    )

    if not matching_files:
        raise HTTPException(
            status_code=404,
            detail="Analysis file not found"
        )

    file_path = matching_files[0]

    # --------------------------------
    # 3. Currently support CSV
    # --------------------------------

    if file_path.suffix.lower() != ".csv":
        raise HTTPException(
            status_code=400,
            detail="Currently only CSV analysis is supported"
        )

    # --------------------------------
    # 4. Load CSV
    # --------------------------------

    try:
        df = load_csv(str(file_path))
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Unable to read CSV: {str(e)}"
        )

    # --------------------------------
    # 5. Validate CSV
    # --------------------------------

    validation = validate_csv(df)

    if not validation["valid"]:
        raise HTTPException(
            status_code=400,
            detail={
                "message": "Invalid CSV structure",
                "missing_columns": validation["missing_columns"]
            }
        )

    # --------------------------------
    # 6. Extract features
    # --------------------------------

    features = extract_features(df)

    if features.empty:
        raise HTTPException(
            status_code=400,
            detail="No valid traffic records found"
        )

    # --------------------------------
    # 7. Create network states
    # --------------------------------

    states = create_network_states(features)

    if states.empty:
        raise HTTPException(
            status_code=400,
            detail="Unable to create network states"
        )

    # --------------------------------
    # 8. Remove old states
    # --------------------------------
    # Prevent duplicate states if the
    # same analysis is run again.

    db.query(NetworkState).filter(
        NetworkState.analysis_id == analysis_id
    ).delete()

    # --------------------------------
    # 9. Save network states
    # --------------------------------

    for _, state in states.iterrows():

        network_state = NetworkState(
            analysis_id=analysis_id,

            time_window=state["time_window"],

            packet_count=float(
                state["packet_count"]
            ),

            total_bytes=float(
                state["total_bytes"]
            ),

            avg_packet_count=float(
                state["avg_packet_count"]
            ),

            avg_bytes=float(
                state["avg_bytes"]
            ),

            unique_source_ports=int(
                state["unique_source_ports"]
            ),

            unique_destination_ports=int(
                state["unique_destination_ports"]
            ),

            total_flows=int(
                state["total_flows"]
            ),

            packet_rate=float(
                state["packet_rate"]
            ),

            byte_rate=float(
                state["byte_rate"]
            )
        )

        db.add(network_state)

    # --------------------------------
    # 10. Update analysis status
    # --------------------------------

    analysis.status = "processed"

    # --------------------------------
    # 11. Commit everything
    # --------------------------------

    db.commit()

    # --------------------------------
    # 12. Return response
    # --------------------------------

    return {
        "analysis_id": analysis_id,
        "status": "processed",
        "total_records": len(df),
        "total_states": len(states)
    }