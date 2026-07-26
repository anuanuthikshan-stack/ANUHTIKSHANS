# Industrial Material Consumption Forecasting System

An enterprise-grade, production-ready AI forecasting platform built with **Next.js 15**, **FastAPI**, **Prophet**, **XGBoost**, and **statsmodels (ARIMA)**. This system refactors and transforms exploratory Jupyter notebook machine learning pipelines into a scalable, full-stack application featuring dataset cleaning, interactive EDA dashboards, ABC inventory classification, empirical model evaluation, and automated PDF report generation.

---

## Key Features

- **Multi-Model AI Forecasting Engine**:
  - **ARIMA**: Automatic stationary parameter fitting, 6 & 12-month future prediction with 95% confidence intervals.
  - **Meta Prophet**: Trend decomposition and seasonality modeling.
  - **XGBoost Regressor**: Supervised lag feature engineering (`Lag1`, `Lag2`, `Lag3`, `Rolling_Mean`) with recursive multi-step forecasting.
- **Model Evaluation & Comparison Leaderboard**:
  - Automatically computes **MAE**, **RMSE**, **MAPE**, and **R²** scores.
  - Automatically highlights the optimal model per plant/material location.
- **Dataset Upload & Automatic Cleaning**:
  - Drag-and-drop CSV uploader with schema validation, missing value imputation, duplicate removal, and date parsing.
- **ABC Inventory Classification**:
  - Pareto cumulative expenditure analysis classifying materials into Class A (70% value), Class B (20% value), and Class C (10% value).
  - Actionable inventory control strategies (JIT, periodic review, bulk ordering).
- **Interactive Recharts Dashboards**:
  - Dark-mode SaaS UI with glassmorphism, animated KPI cards, monthly trends, budget analysis, plant comparisons, and feature correlation heatmaps.
- **Executive Report Generator**:
  - One-click downloads for formatted **PDF Reports** (via ReportLab), **Multi-Sheet Excel Workbooks** (`.xlsx`), and cleaned **CSV Data Exports**.
- **Security & Authentication**:
  - JWT Authentication, bcrypt password hashing, and protected API endpoints.

---

## Tech Stack & Architecture

```text
Frontend:     Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Recharts, Framer Motion, Axios
Backend:      FastAPI (Python 3.12), Pandas, NumPy, Prophet, XGBoost, Statsmodels, Scikit-learn, ReportLab
Database:     SQLite (Development) / PostgreSQL-ready (Production via SQLAlchemy)
Container:    Docker & Docker Compose
Deployment:   Vercel (Frontend) & Render (Backend)
```

---

## Folder Structure

```text
industrial-material-forecast/
├── backend/
│   ├── api/
│   │   └── routes/ (auth, dataset, eda, forecasting, reports)
│   ├── preprocessing/ (cleaner, feature_engineering)
│   ├── forecasting/ (arima_model, prophet_model, xgboost_model, abc_analysis, evaluator)
│   ├── reports/ (pdf_generator, excel_generator)
│   ├── services/ (auth_service, model_manager)
│   ├── database/ (db, models)
│   ├── app.py
│   └── requirements.txt
├── frontend/
│   ├── app/ (dashboard, upload, eda, abc-analysis, forecast, comparison, reports, auth)
│   ├── components/ (layout, dashboard, ui)
│   ├── lib/ (api-client, utils)
│   └── package.json
├── dataset/ (sample_material_consumption.csv)
├── saved_models/
├── reports/
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

## Installation & Local Development

### Prerequisites

- Python 3.12+
- Node.js 20+
- Docker (optional)

### 1. Backend Setup (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```
Backend API will run at `http://localhost:8000` with interactive Swagger docs at `http://localhost:8000/docs`.

### 2. Frontend Setup (Next.js 15)

```bash
cd frontend
npm install
npm run dev
```
Frontend web application will run at `http://localhost:3000`.

### 3. Docker Compose (Alternative)

```bash
docker-compose up --build
```

---

## Dataset Format

Uploaded CSV files should contain the following columns:

| Column Name | Description | Example |
| :--- | :--- | :--- |
| `Plant` | Plant / Mine Identifier | `M001`, `M002` |
| `Month_Year` | Date in YYYY-MM format | `2022-03` |
| `Total_Qty_KG` | Material Consumption (KG) | `93990` |
| `Total_Amount_INR` | Total Expenditure (₹) | `6462395.33` |
| `Records` | Transaction Count | `10` |
| `Material_Name` | Material Description | `Coal Slurry` |

---

## REST API Endpoints Summary

```text
POST /api/auth/register    - Register new user
POST /api/auth/login       - Authenticate and return JWT token
POST /api/upload           - Upload and validate CSV dataset
GET  /api/statistics       - Get descriptive statistics & KPIs
GET  /api/eda/charts       - Fetch interactive EDA chart datasets
GET  /api/forecast/arima   - Run ARIMA time series forecast
GET  /api/forecast/prophet - Run Prophet forecast
GET  /api/forecast/xgboost - Run XGBoost lag-feature forecast
GET  /api/comparison       - Evaluate & compare all models (MAE, RMSE, MAPE, R²)
GET  /api/abc-analysis     - Execute ABC inventory classification
GET  /api/generate-report  - Download PDF, Excel (.xlsx), or CSV reports
```

---

## GitHub Setup & Commands

To initialize Git and push to GitHub:

```bash
git init
git add .
git commit -m "Initial commit - Industrial Material Consumption Forecasting System"
git branch -M main
git remote remove origin || true
git remote add origin https://github.com/anuanuthikshan-stack/ANUHTIKSHANS.git
git pull origin main --allow-unrelated-histories
git push -u origin main
```

---

## Deployment Guide

### Backend (Render)
1. Create a new **Web Service** on Render pointing to your GitHub repository.
2. Build Command: `pip install -r backend/requirements.txt`
3. Start Command: `cd backend && uvicorn app:app --host 0.0.0.0 --port $PORT`
4. Set Environment Variables: `SECRET_KEY`, `DATABASE_URL` (optional PostgreSQL connection string).

### Frontend (Vercel)
1. Import project into Vercel dashboard setting root directory to `frontend`.
2. Framework Preset: **Next.js**.
3. Set Environment Variable: `NEXT_PUBLIC_API_URL=https://your-backend-render-app.onrender.com/api`

---

## License & Author

- **Author**: Anuthikshan
- **License**: MIT
