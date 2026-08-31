from app.core.database import engine, Base

from app.models.analysis import Analysis
from app.models.network_state import NetworkState
from app.models.user import User


print("Creating database tables...")

Base.metadata.create_all(bind=engine)

print("Tables created successfully!")