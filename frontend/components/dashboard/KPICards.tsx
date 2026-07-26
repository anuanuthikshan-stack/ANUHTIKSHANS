"use client";

import { motion } from "framer-motion";
import { Package, IndianRupee, Activity, ArrowUpRight, ArrowDownRight, Sparkles } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";

interface KPICardsProps {
  stats: any;
  bestModel?: string;
}

export function KPICards({ stats, bestModel = "ARIMA" }: KPICardsProps) {
  const qty = stats?.quantity || {};
  const amt = stats?.amount || {};

  const cards = [
    {
      title: "Total Quantity Consumed",
      value: `${formatNumber(qty.total || 0)} KG`,
      subtext: `From ${stats?.total_records || 0} monthly observations`,
      icon: Package,
      gradient: "from-sky-500/20 to-blue-600/10",
      accent: "text-sky-400",
      border: "border-sky-500/30"
    },
    {
      title: "Total Budget Expenditure",
      value: formatCurrency(amt.total || 0),
      subtext: `Avg: ${formatCurrency(amt.mean || 0)}/mo`,
      icon: IndianRupee,
      gradient: "from-emerald-500/20 to-teal-600/10",
      accent: "text-emerald-400",
      border: "border-emerald-500/30"
    },
    {
      title: "Average Monthly Consumption",
      value: `${formatNumber(qty.mean || 0)} KG`,
      subtext: `Std Dev: ${formatNumber(qty.std_dev || 0)} KG`,
      icon: Activity,
      gradient: "from-indigo-500/20 to-purple-600/10",
      accent: "text-indigo-400",
      border: "border-indigo-500/30"
    },
    {
      title: "Max / Min Peak Consumption",
      value: `${formatNumber(qty.max || 0)} KG`,
      subtext: `Min Peak: ${formatNumber(qty.min || 0)} KG`,
      icon: ArrowUpRight,
      gradient: "from-amber-500/20 to-orange-600/10",
      accent: "text-amber-400",
      border: "border-amber-500/30"
    },
    {
      title: "Optimal AI Model",
      value: bestModel,
      subtext: "Lowest MAE Forecast Engine",
      icon: Sparkles,
      gradient: "from-purple-500/20 to-rose-600/10",
      accent: "text-purple-400",
      border: "border-purple-500/30"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, idx) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.08 }}
          className={`glass-card rounded-2xl p-4 border ${card.border} relative overflow-hidden group`}
        >
          {/* Background Ambient Glow */}
          <div className={`absolute -right-6 -bottom-6 w-24 h-24 bg-gradient-to-br ${card.gradient} rounded-full blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none`} />

          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 tracking-wide">{card.title}</span>
            <div className={`p-2 rounded-xl bg-slate-900/80 border border-slate-800 ${card.accent}`}>
              <card.icon className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white tracking-tight">{card.value}</h3>
            <p className="text-[11px] text-slate-400 font-medium">{card.subtext}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
