import pandas as pd
import numpy as np
from xgboost import XGBRegressor
from typing import Dict, Any
from preprocessing.feature_engineering import create_time_series_features

def train_and_forecast_xgboost(
    df: pd.DataFrame,
    horizon: int = 6,
    plant: str = None
) -> Dict[str, Any]:
    """
    Fits XGBoost Regressor with lag features and rolling window statistics.
    Executes multi-step recursive forecasting.
    """
    sub_df = df if not plant or plant == "ALL" else df[df['Plant'] == plant]
    if len(sub_df) < 5:
        raise ValueError("Insufficient data points for XGBoost forecasting (minimum 5 required).")
        
    feat_df = create_time_series_features(sub_df, target_col='Total_Qty')
    if feat_df.empty:
        raise ValueError("Dataset too small after lag feature generation.")
        
    feature_cols = ['Month_Num', 'Lag1', 'Lag2', 'Lag3', 'Rolling_Mean']
    X = feat_df[feature_cols]
    y = feat_df['Total_Qty']
    
    xgb_model = XGBRegressor(
        n_estimators=100,
        learning_rate=0.1,
        max_depth=3,
        random_state=42
    )
    xgb_model.fit(X, y)
    
    # In-sample fitted predictions
    fitted_vals = xgb_model.predict(X)
    
    # Recursive forecasting for horizon
    last_known = sub_df['Total_Qty'].values
    forecast_values = []
    
    current_series = list(last_known)
    total_len = len(sub_df)
    
    for i in range(horizon):
        lag1 = current_series[-1]
        lag2 = current_series[-2] if len(current_series) >= 2 else current_series[-1]
        lag3 = current_series[-3] if len(current_series) >= 3 else current_series[-2]
        roll = np.mean(current_series[-3:])
        month_num = total_len + i + 1
        
        input_feat = pd.DataFrame([[month_num, lag1, lag2, lag3, roll]], columns=feature_cols)
        pred = float(xgb_model.predict(input_feat)[0])
        pred = max(0.0, pred)  # Non-negative constraint
        
        forecast_values.append(pred)
        current_series.append(pred)
        
    dates = pd.to_datetime(sub_df['Month_Year']).dt.strftime('%Y-%m').tolist()
    last_date = pd.to_datetime(dates[-1])
    future_dates = [
        (last_date + pd.DateOffset(months=i)).strftime('%Y-%m')
        for i in range(1, horizon + 1)
    ]
    
    historical_list = []
    for i in range(len(feat_df)):
        historical_list.append({
            "month": feat_df['Month_Year'].iloc[i],
            "actual_qty": float(y.iloc[i]),
            "fitted_qty": round(float(fitted_vals[i]), 2)
        })
        
    forecast_list = []
    for i in range(horizon):
        forecast_list.append({
            "month": future_dates[i],
            "forecast_qty": round(float(forecast_values[i]), 2),
            "lower_ci": round(float(forecast_values[i] * 0.9), 2),
            "upper_ci": round(float(forecast_values[i] * 1.1), 2)
        })
        
    return {
        "model": "XGBoost",
        "plant": plant or "ALL",
        "horizon": horizon,
        "historical": historical_list,
        "forecast": forecast_list,
        "feature_importances": {
            col: float(imp)
            for col, imp in zip(feature_cols, xgb_model.feature_importances_)
        }
    }
