import os
import tempfile
from fastapi import APIRouter, Query, HTTPException
from fastapi.responses import FileResponse
from api.routes.dataset import get_active_dataset
from preprocessing.cleaner import compute_statistics
from forecasting.abc_analysis import perform_abc_analysis
from forecasting.evaluator import evaluate_and_compare_models
from reports.pdf_generator import generate_pdf_report
from reports.excel_generator import generate_excel_report, generate_csv_export

router = APIRouter(prefix="", tags=["Report Generation"])

REPORTS_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "..", "reports")
)
os.makedirs(REPORTS_DIR, exist_ok=True)

@router.get("/generate-report")
def generate_report(
    format: str = Query("pdf", regex="^(pdf|csv|excel)$"),
    plant: str = Query(None),
    horizon: int = Query(6, ge=1, le=24)
):
    df = get_active_dataset()
    
    summary_data = compute_statistics(df, plant=plant)
    abc_data = perform_abc_analysis(df)
    comp_data = evaluate_and_compare_models(df, horizon=horizon, plant=plant)
    
    filename_base = f"industrial_material_report_{plant or 'ALL'}_{horizon}m"
    
    if format == "pdf":
        filepath = os.path.join(REPORTS_DIR, f"{filename_base}.pdf")
        generate_pdf_report(summary_data, abc_data, comp_data, filepath)
        return FileResponse(
            filepath,
            media_type="application/pdf",
            filename=f"{filename_base}.pdf"
        )
    elif format == "excel":
        filepath = os.path.join(REPORTS_DIR, f"{filename_base}.xlsx")
        best_model_details = comp_data['details'].get(comp_data['best_model'], {})
        generate_excel_report(df, best_model_details, abc_data, filepath)
        return FileResponse(
            filepath,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            filename=f"{filename_base}.xlsx"
        )
    elif format == "csv":
        filepath = os.path.join(REPORTS_DIR, f"{filename_base}.csv")
        generate_csv_export(df, filepath)
        return FileResponse(
            filepath,
            media_type="text/csv",
            filename=f"{filename_base}.csv"
        )
