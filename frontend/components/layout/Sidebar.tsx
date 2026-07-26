"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Upload, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  GitCompare, 
  FileSpreadsheet, 
  Cpu,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Dataset Upload", href: "/upload", icon: Upload },
  { name: "EDA & Trends", href: "/eda", icon: BarChart3 },
  { name: "ABC Analysis", href: "/abc-analysis", icon: PieChart },
  { name: "Forecasting", href: "/forecast", icon: TrendingUp },
  { name: "Model Comparison", href: "/comparison", icon: GitCompare },
  { name: "Reports", href: "/reports", icon: FileSpreadsheet },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 glass-panel border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 z-40">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800/80">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight bg-gradient-to-r from-white via-slate-200 to-sky-400 bg-clip-text text-transparent">
              Forecast AI
            </h1>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Industrial Material</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-gradient-to-r from-sky-500/15 to-indigo-500/10 text-sky-400 border border-sky-500/20 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                )}
              >
                <item.icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", isActive ? "text-sky-400" : "text-slate-400")} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info / Logout */}
      <div className="p-4 border-t border-slate-800/80">
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-slate-400 font-medium">Status</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              API Online
            </span>
          </div>
          <p className="text-[11px] text-slate-500">ML Engine v1.0.0 (FastAPI)</p>
        </div>
      </div>
    </aside>
  );
}
