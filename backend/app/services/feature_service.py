import pandas as pd


def load_csv(file_path: str) -> pd.DataFrame:
    """
    Load a CSV file into a Pandas DataFrame.
    """

    df = pd.read_csv(file_path)

    return df


def validate_csv(df: pd.DataFrame) -> dict:
    """
    Validate whether the CSV contains the basic
    columns required for network traffic processing.
    """

    required_columns = {
        "timestamp",
        "source_port",
        "destination_port",
        "protocol",
        "packet_count",
        "bytes"
    }

    available_columns = set(df.columns)

    missing_columns = required_columns - available_columns

    if missing_columns:
        return {
            "valid": False,
            "missing_columns": list(missing_columns)
        }

    return {
        "valid": True,
        "missing_columns": []
    }


def extract_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Extract basic network traffic features.
    """

    features = pd.DataFrame()

    features["timestamp"] = pd.to_datetime(
        df["timestamp"],
        errors="coerce"
    )

    features["source_port"] = pd.to_numeric(
        df["source_port"],
        errors="coerce"
    )

    features["destination_port"] = pd.to_numeric(
        df["destination_port"],
        errors="coerce"
    )

    features["packet_count"] = pd.to_numeric(
        df["packet_count"],
        errors="coerce"
    )

    features["bytes"] = pd.to_numeric(
        df["bytes"],
        errors="coerce"
    )

    features["protocol"] = df["protocol"]

    # Remove rows where timestamp is invalid
    features = features.dropna(
        subset=["timestamp"]
    )

    return features

def create_network_states(
    features: pd.DataFrame,
    window_seconds: int = 10
) -> pd.DataFrame:
    """
    Convert individual traffic records into
    time-ordered network states.
    """

    features = features.copy()

    # Sort traffic chronologically
    features = features.sort_values("timestamp")

    # Create time windows
    features["time_window"] = (
        features["timestamp"]
        .dt.floor(f"{window_seconds}s")
    )

    # Aggregate traffic inside each window
    states = (
        features
        .groupby("time_window")
        .agg(
            packet_count=("packet_count", "sum"),
            total_bytes=("bytes", "sum"),
            avg_packet_count=("packet_count", "mean"),
            avg_bytes=("bytes", "mean"),
            unique_source_ports=("source_port", "nunique"),
            unique_destination_ports=("destination_port", "nunique"),
            total_flows=("protocol", "count")
        )
        .reset_index()
    )

    # Calculate packet rate
    states["packet_rate"] = (
        states["packet_count"] / window_seconds
    )

    # Calculate byte rate
    states["byte_rate"] = (
        states["total_bytes"] / window_seconds
    )

    return states
