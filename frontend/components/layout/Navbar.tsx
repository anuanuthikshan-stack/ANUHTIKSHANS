"use client";

import { Filter, Download, Bell, User } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

interface NavbarProps {
  selectedPlant?: string;
  onPlantChange?: (plant: string) => void;
}

export function Navbar({ selectedPlant = "ALL", onPlantChange }: NavbarProps) {
  const [downloading, setDownloading] = useState(false);

  const handleQuickDownload = async () => {
    try {
      setDownloading(true);
      const res = await api.downloadReport('pdf', selectedPlant);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Industrial_Material_Report_${selectedPlant}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Executive PDF report downloaded successfully!");
    } catch (err) {
      toast.error("Failed to generate PDF report.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <header className="h-16 glass-panel border-b border-slate-800 sticky top-0 z-30 px-6 flex items-center justify-between">
      {/* Search / Filter Control */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
          <Filter className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-slate-400">Plant Filter:</span>
          <select
            value={selectedPlant}
            onChange={(e) => onPlantChange?.(e.target.value)}
            className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-slate-900">All Plants (Combined)</option>
            <option value="M001" className="bg-slate-900">Plant M001 (Mine I)</option>
            <option value="M002" className="bg-slate-900">Plant M002 (Mine II)</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleQuickDownload}
          disabled={downloading}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-sky-500/20 transition duration-200 disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{downloading ? "Generating..." : "Quick PDF Report"}</span>
        </button>

        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
          <User className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
}
