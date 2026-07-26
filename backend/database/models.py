from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from datetime import datetime
from database.db import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class DatasetRecord(Base):
    __tablename__ = "dataset_records"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    row_count = Column(Integer, nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    plants_summary = Column(Text, nullable=True)

class ModelMetadata(Base):
    __tablename__ = "model_metadata"
    
    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String, nullable=False)
    plant = Column(String, nullable=False)
    mae = Column(Float, nullable=True)
    rmse = Column(Float, nullable=True)
    mape = Column(Float, nullable=True)
    file_path = Column(String, nullable=False)
    trained_at = Column(DateTime, default=datetime.utcnow)
