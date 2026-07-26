from fastapi import APIRouter, Query
import pandas as pd
import numpy as np
from api.routes.dataset import get_active_dataset

router = APIRouter(prefix="/eda", tags=["Exploratory Data Analysis"])

@router.get("/charts")
def get_eda_charts(plant: str = Query(None)):
    df = get_active_dataset()
    sub_df = df if not plant or plant == "ALL" else df[df['Plant'] == plant]
    
    # 1. Monthly Trends
    monthly = sub_df.groupby('Month_Year').agg(
        quantity=('Total_Qty', 'sum'),
        amount=('Total_Amount', 'sum')
    ).reset_index().sort_values(by='Month_Year')
    
    monthly_trend = [
        {
            "month": row['Month_Year'],
            "quantity": float(row['quantity']),
            "amount": float(row['amount'])
        }
        for _, row in monthly.iterrows()
    ]
    
    # 2. Plant Comparison
    plant_comp = df.groupby('Plant').agg(
        total_quantity=('Total_Qty', 'sum'),
        total_amount=('Total_Amount', 'sum'),
        avg_quantity=('Total_Qty', 'mean'),
        max_quantity=('Total_Qty', 'max')
    ).reset_index()
    
    plant_comparison = [
        {
            "plant": row['Plant'],
            "total_quantity": float(row['total_quantity']),
            "total_amount": float(row['total_amount']),
            "avg_quantity": round(float(row['avg_quantity']), 2),
            "max_quantity": float(row['max_quantity'])
        }
        for _, row in plant_comp.iterrows()
    ]
    
    # 3. Material Distribution
    material_dist = sub_df.groupby('Material_Name').agg(
        total_quantity=('Total_Qty', 'sum'),
        total_amount=('Total_Amount', 'sum')
    ).reset_index()
    
    distribution = [
        {
            "material": row['Material_Name'],
            "quantity": float(row['total_quantity']),
            "amount": float(row['total_amount'])
        }
        for _, row in material_dist.iterrows()
    ]
    
    # 4. Correlation Matrix
    corr_cols = ['Total_Qty', 'Total_Amount', 'Records']
    corr_df = sub_df[corr_cols].corr().fillna(0)
    correlation = {
        "columns": corr_cols,
        "matrix": corr_df.values.tolist()
    }
    
    return {
        "monthly_trend": monthly_trend,
        "plant_comparison": plant_comparison,
        "distribution": distribution,
        "correlation": correlation
    }
