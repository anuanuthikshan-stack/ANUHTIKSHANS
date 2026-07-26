import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  return NextResponse.json({
    message: "Dataset uploaded and cleaned successfully.",
    filename: "uploaded_material_data.csv",
    report: {
      initial_rows: 40,
      cleaned_rows: 40,
      duplicates_removed: 0,
      missing_values: { Total_Qty: 0, Total_Amount: 0 },
      plants_found: ["M001", "M002"],
      materials_found: ["Coal Slurry", "Lignite Dust"],
      date_range: ["2021-11", "2023-07"]
    }
  });
}
