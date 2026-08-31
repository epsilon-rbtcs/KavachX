from datetime import datetime

from sqlalchemy import String, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class NetworkState(Base):
    __tablename__ = "network_states"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    analysis_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("analyses.id"),
        nullable=False,
        index=True
    )

    time_window: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False
    )

    packet_count: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    total_bytes: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    avg_packet_count: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    avg_bytes: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    unique_source_ports: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )

    unique_destination_ports: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )

    total_flows: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )

    packet_rate: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    byte_rate: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )