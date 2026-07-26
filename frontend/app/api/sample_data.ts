export interface DataRow {
  Plant: string;
  Month_Year: string;
  Total_Qty: number;
  Total_Amount: number;
  Records: number;
  Material_Name: string;
}

export const SAMPLE_DATA: DataRow[] = [
  { Plant: "M001", Month_Year: "2021-11", Total_Qty: 58630, Total_Amount: 2793625.72, Records: 4, Material_Name: "Coal Slurry" },
  { Plant: "M001", Month_Year: "2022-02", Total_Qty: 38860, Total_Amount: 2629314.23, Records: 2, Material_Name: "Coal Slurry" },
  { Plant: "M001", Month_Year: "2022-03", Total_Qty: 93990, Total_Amount: 6462395.33, Records: 10, Material_Name: "Coal Slurry" },
  { Plant: "M001", Month_Year: "2022-04", Total_Qty: 45120, Total_Amount: 3120450.00, Records: 5, Material_Name: "Coal Slurry" },
  { Plant: "M001", Month_Year: "2022-05", Total_Qty: 62000, Total_Amount: 4100200.50, Records: 6, Material_Name: "Coal Slurry" },
  { Plant: "M001", Month_Year: "2022-06", Total_Qty: 78500, Total_Amount: 5200300.00, Records: 8, Material_Name: "Coal Slurry" },
  { Plant: "M001", Month_Year: "2022-07", Total_Qty: 51200, Total_Amount: 3400100.00, Records: 5, Material_Name: "Coal Slurry" },
  { Plant: "M001", Month_Year: "2022-08", Total_Qty: 89000, Total_Amount: 5900800.00, Records: 9, Material_Name: "Coal Slurry" },
  { Plant: "M001", Month_Year: "2022-09", Total_Qty: 34000, Total_Amount: 2300000.00, Records: 4, Material_Name: "Coal Slurry" },
  { Plant: "M001", Month_Year: "2022-10", Total_Qty: 67000, Total_Amount: 4500000.00, Records: 7, Material_Name: "Coal Slurry" },
  { Plant: "M001", Month_Year: "2022-11", Total_Qty: 8580, Total_Amount: 600000.00, Records: 1, Material_Name: "Coal Slurry" },
  { Plant: "M001", Month_Year: "2022-12", Total_Qty: 157480, Total_Amount: 10500000.00, Records: 15, Material_Name: "Coal Slurry" },
  { Plant: "M001", Month_Year: "2023-01", Total_Qty: 72000, Total_Amount: 4800000.00, Records: 7, Material_Name: "Coal Slurry" },
  { Plant: "M001", Month_Year: "2023-02", Total_Qty: 61000, Total_Amount: 4100000.00, Records: 6, Material_Name: "Coal Slurry" },
  { Plant: "M001", Month_Year: "2023-03", Total_Qty: 53000, Total_Amount: 3600000.00, Records: 5, Material_Name: "Coal Slurry" },
  { Plant: "M001", Month_Year: "2023-04", Total_Qty: 48000, Total_Amount: 3200000.00, Records: 4, Material_Name: "Coal Slurry" },
  { Plant: "M001", Month_Year: "2023-05", Total_Qty: 59000, Total_Amount: 3900000.00, Records: 6, Material_Name: "Coal Slurry" },
  { Plant: "M001", Month_Year: "2023-06", Total_Qty: 64000, Total_Amount: 4300000.00, Records: 7, Material_Name: "Coal Slurry" },
  { Plant: "M001", Month_Year: "2023-07", Total_Qty: 52000, Total_Amount: 3500000.00, Records: 5, Material_Name: "Coal Slurry" },
  
  { Plant: "M002", Month_Year: "2021-11", Total_Qty: 2310, Total_Amount: 180000.00, Records: 1, Material_Name: "Lignite Dust" },
  { Plant: "M002", Month_Year: "2021-12", Total_Qty: 12000, Total_Amount: 800000.00, Records: 2, Material_Name: "Lignite Dust" },
  { Plant: "M002", Month_Year: "2022-01", Total_Qty: 15000, Total_Amount: 980000.00, Records: 2, Material_Name: "Lignite Dust" },
  { Plant: "M002", Month_Year: "2022-02", Total_Qty: 18000, Total_Amount: 1200000.00, Records: 3, Material_Name: "Lignite Dust" },
  { Plant: "M002", Month_Year: "2022-03", Total_Qty: 24000, Total_Amount: 1600000.00, Records: 3, Material_Name: "Lignite Dust" },
  { Plant: "M002", Month_Year: "2022-04", Total_Qty: 29000, Total_Amount: 1900000.00, Records: 4, Material_Name: "Lignite Dust" },
  { Plant: "M002", Month_Year: "2022-05", Total_Qty: 35000, Total_Amount: 2300000.00, Records: 4, Material_Name: "Lignite Dust" },
  { Plant: "M002", Month_Year: "2022-06", Total_Qty: 42000, Total_Amount: 2800000.00, Records: 5, Material_Name: "Lignite Dust" },
  { Plant: "M002", Month_Year: "2022-07", Total_Qty: 31000, Total_Amount: 2000000.00, Records: 4, Material_Name: "Lignite Dust" },
  { Plant: "M002", Month_Year: "2022-08", Total_Qty: 55000, Total_Amount: 3600000.00, Records: 6, Material_Name: "Lignite Dust" },
  { Plant: "M002", Month_Year: "2022-09", Total_Qty: 170820, Total_Amount: 11000000.00, Records: 18, Material_Name: "Lignite Dust" },
  { Plant: "M002", Month_Year: "2022-10", Total_Qty: 48000, Total_Amount: 3100000.00, Records: 5, Material_Name: "Lignite Dust" },
  { Plant: "M002", Month_Year: "2022-11", Total_Qty: 26000, Total_Amount: 1700000.00, Records: 3, Material_Name: "Lignite Dust" },
  { Plant: "M002", Month_Year: "2022-12", Total_Qty: 33000, Total_Amount: 2100000.00, Records: 4, Material_Name: "Lignite Dust" },
  { Plant: "M002", Month_Year: "2023-01", Total_Qty: 39000, Total_Amount: 2500000.00, Records: 5, Material_Name: "Lignite Dust" },
  { Plant: "M002", Month_Year: "2023-02", Total_Qty: 28000, Total_Amount: 1800000.00, Records: 3, Material_Name: "Lignite Dust" },
  { Plant: "M002", Month_Year: "2023-03", Total_Qty: 36000, Total_Amount: 2400000.00, Records: 4, Material_Name: "Lignite Dust" },
  { Plant: "M002", Month_Year: "2023-04", Total_Qty: 41000, Total_Amount: 2700000.00, Records: 5, Material_Name: "Lignite Dust" },
  { Plant: "M002", Month_Year: "2023-05", Total_Qty: 30000, Total_Amount: 2000000.00, Records: 4, Material_Name: "Lignite Dust" },
  { Plant: "M002", Month_Year: "2023-06", Total_Qty: 44000, Total_Amount: 2900000.00, Records: 5, Material_Name: "Lignite Dust" },
  { Plant: "M002", Month_Year: "2023-07", Total_Qty: 47000, Total_Amount: 3100000.00, Records: 6, Material_Name: "Lignite Dust" }
];
