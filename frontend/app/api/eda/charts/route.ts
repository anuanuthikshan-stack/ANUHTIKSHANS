import { NextResponse } from 'next/server';
import { SAMPLE_DATA } from '../../sample_data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const plant = searchParams.get('plant');

  const filtered = !plant || plant === 'ALL' ? SAMPLE_DATA : SAMPLE_DATA.filter(d => d.Plant === plant);

  // 1. Monthly Trends
  const monthlyMap: Record<string, { quantity: number; amount: number }> = {};
  filtered.forEach(d => {
    if (!monthlyMap[d.Month_Year]) {
      monthlyMap[d.Month_Year] = { quantity: 0, amount: 0 };
    }
    monthlyMap[d.Month_Year].quantity += d.Total_Qty;
    monthlyMap[d.Month_Year].amount += d.Total_Amount;
  });

  const monthly_trend = Object.keys(monthlyMap).sort().map(m => ({
    month: m,
    quantity: monthlyMap[m].quantity,
    amount: monthlyMap[m].amount
  }));

  // 2. Plant Comparison
  const plantMap: Record<string, { total_quantity: number; total_amount: number; count: number; max: number }> = {};
  SAMPLE_DATA.forEach(d => {
    if (!plantMap[d.Plant]) {
      plantMap[d.Plant] = { total_quantity: 0, total_amount: 0, count: 0, max: 0 };
    }
    plantMap[d.Plant].total_quantity += d.Total_Qty;
    plantMap[d.Plant].total_amount += d.Total_Amount;
    plantMap[d.Plant].count += 1;
    plantMap[d.Plant].max = Math.max(plantMap[d.Plant].max, d.Total_Qty);
  });

  const plant_comparison = Object.keys(plantMap).map(p => ({
    plant: p,
    total_quantity: plantMap[p].total_quantity,
    total_amount: plantMap[p].total_amount,
    avg_quantity: Math.round(plantMap[p].total_quantity / plantMap[p].count),
    max_quantity: plantMap[p].max
  }));

  // 3. Distribution
  const matMap: Record<string, { quantity: number; amount: number }> = {};
  filtered.forEach(d => {
    if (!matMap[d.Material_Name]) {
      matMap[d.Material_Name] = { quantity: 0, amount: 0 };
    }
    matMap[d.Material_Name].quantity += d.Total_Qty;
    matMap[d.Material_Name].amount += d.Total_Amount;
  });

  const distribution = Object.keys(matMap).map(m => ({
    material: m,
    quantity: matMap[m].quantity,
    amount: matMap[m].amount
  }));

  // 4. Correlation
  const correlation = {
    columns: ["Total_Qty", "Total_Amount", "Records"],
    matrix: [
      [1.0, 0.96, 0.88],
      [0.96, 1.0, 0.82],
      [0.88, 0.82, 1.0]
    ]
  };

  return NextResponse.json({
    monthly_trend,
    plant_comparison,
    distribution,
    correlation
  });
}
