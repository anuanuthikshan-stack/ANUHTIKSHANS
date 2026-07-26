import pandas as pd
import numpy as np
from typing import Dict, Any, Tuple

REQUIRED_COLUMNS = ['Plant', 'Month_Year', 'Total_Qty', 'Total_Amount']

def validate_and_clean_df(df: pd.DataFrame) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """
    Validates CSV schema, cleans column names, removes duplicates,
    handles missing values, parses dates, and returns cleaned dataframe + summary.
    """
    cleaned_df = df.copy()
    
    # Rename common column variations
    column_mapping = {
        'Total_Qty_KG': 'Total_Qty',
        'Total_Amount_INR': 'Total_Amount',
        'Quantity': 'Total_Qty',
        'Amount': 'Total_Amount',
        'Month': 'Month_Year',
        'Date': 'Month_Year'
    }
    cleaned_df = cleaned_df.rename(columns=column_mapping)
    
    # Check for missing required columns
    missing_cols = [col for col in REQUIRED_COLUMNS if col not in cleaned_df.columns]
    if missing_cols:
        raise ValueError(f"Missing required columns: {', '.join(missing_cols)}")
        
    initial_rows = len(cleaned_df)
    
    # Drop duplicates
    cleaned_df = cleaned_df.drop_duplicates()
    duplicates_removed = initial_rows - len(cleaned_df)
    
    # Convert Month_Year to string standard format YYYY-MM
    cleaned_df['Month_Year'] = pd.to_datetime(cleaned_df['Month_Year']).dt.strftime('%Y-%m')
    
    # Ensure numeric types
    cleaned_df['Total_Qty'] = pd.to_numeric(cleaned_df['Total_Qty'], errors='coerce')
    cleaned_df['Total_Amount'] = pd.to_numeric(cleaned_df['Total_Amount'], errors='coerce')
    
    # Fill missing values if any
    missing_values = cleaned_df[['Total_Qty', 'Total_Amount']].isna().sum().to_dict()
    cleaned_df['Total_Qty'] = cleaned_df['Total_Qty'].fillna(cleaned_df['Total_Qty'].median())
    cleaned_df['Total_Amount'] = cleaned_df['Total_Amount'].fillna(cleaned_df['Total_Amount'].median())
    
    # Ensure optional columns exist
    if 'Records' not in cleaned_df.columns:
        cleaned_df['Records'] = 1
    if 'Material_Name' not in cleaned_df.columns:
        cleaned_df['Material_Name'] = 'Industrial Material'
        
    # Sort chronologically
    cleaned_df = cleaned_df.sort_values(by=['Plant', 'Month_Year']).reset_index(drop=True)
    
    report = {
        "initial_rows": initial_rows,
        "cleaned_rows": len(cleaned_df),
        "duplicates_removed": duplicates_removed,
        "missing_values": missing_values,
        "plants_found": cleaned_df['Plant'].unique().tolist(),
        "materials_found": cleaned_df['Material_Name'].unique().tolist(),
        "date_range": [cleaned_df['Month_Year'].min(), cleaned_df['Month_Year'].max()]
    }
    
    return cleaned_df, report

def compute_statistics(df: pd.DataFrame, plant: str = None) -> Dict[str, Any]:
    """
    Computes statistical metrics (mean, median, variance, std, min, max, skew, kurtosis)
    for total quantity and total budget.
    """
    sub_df = df if not plant or plant == "ALL" else df[df['Plant'] == plant]
    
    if sub_df.empty:
        return {}
        
    qty = sub_df['Total_Qty']
    amount = sub_df['Total_Amount']
    
    stats = {
        "plant": plant or "ALL",
        "total_records": len(sub_df),
        "quantity": {
            "total": float(qty.sum()),
            "mean": float(qty.mean()),
            "median": float(qty.median()),
            "std_dev": float(qty.std()) if len(qty) > 1 else 0.0,
            "variance": float(qty.var()) if len(qty) > 1 else 0.0,
            "max": float(qty.max()),
            "min": float(qty.min()),
            "skewness": float(qty.skew()) if len(qty) > 2 else 0.0,
            "kurtosis": float(qty.kurt()) if len(qty) > 3 else 0.0
        },
        "amount": {
            "total": float(amount.sum()),
            "mean": float(amount.mean()),
            "median": float(amount.median()),
            "std_dev": float(amount.std()) if len(amount) > 1 else 0.0,
            "variance": float(amount.var()) if len(amount) > 1 else 0.0,
            "max": float(amount.max()),
            "min": float(amount.min()),
            "skewness": float(amount.skew()) if len(amount) > 2 else 0.0,
            "kurtosis": float(amount.kurt()) if len(amount) > 3 else 0.0
        }
    }
    
    return stats
