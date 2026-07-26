import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') || 'pdf';
  const plant = searchParams.get('plant') || 'ALL';

  if (format === 'csv') {
    const csvContent = `Plant,Month_Year,Total_Qty_KG,Total_Amount_INR,Records,Material_Name
M001,2021-11,58630,2793625.72,4,Coal Slurry
M001,2022-02,38860,2629314.23,2,Coal Slurry
M001,2022-03,93990,6462395.33,10,Coal Slurry
M002,2021-11,2310,180000.00,1,Lignite Dust
M002,2022-01,15000,980000.00,2,Lignite Dust`;

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="industrial_material_report_${plant}.csv"`
      }
    });
  }

  // Return text representation for instant prototype download
  const dummyReport = `Industrial Material Consumption Forecasting System Report
Plant: ${plant}
Generated: ${new Date().toISOString()}

1. Executive Summary:
Total Quantity Consumed: 1,792,500 KG
Total Budget Expenditure: ₹ 116,719,030.64
Best Performing Forecast Engine: ARIMA (Lowest MAE Error)

2. ABC Inventory Classification:
Class A: 59.35% value share (Coal Slurry) - Tight JIT Inventory Control
Class B: 40.65% value share (Lignite Dust) - Periodic Review Control

3. AI Forecast Predictions (Next 6 Months):
Month 1: 56,840 KG
Month 2: 53,985 KG
Month 3: 54,212 KG
Month 4: 54,194 KG
Month 5: 54,195 KG
Month 6: 54,195 KG`;

  return new NextResponse(dummyReport, {
    headers: {
      'Content-Type': format === 'pdf' ? 'application/pdf' : 'application/octet-stream',
      'Content-Disposition': `attachment; filename="industrial_material_report_${plant}.${format}"`
    }
  });
}
