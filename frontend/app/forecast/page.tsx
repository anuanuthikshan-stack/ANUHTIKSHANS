"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Card } from "@/components/ui/Card";
import { api } from "@/lib/api-client";
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from "recharts";
import { TrendingUp, Cpu, Calendar, Play } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { toast } from "sonner";

export default function ForecastPage() {
  const [selectedPlant, setSelectedPlant] = useState("M001");
  const [modelType, setModelType] = useState<"arima" | "prophet" | "xgboost">("arima");
  const [horizon, setHorizon] = useState<number>(6);
  const [loading, setLoading] = useState(true);
  const [forecastData, setForecastData] = useState<any>(null);

  const runForecast = async () => {
    try {
      setLoading(true);
      let res;
      if (modelType === "arima") {
        res = await api.getARIMAForecast(horizon, selectedPlant);
      } else if (modelType === "prophet") {
        res = await api.getProphetForecast(horizon, selectedPlant);
      } else {
        res = await api.getXGBoostForecast(horizon, selectedPlant);
      }
      setForecastData(res.data);
      toast.success(`${modelType.toUpperCase()} forecast generated for ${selectedPlant}!`);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Forecasting execution failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runForecast();
  }, [selectedPlant, modelType, horizon]);

  // Combine historical and forecast for seamless visualization
  const combinedChartData = [
    ...(forecastData?.historical?.map((h: any) => ({
      month: h.month,
      actual: h.actual_qty,
      fitted: h.fitted_qty,
    })) || []),
    ...(forecastData?.forecast?.map((f: any) => ({
      month: f.month,
      forecast: f.forecast_qty,
      lower_ci: f.lower_ci,
      upper_ci: f.upper_ci,
    })) || [])
  ];

  return (
    <>
      <Navbar selectedPlant={selectedPlant} onPlantChange={setSelectedPlant} />

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AI Forecasting Module</h1>
          <p className="text-slate-400 text-sm">
            Select forecasting algorithm, horizon parameters, and view multi-month predictions with confidence intervals.
          </p>
        </div>

        {/* Controls Panel */}
        <Card className="flex flex-wrap items-center justify-between gap-4">
          {/* Model Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Algorithm:</span>
            <div className="flex bg-slate-900/90 p-1 rounded-xl border border-slate-800">
              {(["arima", "prophet", "xgboost"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setModelType(m)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
                    modelType === m
                      ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Horizon Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              Horizon:
            </span>
            <div className="flex bg-slate-900/90 p-1 rounded-xl border border-slate-800">
              {[6, 12].map((h) => (
                <button
                  key={h}
                  onClick={() => setHorizon(h)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    horizon === h
                      ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {h} Months
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={runForecast}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{loading ? "Computing..." : "Run Forecast"}</span>
          </button>
        </Card>

        {/* Forecast Visualization */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-400" />
              {modelType.toUpperCase()} Consumption Forecast ({horizon} Months Ahead)
            </h2>
            <span className="text-xs font-mono text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-500/20">
              Plant: {selectedPlant}
            </span>
          </div>

          <div className="h-80 w-full pt-4">
            {loading ? (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                Executing {modelType.toUpperCase()} Machine Learning Pipeline...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={combinedChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px" }}
                    formatter={(val: any) => [val ? `${formatNumber(val)} KG` : "-", "Quantity"]}
                  />
                  <Line type="monotone" dataKey="actual" name="Historical Actual" stroke="#94a3b8" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="forecast" name="AI Forecast" stroke="#38bdf8" strokeWidth={3} dot={{ r: 5 }} />
                  <Area type="monotone" dataKey="upper_ci" stroke="none" fill="#38bdf8" fillOpacity={0.15} />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Forecast Prediction Table */}
        <Card className="space-y-4">
          <h2 className="text-base font-bold text-white">Future Predictions & Confidence Intervals Table</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Future Month</th>
                  <th className="p-3">Forecasted Quantity (KG)</th>
                  <th className="p-3">Lower 95% Confidence Interval</th>
                  <th className="p-3">Upper 95% Confidence Interval</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {forecastData?.forecast?.map((f: any) => (
                  <tr key={f.month} className="hover:bg-slate-800/30 font-mono">
                    <td className="p-3 font-bold text-sky-400">{f.month}</td>
                    <td className="p-3 text-white font-bold text-sm">{formatNumber(f.forecast_qty)} KG</td>
                    <td className="p-3 text-slate-400">{formatNumber(f.lower_ci)} KG</td>
                    <td className="p-3 text-slate-400">{formatNumber(f.upper_ci)} KG</td>
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
