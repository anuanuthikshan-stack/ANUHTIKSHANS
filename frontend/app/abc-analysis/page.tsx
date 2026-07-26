"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Card } from "@/components/ui/Card";
import { api } from "@/lib/api-client";
import { 
  ResponsiveContainer, 
  PieChart as RePieChart, 
  Pie, 
  Cell, 
  Tooltip 
} from "recharts";
import { PieChart, ShieldAlert, ShieldCheck, HelpCircle } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";

const ABC_COLORS = {
  A: "#f43f5e", // Rose for Class A
  B: "#f59e0b", // Amber for Class B
  C: "#10b981", // Emerald for Class C
};

export default function ABCAnalysisPage() {
  const [abcData, setAbcData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadABC() {
      try {
        setLoading(true);
        const res = await api.getABCAnalysis();
        setAbcData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadABC();
  }, []);

  const summary = abcData?.summary || {};

  const chartData = [
    { name: "Class A (Top 70%)", value: summary?.A?.total_value || 0, cat: "A" },
    { name: "Class B (Next 20%)", value: summary?.B?.total_value || 0, cat: "B" },
    { name: "Class C (Remaining 10%)", value: summary?.C?.total_value || 0, cat: "C" },
  ];

  return (
    <>
      <Navbar />

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">ABC Inventory Classification Analysis</h1>
          <p className="text-slate-400 text-sm">
            Pareto 70/20/10 monetary distribution analysis to prioritize inventory management and purchasing controls.
          </p>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-rose-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Class A (High Value)</span>
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </div>
            <h2 className="text-xl font-bold text-white">{formatCurrency(summary?.A?.total_value || 0)}</h2>
            <p className="text-xs text-slate-400">
              {summary?.A?.value_percentage}% of total value | {summary?.A?.item_count} items
            </p>
          </Card>

          <Card className="border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Class B (Moderate Value)</span>
              <HelpCircle className="w-4 h-4 text-amber-400" />
            </div>
            <h2 className="text-xl font-bold text-white">{formatCurrency(summary?.B?.total_value || 0)}</h2>
            <p className="text-xs text-slate-400">
              {summary?.B?.value_percentage}% of total value | {summary?.B?.item_count} items
            </p>
          </Card>

          <Card className="border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Class C (Low Value)</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white">{formatCurrency(summary?.C?.total_value || 0)}</h2>
            <p className="text-xs text-slate-400">
              {summary?.C?.value_percentage}% of total value | {summary?.C?.item_count} items
            </p>
          </Card>
        </div>

        {/* Main Section: Chart + Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ABC Monetary Pie Chart */}
          <Card className="space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-sky-400" />
              Monetary Value Percentage Share
            </h2>
            <div className="h-72 w-full">
              {loading ? (
                <div className="h-full flex items-center justify-center text-slate-500 text-xs">Loading...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                    >
                      {chartData.map((entry) => (
                        <Cell key={entry.cat} fill={ABC_COLORS[entry.cat as keyof typeof ABC_COLORS]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }}
                      formatter={(val: any) => [formatCurrency(val), "Expenditure"]}
                    />
                  </RePieChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>

          {/* Strategic Action Recommendations */}
          <Card className="space-y-4">
            <h2 className="text-base font-bold text-white">Strategic Procurement Recommendations</h2>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-slate-200">
                <span className="font-bold text-rose-400 block mb-1">Class A Strategy: Tight Control</span>
                {abcData?.recommendations?.A}
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-slate-200">
                <span className="font-bold text-amber-400 block mb-1">Class B Strategy: Periodic Review</span>
                {abcData?.recommendations?.B}
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-slate-200">
                <span className="font-bold text-emerald-400 block mb-1">Class C Strategy: Bulk Order & Automation</span>
                {abcData?.recommendations?.C}
              </div>
            </div>
          </Card>
        </div>

        {/* Detailed Item Ranking Table */}
        <Card className="space-y-4">
          <h2 className="text-base font-bold text-white">Categorized Material Ranking Table</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Rank</th>
                  <th className="p-3">Plant</th>
                  <th className="p-3">Material Name</th>
                  <th className="p-3">Total Quantity</th>
                  <th className="p-3">Total Expenditure (₹)</th>
                  <th className="p-3">Cumulative %</th>
                  <th className="p-3">Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {abcData?.items?.map((item: any) => (
                  <tr key={`${item.plant}-${item.material_name}`} className="hover:bg-slate-800/30">
                    <td className="p-3 font-mono text-slate-400">#{item.rank}</td>
                    <td className="p-3 font-bold text-sky-400">{item.plant}</td>
                    <td className="p-3 text-white font-medium">{item.material_name}</td>
                    <td className="p-3 text-slate-300">{formatNumber(item.total_quantity)} KG</td>
                    <td className="p-3 text-emerald-400 font-semibold">{formatCurrency(item.total_amount)}</td>
                    <td className="p-3 text-slate-400 font-mono">{item.cumulative_percentage}%</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.category === 'A' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        item.category === 'B' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        Class {item.category}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}
