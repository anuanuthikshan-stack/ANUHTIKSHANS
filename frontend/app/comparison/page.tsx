"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Card } from "@/components/ui/Card";
import { api } from "@/lib/api-client";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from "recharts";
import { GitCompare, Trophy, Award, Sparkles } from "lucide-react";
import { formatNumber } from "@/lib/utils";

export default function ComparisonPage() {
  const [selectedPlant, setSelectedPlant] = useState("M001");
  const [compData, setCompData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadComparison() {
      try {
        setLoading(true);
        const res = await api.getComparison(6, selectedPlant);
        setCompData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadComparison();
  }, [selectedPlant]);

  const metrics = compData?.metrics || [];
  const bestModel = compData?.best_model || "ARIMA";

  return (
    <>
      <Navbar selectedPlant={selectedPlant} onPlantChange={setSelectedPlant} />

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AI Model Performance Comparison</h1>
          <p className="text-slate-400 text-sm">
            Empirical accuracy evaluation comparing ARIMA, Prophet, and XGBoost based on MAE, RMSE, MAPE, and R² metrics.
          </p>
        </div>

        {/* Winner Highlight Banner */}
        <Card className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-purple-500/10 border-amber-500/30 flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Trophy className="w-8 h-8 animate-bounce" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Best Model Winner
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-0.5">{bestModel} Forecasting Engine</h2>
              <p className="text-xs text-slate-400">Lowest MAE error rate for plant {selectedPlant}</p>
            </div>
          </div>
        </Card>

        {/* Comparison Metrics Leaderboard Table */}
        <Card className="space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-sky-400" />
            Model Accuracy Metrics Table
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Model Name</th>
                  <th className="p-3">MAE (Mean Absolute Error)</th>
                  <th className="p-3">RMSE (Root Mean Square Error)</th>
                  <th className="p-3">MAPE (%)</th>
                  <th className="p-3">R² Score</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {metrics.map((m: any) => (
                  <tr key={m.model} className={m.model === bestModel ? "bg-amber-500/10" : "hover:bg-slate-800/30"}>
                    <td className="p-3 font-bold text-white text-sm">{m.model}</td>
                    <td className="p-3 font-mono text-sky-400 font-semibold">{formatNumber(m.mae)} KG</td>
                    <td className="p-3 font-mono text-slate-300">{formatNumber(m.rmse)} KG</td>
                    <td className="p-3 font-mono text-purple-400">{m.mape}%</td>
                    <td className="p-3 font-mono text-emerald-400">{m.r2_score}</td>
                    <td className="p-3">
                      {m.model === bestModel ? (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/40">
                          ★ WINNER
                        </span>
                      ) : (
                        <span className="text-slate-500">Evaluated</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* MAE Error Comparison Chart */}
        <Card className="space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-purple-400" />
            MAE Error Comparison (Lower is Better)
          </h2>
          <div className="h-64 w-full">
            {loading ? (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">Loading...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="model" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }}
                    formatter={(val: any) => [`${formatNumber(val)} KG`, "MAE Error"]}
                  />
                  <Bar dataKey="mae" fill="#a855f7" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
