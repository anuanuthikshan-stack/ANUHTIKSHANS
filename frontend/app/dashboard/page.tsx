"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { KPICards } from "@/components/dashboard/KPICards";
import { Card } from "@/components/ui/Card";
import { api } from "@/lib/api-client";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from "recharts";
import { TrendingUp, Upload, CheckCircle2, Cpu, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatNumber } from "@/lib/utils";
import { toast } from "sonner";

export default function DashboardPage() {
  const [selectedPlant, setSelectedPlant] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [bestModel, setBestModel] = useState<string>("ARIMA");

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [statsRes, edaRes, compRes] = await Promise.all([
          api.getStatistics(selectedPlant),
          api.getEDACharts(selectedPlant),
          api.getComparison(6, selectedPlant)
        ]);

        setStatsData(statsRes.data.stats);
        setChartData(edaRes.data.monthly_trend || []);
        setBestModel(compRes.data.best_model || "ARIMA");
      } catch (err) {
        toast.error("Failed to load dashboard metrics.");
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [selectedPlant]);

  return (
    <>
      <Navbar selectedPlant={selectedPlant} onPlantChange={setSelectedPlant} />

      {/* Hero Welcome Banner */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-sky-500/20 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-sky-950/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-sky-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5" />
            AI-Powered Industrial Forecasting Platform
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Material Consumption Intelligence Dashboard
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl">
            Real-time monthly consumption tracking, statistical profiling, ABC inventory classification, and multi-model AI forecasting with ARIMA, Prophet, and XGBoost.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <KPICards stats={statsData} bestModel={bestModel} />

      {/* Main Grid: Chart + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Consumption Trend Chart */}
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-sky-400" />
                Historical Monthly Consumption Trend
              </h2>
              <p className="text-xs text-slate-400">Total Material Quantity (KG) per Month</p>
            </div>
            <div className="text-xs text-slate-400 font-medium bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
              Plant: <span className="text-sky-400 font-semibold">{selectedPlant}</span>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            {loading ? (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                Loading Trend Data...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="qtyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => `${val / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", color: "#f8fafc" }}
                    formatter={(value: any) => [`${formatNumber(value)} KG`, "Quantity"]}
                  />
                  <Area type="monotone" dataKey="quantity" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#qtyGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Quick Navigation Cards */}
        <div className="space-y-4">
          <Card className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Dataset Upload & Clean</h3>
                <p className="text-xs text-slate-400">Validate & upload new CSV records</p>
              </div>
            </div>
            <Link
              href="/upload"
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-sky-400 transition"
            >
              <span>Upload CSV Dataset</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Card>

          <Card className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">AI Forecast Workspace</h3>
                <p className="text-xs text-slate-400">ARIMA, Prophet & XGBoost</p>
              </div>
            </div>
            <Link
              href="/forecast"
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-purple-400 transition"
            >
              <span>Run AI Forecasting</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Card>

          <Card className="space-y-2 bg-gradient-to-br from-slate-900 to-indigo-950/40">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              Active System Status
            </div>
            <p className="text-xs text-slate-300">
              Model retraining automatically triggered upon CSV dataset upload.
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}
