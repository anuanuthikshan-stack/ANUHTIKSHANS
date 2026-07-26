import pandas as pd
import numpy as np
from statsmodels.tsa.arima.model import ARIMA
from typing import Dict, Any, List
import warnings

warnings.filterwarnings('ignore')

def train_and_forecast_arima(
    df: pd.DataFrame,
    horizon: int = 6,
    plant: str = None
) -> Dict[str, Any]:
    """
    Fits an ARIMA time series model on Total_Qty and generates multi-month future forecasts with confidence intervals.
    """
    sub_df = df if not plant or plant == "ALL" else df[df['Plant'] == plant]
    if len(sub_df) < 5:
        raise ValueError("Insufficient data points for ARIMA forecasting (minimum 5 required).")
        
    ts_data = sub_df['Total_Qty'].values
    dates = pd.to_datetime(sub_df['Month_Year']).dt.strftime('%Y-%m').tolist()
    
    # Fit ARIMA model (defaulting to order (1,1,1) as used in notebook)
    try:
        model = ARIMA(ts_data, order=(1, 1, 1))
        fitted_model = model.fit()
    except Exception:
        # Fallback to ARIMA(1,0,0) if non-stationary diff fails
        model = ARIMA(ts_data, order=(1, 0, 0))
        fitted_model = model.fit()
        
    fitted_values = fitted_model.fittedvalues.tolist()
    
    # Forecast future periods
    forecast_result = fitted_model.get_forecast(steps=horizon)
    forecast_values = np.clip(forecast_result.predicted_mean, a_min=0, a_max=None).tolist()
    
    conf_int = forecast_result.conf_int(alpha=0.05)
    lower_bound = np.clip(conf_int[:, 0], a_min=0, a_max=None).tolist()
    upper_bound = np.clip(conf_int[:, 1], a_min=0, a_max=None).tolist()
    
    # Future dates calculation
    last_date = pd.to_datetime(dates[-1])
    future_dates = [
        (last_date + pd.DateOffset(months=i)).strftime('%Y-%m')
        for i in range(1, horizon + 1)
    ]
    
    forecast_list = []
    for i in range(horizon):
        forecast_list.append({
            "month": future_dates[i],
            "forecast_qty": round(float(forecast_values[i]), 2),
            "lower_ci": round(float(lower_bound[i]), 2),
            "upper_ci": round(float(upper_bound[i]), 2)
        })
        
    historical_list = [
        {
            "month": dates[i],
            "actual_qty": float(ts_data[i]),
            "fitted_qty": round(float(fitted_values[i]), 2) if i < len(fitted_values) else float(ts_data[i])
        }
        for i in range(len(ts_data))
    ]
    
    return {
        "model": "ARIMA",
        "plant": plant or "ALL",
        "horizon": horizon,
        "historical": historical_list,
        "forecast": forecast_list,
        "aic": float(fitted_model.aic),
        "bic": float(fitted_model.bic)
    }
