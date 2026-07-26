from fastapi import APIRouter, Query, HTTPException
from api.routes.dataset import get_active_dataset
from forecasting.arima_model import train_and_forecast_arima
from forecasting.prophet_model import train_and_forecast_prophet
from forecasting.xgboost_model import train_and_forecast_xgboost
from forecasting.evaluator import evaluate_and_compare_models
from forecasting.abc_analysis import perform_abc_analysis

router = APIRouter(prefix="", tags=["Forecasting & Analytics"])

@router.get("/forecast/arima")
def get_arima_forecast(
    horizon: int = Query(6, ge=1, le=24),
    plant: str = Query(None)
):
    df = get_active_dataset()
    try:
        res = train_and_forecast_arima(df, horizon=horizon, plant=plant)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ARIMA Forecasting Failed: {str(e)}")

@router.get("/forecast/prophet")
def get_prophet_forecast(
    horizon: int = Query(6, ge=1, le=24),
    plant: str = Query(None)
):
    df = get_active_dataset()
    try:
        res = train_and_forecast_prophet(df, horizon=horizon, plant=plant)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prophet Forecasting Failed: {str(e)}")

@router.get("/forecast/xgboost")
def get_xgboost_forecast(
    horizon: int = Query(6, ge=1, le=24),
    plant: str = Query(None)
):
    df = get_active_dataset()
    try:
        res = train_and_forecast_xgboost(df, horizon=horizon, plant=plant)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"XGBoost Forecasting Failed: {str(e)}")

@router.get("/comparison")
def get_model_comparison(
    horizon: int = Query(6, ge=1, le=24),
    plant: str = Query(None)
):
    df = get_active_dataset()
    try:
        res = evaluate_and_compare_models(df, horizon=horizon, plant=plant)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model Comparison Failed: {str(e)}")

@router.get("/abc-analysis")
def get_abc_analysis():
    df = get_active_dataset()
    try:
        res = perform_abc_analysis(df)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ABC Analysis Failed: {str(e)}")
