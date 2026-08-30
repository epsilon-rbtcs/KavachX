from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.analysis import Analysis
from app.models.network_state import NetworkState


router = APIRouter()


@router.get("/analyses/{analysis_id}/states")
def get_network_states(
    analysis_id: str,
    db: Session = Depends(get_db)
):

    # Check analysis exists
    analysis = db.get(Analysis, analysis_id)

    if not analysis:
        raise HTTPException(
            status_code=404,
            detail="Analysis ID not found"
        )

    # Get states in chronological order
    states = (
        db.query(NetworkState)
        .filter(NetworkState.analysis_id == analysis_id)
        .order_by(NetworkState.time_window.asc())
        .all()
    )

    return {
        "analysis_id": analysis_id,
        "total_states": len(states),
        "states": [
            {
                "state_id": state.id,
                "time_window": state.time_window,
                "packet_count": state.packet_count,
                "total_bytes": state.total_bytes,
                "avg_packet_count": state.avg_packet_count,
                "avg_bytes": state.avg_bytes,
                "unique_source_ports": state.unique_source_ports,
                "unique_destination_ports": state.unique_destination_ports,
                "total_flows": state.total_flows,
                "packet_rate": state.packet_rate,
                "byte_rate": state.byte_rate
            }
            for state in states
        ]
    }
