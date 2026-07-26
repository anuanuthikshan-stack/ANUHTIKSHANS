import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from typing import Dict, Any, List
from forecasting.arima_model import train_and_forecast_arima
from forecasting.prophet_model import train_and_forecast_prophet
from forecasting.xgboost_model import train_and_forecast_xgboost

def calculate_mape(actual: np.ndarray, predicted: np.ndarray) -> float:
    """Calculates Mean Absolute Percentage Error (%)"""
    actual, predicted = np.array(actual), np.array(predicted)
    non_zero = actual != 0
    if not np.any(non_zero):
        return 0.0
    return float(np.mean(np.abs((actual[non_zero] - predicted[non_zero]) / actual[non_zero])) * 100)

def evaluate_and_compare_models(
    df: pd.DataFrame,
    horizon: int = 6,
    plant: str = None
) -> Dict[str, Any]:
    """
    Runs ARIMA, Prophet, and XGBoost, computes evaluation metrics (MAE, RMSE, MAPE, R2),
    and highlights the best model for the selected plant.
    """
    sub_df = df if not plant or plant == "ALL" else df[df['Plant'] == plant]
    actual = sub_df['Total_Qty'].values
    
    results = {}
    metrics = []
    
    # 1. ARIMA
    try:
        arima_res = train_and_forecast_arima(df, horizon=horizon, plant=plant)
        fitted_arima = [h['fitted_qty'] for h in arima_res['historical']]
        mae = float(mean_absolute_error(actual, fitted_arima))
        rmse = float(np.sqrt(mean_squared_error(actual, fitted_arima)))
        mape = calculate_mape(actual, fitted_arima)
        r2 = float(r2_score(actual, fitted_arima)) if len(actual) > 1 else 0.0
        
        results['ARIMA'] = arima_res
        metrics.append({
            "model": "ARIMA",
            "mae": round(mae, 2),
            "rmse": round(rmse, 2),
            "mape": round(mape, 2),
            "r2_score": round(r2, 4)
        })
    except Exception as e:
        results['ARIMA'] = {"error": str(e)}

    # 2. Prophet
    try:
        prophet_res = train_and_forecast_prophet(df, horizon=horizon, plant=plant)
        fitted_prophet = [h['fitted_qty'] for h in prophet_res['historical']]
        mae = float(mean_absolute_error(actual, fitted_prophet))
        rmse = float(np.sqrt(mean_squared_error(actual, fitted_prophet)))
        mape = calculate_mape(actual, fitted_prophet)
        r2 = float(r2_score(actual, fitted_prophet)) if len(actual) > 1 else 0.0
        
        results['Prophet'] = prophet_res
        metrics.append({
            "model": "Prophet",
            "mae": round(mae, 2),
            "rmse": round(rmse, 2),
            "mape": round(mape, 2),
            "r2_score": round(r2, 4)
        })
    except Exception as e:
        results['Prophet'] = {"error": str(e)}

    # 3. XGBoost
    try:
        xgb_res = train_and_forecast_xgboost(df, horizon=horizon, plant=plant)
        # Trim actual to match lag feature length
        hist_actual = [h['actual_qty'] for h in xgb_res['historical']]
        fitted_xgb = [h['fitted_qty'] for h in xgb_res['historical']]
        mae = float(mean_absolute_error(hist_actual, fitted_xgb))
        rmse = float(np.sqrt(mean_squared_error(hist_actual, fitted_xgb)))
        mape = calculate_mape(hist_actual, fitted_xgb)
        r2 = float(r2_score(hist_actual, fitted_xgb)) if len(hist_actual) > 1 else 0.0
        
        results['XGBoost'] = xgb_res
        metrics.append({
            "model": "XGBoost",
            "mae": round(mae, 2),
            "rmse": round(rmse, 2),
            "mape": round(mape, 2),
            "r2_score": round(r2, 4)
        })
    except Exception as e:
        results['XGBoost'] = {"error": str(e)}

    # Determine best model by lowest MAE
    best_model_name = "ARIMA"
    if metrics:
        best_metric = min(metrics, key=lambda x: x['mae'])
        best_model_name = best_metric['model']

    return {
        "plant": plant or "ALL",
        "horizon": horizon,
        "metrics": metrics,
        "best_model": best_model_name,
        "details": results
    }
