"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Card } from "@/components/ui/Card";
import { api } from "@/lib/api-client";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart as RePieChart, 
  Pie, 
  Cell 
} from "recharts";
import { BarChart3, IndianRupee, PieChart, Layers } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";

const COLORS = ["#38bdf8", "#10b981", "#a855f7", "#f59e0b", "#f43f5e"];

export default function EDAPage() {
  const [selectedPlant, setSelectedPlant] = useState("ALL");
  const [edaData, setEdaData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEDA() {
      try {
        setLoading(true);
        const res = await api.getEDACharts(selectedPlant);
        setEdaData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadEDA();
  }, [selectedPlant]);

  return (
    <>
      <Navbar selectedPlant={selectedPlant} onPlantChange={setSelectedPlant} />

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Exploratory Data Analysis (EDA)</h1>
          <p className="text-slate-400 text-sm">
            Interactive multi-dimensional visual analysis of monthly consumption, budget expenditure, and plant performance.
          </p>
        </div>

        {/* Grid of EDA Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Budget Trend Chart */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-emerald-400" />
                Monthly Budget Expenditure (₹)
              </h2>
            </div>
            <div className="h-64 w-full">
              {loading ? (
                <div className="h-full flex items-center justify-center text-slate-500 text-xs">Loading...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={edaData?.monthly_trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} tickFormatter={(v) => `₹${v / 100000}L`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }}
                      formatter={(val: any) => [formatCurrency(val), "Budget Amount"]}
                    />
                    <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>

          {/* Plant Comparison Bar Chart */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-sky-400" />
                Plant Consumption Comparison (M001 vs M002)
              </h2>
            </div>
            <div className="h-64 w-full">
              {loading ? (
                <div className="h-full flex items-center justify-center text-slate-500 text-xs">Loading...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={edaData?.plant_comparison}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="plant" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }}
                      formatter={(val: any) => [`${formatNumber(val)} KG`, "Total Qty"]}
                    />
                    <Bar dataKey="total_quantity" fill="#38bdf8" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>

          {/* Material Share Distribution */}
          <Card className="space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-400" />
              Material Quantity Distribution
            </h2>
            <div className="h-64 w-full flex items-center justify-center">
              {loading ? (
                <div className="text-slate-500 text-xs">Loading...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={edaData?.distribution}
                      dataKey="quantity"
                      nameKey="material"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {edaData?.distribution?.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }}
                      formatter={(val: any) => [`${formatNumber(val)} KG`, "Quantity"]}
                    />
                  </RePieChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>

          {/* Correlation Matrix */}
          <Card className="space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              Feature Correlation Matrix
            </h2>
            <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-3">
              <div className="grid grid-cols-4 text-center text-xs font-bold text-slate-400 border-b border-slate-800 pb-2">
                <div>Feature</div>
                <div>Quantity</div>
                <div>Amount</div>
                <div>Records</div>
              </div>
              {edaData?.correlation?.columns?.map((col: string, i: number) => (
                <div key={col} className="grid grid-cols-4 text-center text-xs font-mono py-1.5 border-b border-slate-800/40">
                  <div className="font-semibold text-sky-400 text-left pl-2">{col}</div>
                  {edaData?.correlation?.matrix[i]?.map((val: number, j: number) => (
                    <div key={j} className={val === 1 ? "text-emerald-400 font-bold" : "text-slate-300"}>
                      {val.toFixed(2)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
