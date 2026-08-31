# KavachX

KavachX is a FastAPI-based backend for network traffic analysis and AI-assisted attack forecasting. It accepts uploaded network traffic files, validates their structure, extracts traffic features, aggregates them into time-window states, and stores the resulting analysis metadata and state summaries in PostgreSQL.

## Project Overview

- API server: FastAPI
- Database: PostgreSQL with SQLAlchemy
- Storage: uploaded files in the uploads folder
- Analysis flow: upload -> validate -> feature extraction -> time-window aggregation -> persist network states

## Data Flow Diagram

```mermaid
sequenceDiagram
    participant C as Client
    participant F as FastAPI Router
    participant S as Feature Service
    participant D as PostgreSQL
    participant U as uploads/

    C->>F: Upload CSV / PCAP / PCAPNG file
    F->>U: Save file with generated UUID
    F->>D: Insert Analysis record with sha256, file_type, status
    D-->>F: Analysis ID created
    F-->>C: Upload success response

    C->>F: Run analysis for analysis_id
    F->>U: Locate uploaded file by analysis_id
    F->>S: load_csv(file_path)
    S->>S: validate_csv(df)
    S->>S: extract_features(df)
    S->>S: create_network_states(features, window_seconds=10)
    S-->>F: Aggregated packet/time-window network states
    F->>D: Delete previous NetworkState rows for analysis_id
    F->>D: Insert aggregated network states
    F->>D: Update Analysis.status = processed
    D-->>F: Commit complete
    F-->>C: Analysis summary with record count and state count

    C->>F: Request states for analysis_id
    F->>D: Query NetworkState rows ordered by time_window
    D-->>F: JSON state history
    F-->>C: Time-series metrics like packet_count, total_bytes, packet_rate, byte_rate
```
