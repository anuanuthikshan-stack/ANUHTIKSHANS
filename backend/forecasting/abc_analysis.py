import pandas as pd
import numpy as np
from typing import Dict, Any, List

def perform_abc_analysis(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Executes ABC inventory classification based on cumulative total expenditure (Total_Amount).
    Grouped by Plant and Material_Name.
    Class A: Top 70% value
    Class B: Next 20% value (70% - 90%)
    Class C: Remaining 10% value (90% - 100%)
    """
    if df.empty:
        return {}
        
    grouped = df.groupby(['Plant', 'Material_Name']).agg(
        total_quantity=('Total_Qty', 'sum'),
        total_amount=('Total_Amount', 'sum'),
        records=('Records', 'sum')
    ).reset_index()
    
    # Sort descending by monetary amount
    grouped = grouped.sort_values(by='total_amount', ascending=False).reset_index(drop=True)
    
    total_val = grouped['total_amount'].sum()
    if total_val == 0:
        grouped['cum_pct'] = 0
        grouped['category'] = 'C'
    else:
        grouped['cum_amount'] = grouped['total_amount'].cumsum()
        grouped['cum_pct'] = (grouped['cum_amount'] / total_val) * 100
        
        def assign_category(pct):
            if pct <= 70.0:
                return 'A'
            elif pct <= 90.0:
                return 'B'
            else:
                return 'C'
                
        grouped['category'] = grouped['cum_pct'].apply(assign_category)
        
    items = []
    for idx, row in grouped.iterrows():
        items.append({
            "rank": idx + 1,
            "plant": row['Plant'],
            "material_name": row['Material_Name'],
            "total_quantity": float(row['total_quantity']),
            "total_amount": float(row['total_amount']),
            "cumulative_percentage": round(float(row['cum_pct']), 2),
            "category": row['category']
        })
        
    category_summary = {}
    for cat in ['A', 'B', 'C']:
        cat_items = grouped[grouped['category'] == cat]
        cat_count = len(cat_items)
        cat_value = float(cat_items['total_amount'].sum()) if cat_count > 0 else 0.0
        val_pct = round((cat_value / total_val * 100), 2) if total_val > 0 else 0.0
        item_pct = round((cat_count / len(grouped) * 100), 2) if len(grouped) > 0 else 0.0
        
        category_summary[cat] = {
            "item_count": cat_count,
            "item_percentage": item_pct,
            "total_value": cat_value,
            "value_percentage": val_pct
        }
        
    recommendations = {
        "A": "High Value Items (70% value): Implement strict inventory control, daily/weekly monitoring, and Just-In-Time (JIT) procurement to minimize holding cost.",
        "B": "Moderate Value Items (20% value): Apply periodic review policies, standard safety stock thresholds, and bi-weekly supplier check-ins.",
        "C": "Low Value Items (10% value): Utilize bulk purchasing, automated reorder points, and simplified controls to minimize management overhead."
    }
    
    return {
        "summary": category_summary,
        "items": items,
        "recommendations": recommendations,
        "total_monetary_value": total_val
    }
