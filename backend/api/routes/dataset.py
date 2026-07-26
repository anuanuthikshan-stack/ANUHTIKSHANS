import os
import pandas as pd
from fastapi import APIRouter, UploadFile, File, HTTPException, Query, Depends
from sqlalchemy.orm import Session
from database.db import get_db
from database.models import DatasetRecord
from preprocessing.cleaner import validate_and_clean_df, compute_statistics

router = APIRouter(prefix="", tags=["Dataset & Data Processing"])

# Global in-memory storage for active dataset
GLOBAL_DATASTORE = {
    "df": None,
    "cleaned_df": None,
    "summary": None
}

DEFAULT_SAMPLE_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "..", "dataset", "sample_material_consumption.csv")
)

def get_active_dataset() -> pd.DataFrame:
    """Loads active dataframe or falls back to bundled sample dataset."""
    if GLOBAL_DATASTORE["cleaned_df"] is not None:
        return GLOBAL_DATASTORE["cleaned_df"]
        
    if os.path.exists(DEFAULT_SAMPLE_PATH):
        raw_df = pd.read_csv(DEFAULT_SAMPLE_PATH)
        cleaned_df, report = validate_and_clean_df(raw_df)
        GLOBAL_DATASTORE["df"] = raw_df
        GLOBAL_DATASTORE["cleaned_df"] = cleaned_df
        GLOBAL_DATASTORE["summary"] = report
        return cleaned_df
        
    raise HTTPException(status_code=400, detail="No dataset uploaded and sample dataset not found.")

@router.post("/upload")
async def upload_dataset(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(('.csv', '.txt')):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")
        
    try:
        raw_df = pd.read_csv(file.file)
        cleaned_df, report = validate_and_clean_df(raw_df)
        
        GLOBAL_DATASTORE["df"] = raw_df
        GLOBAL_DATASTORE["cleaned_df"] = cleaned_df
        GLOBAL_DATASTORE["summary"] = report
        
        # Log upload in DB
        db_record = DatasetRecord(
            filename=file.filename,
            row_count=len(cleaned_df),
            plants_summary=",".join(report["plants_found"])
        )
        db.add(db_record)
        db.commit()
        
        return {
            "message": "Dataset uploaded and cleaned successfully.",
            "filename": file.filename,
            "report": report
        }
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Dataset Validation Error: {str(e)}")

@router.get("/statistics")
def get_dataset_statistics(plant: str = Query(None)):
    df = get_active_dataset()
    stats = compute_statistics(df, plant=plant)
    return {
        "stats": stats,
        "active_plants": df['Plant'].unique().tolist(),
        "active_materials": df['Material_Name'].unique().tolist()
    }
