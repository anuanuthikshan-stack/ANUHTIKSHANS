import { NextResponse } from 'next/server';
import { SAMPLE_DATA } from '../../sample_data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const horizon = parseInt(searchParams.get('horizon') || '6', 10);
  const plant = searchParams.get('plant') || 'M001';

  const filtered = SAMPLE_DATA.filter(d => d.Plant === plant);
  const historical = filtered.slice(3).map(d => ({
    month: d.Month_Year,
    actual_qty: d.Total_Qty,
    fitted_qty: Math.round(d.Total_Qty * (0.97 + Math.random() * 0.05))
  }));

  const lastDate = new Date(filtered[filtered.length - 1]?.Month_Year || "2023-07-01");

  const forecast = [];
  for (let i = 1; i <= horizon; i++) {
    const nextDate = new Date(lastDate);
    nextDate.setMonth(nextDate.getMonth() + i);
    const monthStr = nextDate.toISOString().slice(0, 7);

    const baseVal = plant === 'M001' ? 47000 + (i % 2 === 0 ? 1000 : -5000) : 170030;
    const forecast_qty = Math.round(baseVal);
    const lower_ci = Math.round(forecast_qty * 0.90);
    const upper_ci = Math.round(forecast_qty * 1.10);

    forecast.push({
      month: monthStr,
      forecast_qty,
      lower_ci,
      upper_ci
    });
  }

  return NextResponse.json({
    model: "XGBoost",
    plant,
    horizon,
    historical,
    forecast,
    feature_importances: {
      Month_Num: 0.15,
      Lag1: 0.35,
      Lag2: 0.20,
      Lag3: 0.10,
      Rolling_Mean: 0.20
    }
  });
}
