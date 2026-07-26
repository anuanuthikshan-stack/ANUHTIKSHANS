"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Card } from "@/components/ui/Card";
import { api } from "@/lib/api-client";
import { FileSpreadsheet, Download, FileText } from "lucide-react";
import { toast } from "sonner";

export default function ReportsPage() {
  const [selectedPlant, setSelectedPlant] = useState("ALL");
  const [horizon, setHorizon] = useState(6);
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);

  const handleDownload = async (format: 'pdf' | 'csv' | 'excel') => {
    try {
      setDownloadingFormat(format);
      const res = await api.downloadReport(format, selectedPlant, horizon);
      
      const mimeTypes: Record<string, string> = {
        pdf: 'application/pdf',
        excel: 'application/vnd.ms-excel',
        csv: 'text/csv'
      };

      const ext = format === 'excel' ? 'xls' : format;
      const blob = new Blob([res.data], { type: mimeTypes[format] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Industrial_Material_Report_${selectedPlant}_${horizon}m.${ext}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success(`${format.toUpperCase()} report downloaded successfully!`);
    } catch (err) {
      toast.error(`Failed to download ${format.toUpperCase()} report.`);
    } finally {
      setDownloadingFormat(null);
    }
  };

  return (
    <>
      <Navbar selectedPlant={selectedPlant} onPlantChange={setSelectedPlant} />

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Executive Report Generation</h1>
          <p className="text-slate-400 text-sm">
            Generate and export downloadable executive PDF reports, structured multi-sheet Excel workbooks, and CSV raw dataset exports.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* PDF Executive Report Card */}
          <Card className="space-y-4 border-sky-500/30 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
                <FileText className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-white">Executive PDF Report</h2>
              <p className="text-xs text-slate-400">
                Includes executive summary KPIs, ABC classification, AI model evaluation leaderboard, and strategic inventory action plan.
              </p>
            </div>
            <button
              onClick={() => handleDownload('pdf')}
              disabled={downloadingFormat === 'pdf'}
              className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-lg shadow-sky-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{downloadingFormat === 'pdf' ? "Generating PDF..." : "Download PDF Report"}</span>
            </button>
          </Card>

          {/* Excel Report Card */}
          <Card className="space-y-4 border-emerald-500/30 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-white">Multi-Sheet Excel Workbook</h2>
              <p className="text-xs text-slate-400">
                Structured .XLS file with dedicated tabs for Cleaned Historical Data, Forecast Predictions, and ABC Rankings.
              </p>
            </div>
            <button
              onClick={() => handleDownload('excel')}
              disabled={downloadingFormat === 'excel'}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{downloadingFormat === 'excel' ? "Generating Excel..." : "Download Excel (.xls)"}</span>
            </button>
          </Card>

          {/* Raw CSV Export Card */}
          <Card className="space-y-4 border-purple-500/30 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                <FileText className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-white">Cleaned Raw CSV Export</h2>
              <p className="text-xs text-slate-400">
                Cleaned dataset export ready for downstream integration into enterprise ERP systems and custom analytics pipelines.
              </p>
            </div>
            <button
              onClick={() => handleDownload('csv')}
              disabled={downloadingFormat === 'csv'}
              className="w-full py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white text-xs font-bold shadow-lg shadow-purple-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{downloadingFormat === 'csv' ? "Generating CSV..." : "Download CSV Data"}</span>
            </button>
          </Card>
        </div>
      </div>
    </>
  );
}
