import pandas as pd
from typing import Dict, Any

def generate_excel_report(
    df: pd.DataFrame,
    forecast_results: Dict[str, Any],
    abc_results: Dict[str, Any],
    output_filepath: str
) -> str:
    """
    Generates a structured multi-sheet Excel workbook with raw data, forecast results, and ABC classification.
    """
    with pd.ExcelWriter(output_filepath, engine='openpyxl') as writer:
        # Sheet 1: Cleaned Historical Dataset
        df.to_excel(writer, sheet_name='Historical Data', index=False)
        
        # Sheet 2: Forecast Predictions
        forecast_list = forecast_results.get('forecast', [])
        if forecast_list:
            f_df = pd.DataFrame(forecast_list)
            f_df.to_excel(writer, sheet_name='Forecast Results', index=False)
            
        # Sheet 3: ABC Inventory Classification
        abc_items = abc_results.get('items', [])
        if abc_items:
            abc_df = pd.DataFrame(abc_items)
            abc_df.to_excel(writer, sheet_name='ABC Analysis', index=False)
            
    return output_filepath

def generate_csv_export(df: pd.DataFrame, output_filepath: str) -> str:
    """Exports raw or processed data to CSV format."""
    df.to_csv(output_filepath, index=False)
    return output_filepath
