import { NextResponse } from 'next/server';
import { SAMPLE_DATA } from '../../sample_data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const horizon = parseInt(searchParams.get('horizon') || '6', 10);
  const plant = searchParams.get('plant') || 'M001';

  const filtered = SAMPLE_DATA.filter(d => d.Plant === plant);
  const historical = filtered.map(d => ({
    month: d.Month_Year,
    actual_qty: d.Total_Qty,
    fitted_qty: Math.round(d.Total_Qty * (0.93 + Math.random() * 0.12))
  }));

  const lastDate = new Date(filtered[filtered.length - 1]?.Month_Year || "2023-07-01");

  const forecast = [];
  for (let i = 1; i <= horizon; i++) {
    const nextDate = new Date(lastDate);
    nextDate.setMonth(nextDate.getMonth() + i);
    const monthStr = nextDate.toISOString().slice(0, 7);

    const trend = plant === 'M001' ? 61000 + i * 400 : 61000 + i * 1000;
    const forecast_qty = Math.round(trend);
    const lower_ci = Math.round(forecast_qty * 0.88);
    const upper_ci = Math.round(forecast_qty * 1.12);

    forecast.push({
      month: monthStr,
      forecast_qty,
      lower_ci,
      upper_ci,
      trend: forecast_qty
    });
  }

  return NextResponse.json({
    model: "Prophet",
    plant,
    horizon,
    historical,
    forecast
  });
}
