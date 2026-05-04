from core.database import Base
from datetime import datetime
from sqlalchemy import Column, DateTime, Integer, String


class Datasets(Base):
    __tablename__ = "datasets"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    name = Column(String, nullable=False)
    dataset_type = Column(String, nullable=False)
    uploaded_by = Column(String, nullable=True)
    row_count = Column(Integer, nullable=True)
    payload = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.now)
    updated_at = Column(DateTime(timezone=True), default=datetime.now, onupdate=datetime.now)