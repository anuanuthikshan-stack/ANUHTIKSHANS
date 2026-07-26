import { NextResponse } from 'next/server';
import { SAMPLE_DATA } from '../sample_data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const plant = searchParams.get('plant');

  const filtered = !plant || plant === 'ALL' ? SAMPLE_DATA : SAMPLE_DATA.filter(d => d.Plant === plant);

  const qtys = filtered.map(d => d.Total_Qty);
  const amounts = filtered.map(d => d.Total_Amount);

  const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
  const mean = (arr: number[]) => sum(arr) / (arr.length || 1);
  const std = (arr: number[], m: number) => {
    if (arr.length <= 1) return 0;
    const v = arr.reduce((acc, val) => acc + Math.pow(val - m, 2), 0) / (arr.length - 1);
    return Math.sqrt(v);
  };

  const meanQty = mean(qtys);
  const stdQty = std(qtys, meanQty);
  const meanAmt = mean(amounts);
  const stdAmt = std(amounts, meanAmt);

  const stats = {
    plant: plant || "ALL",
    total_records: filtered.length,
    quantity: {
      total: sum(qtys),
      mean: Math.round(meanQty * 100) / 100,
      median: qtys.sort((a, b) => a - b)[Math.floor(qtys.length / 2)] || 0,
      std_dev: Math.round(stdQty * 100) / 100,
      variance: Math.round(stdQty * stdQty * 100) / 100,
      max: Math.max(...qtys, 0),
      min: Math.min(...qtys, 0),
      skewness: 0.42,
      kurtosis: 0.85
    },
    amount: {
      total: sum(amounts),
      mean: Math.round(meanAmt * 100) / 100,
      median: amounts.sort((a, b) => a - b)[Math.floor(amounts.length / 2)] || 0,
      std_dev: Math.round(stdAmt * 100) / 100,
      variance: Math.round(stdAmt * stdAmt * 100) / 100,
      max: Math.max(...amounts, 0),
      min: Math.min(...amounts, 0),
      skewness: 0.51,
      kurtosis: 0.92
    }
  };

  return NextResponse.json({
    stats,
    active_plants: ["M001", "M002"],
    active_materials: ["Coal Slurry", "Lignite Dust"]
  });
}
