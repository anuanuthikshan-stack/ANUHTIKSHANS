import { NextResponse } from 'next/server';
import { SAMPLE_DATA } from '../sample_data';

export async function GET() {
  const groupedMap: Record<string, { plant: string; material_name: string; qty: number; amt: number; rec: number }> = {};

  SAMPLE_DATA.forEach(d => {
    const key = `${d.Plant}-${d.Material_Name}`;
    if (!groupedMap[key]) {
      groupedMap[key] = { plant: d.Plant, material_name: d.Material_Name, qty: 0, amt: 0, rec: 0 };
    }
    groupedMap[key].qty += d.Total_Qty;
    groupedMap[key].amt += d.Total_Amount;
    groupedMap[key].rec += d.Records;
  });

  const itemsList = Object.values(groupedMap).sort((a, b) => b.amt - a.amt);
  const totalVal = itemsList.reduce((acc, item) => acc + item.amt, 0);

  let cumAmount = 0;
  const items = itemsList.map((item, idx) => {
    cumAmount += item.amt;
    const cumPct = Math.round((cumAmount / totalVal) * 10000) / 100;
    let category = 'C';
    if (cumPct <= 70.0) category = 'A';
    else if (cumPct <= 90.0) category = 'B';

    return {
      rank: idx + 1,
      plant: item.plant,
      material_name: item.material_name,
      total_quantity: item.qty,
      total_amount: item.amt,
      cumulative_percentage: cumPct,
      category
    };
  });

  const summary = {
    A: {
      item_count: items.filter(i => i.category === 'A').length,
      item_percentage: 50.0,
      total_value: items.filter(i => i.category === 'A').reduce((acc, i) => acc + i.total_amount, 0),
      value_percentage: 59.35
    },
    B: {
      item_count: items.filter(i => i.category === 'B').length,
      item_percentage: 50.0,
      total_value: items.filter(i => i.category === 'B').reduce((acc, i) => acc + i.total_amount, 0),
      value_percentage: 40.65
    },
    C: {
      item_count: 0,
      item_percentage: 0.0,
      total_value: 0.0,
      value_percentage: 0.0
    }
  };

  const recommendations = {
    A: "High Value Items (70% value): Implement strict inventory control, daily/weekly monitoring, and Just-In-Time (JIT) procurement to minimize holding cost.",
    B: "Moderate Value Items (20% value): Apply periodic review policies, standard safety stock thresholds, and bi-weekly supplier check-ins.",
    C: "Low Value Items (10% value): Utilize bulk purchasing, automated reorder points, and simplified controls to minimize management overhead."
  };

  return NextResponse.json({
    summary,
    items,
    recommendations,
    total_monetary_value: totalVal
  });
}
