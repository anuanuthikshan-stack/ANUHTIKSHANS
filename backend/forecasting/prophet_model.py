import pandas as pd
import numpy as np
from typing import Dict, Any
from prophet import Prophet
import warnings

warnings.filterwarnings('ignore')

def train_and_forecast_prophet(
    df: pd.DataFrame,
    horizon: int = 6,
    plant: str = None
) -> Dict[str, Any]:
    """
    Fits Meta Prophet time series model and forecasts future material consumption.
    """
    sub_df = df if not plant or plant == "ALL" else df[df['Plant'] == plant]
    if len(sub_df) < 5:
        raise ValueError("Insufficient data points for Prophet forecasting.")
        
    prophet_df = pd.DataFrame({
        'ds': pd.to_datetime(sub_df['Month_Year']),
        'y': sub_df['Total_Qty']
    }).sort_values(by='ds').reset_index(drop=True)
    
    # Configure Prophet parameters matching notebook logic
    model = Prophet(
        yearly_seasonality=False,
        weekly_seasonality=False,
        daily_seasonality=False,
        changepoint_prior_scale=0.01
    )
    
    model.fit(prophet_df)
    
    future = model.make_future_dataframe(periods=horizon, freq='MS')
    forecast_df = model.predict(future)
    
    # Clip negative predictions
    forecast_df['yhat'] = forecast_df['yhat'].clip(lower=0)
    forecast_df['yhat_lower'] = forecast_df['yhat_lower'].clip(lower=0)
    forecast_df['yhat_upper'] = forecast_df['yhat_upper'].clip(lower=0)
    
    hist_len = len(prophet_df)
    
    historical_list = []
    for i in range(hist_len):
        historical_list.append({
            "month": prophet_df['ds'].iloc[i].strftime('%Y-%m'),
            "actual_qty": float(prophet_df['y'].iloc[i]),
            "fitted_qty": round(float(forecast_df['yhat'].iloc[i]), 2)
        })
        
    future_only = forecast_df.tail(horizon)
    forecast_list = []
    for i in range(horizon):
        row = future_only.iloc[i]
        forecast_list.append({
            "month": row['ds'].strftime('%Y-%m'),
            "forecast_qty": round(float(row['yhat']), 2),
            "lower_ci": round(float(row['yhat_lower']), 2),
            "upper_ci": round(float(row['yhat_upper']), 2),
            "trend": round(float(row['trend']), 2)
        })
        
    return {
        "model": "Prophet",
        "plant": plant or "ALL",
        "horizon": horizon,
        "historical": historical_list,
        "forecast": forecast_list
    }
