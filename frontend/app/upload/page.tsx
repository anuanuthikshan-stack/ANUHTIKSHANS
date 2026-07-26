"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Card } from "@/components/ui/Card";
import { api } from "@/lib/api-client";
import { Upload, FileText, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [report, setReport] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a CSV file first.");
      return;
    }

    try {
      setUploading(true);
      const res = await api.uploadCSV(file);
      setReport(res.data.report);
      toast.success("Dataset uploaded and automatically cleaned successfully!");
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Dataset upload failed.";
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dataset Upload & Automated Cleaning</h1>
          <p className="text-slate-400 text-sm">
            Upload material consumption CSV files. Missing values, duplicates, and column formats are automatically handled.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Zone */}
          <Card className="space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-sky-400" />
                Select CSV Dataset File
              </h2>

              <div className="border-2 border-dashed border-slate-700 hover:border-sky-500/50 rounded-2xl p-8 text-center bg-slate-900/40 transition cursor-pointer relative">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {file ? file.name : "Click or drag & drop CSV file here"}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {file ? `${(file.size / 1024).toFixed(2)} KB` : "Supports Plant, Month_Year, Total_Qty, Total_Amount"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-sky-500/20 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Validating & Cleaning Dataset...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Upload & Process Dataset</span>
                </>
              )}
            </button>
          </Card>

          {/* Validation Report */}
          <Card className="space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Automated Data Validation & Cleaning Report
            </h2>

            {report ? (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Data Processing Complete: {report.cleaned_rows} Clean Rows
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400">Initial Rows:</span>
                    <p className="text-sm font-bold text-white">{report.initial_rows}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400">Duplicates Removed:</span>
                    <p className="text-sm font-bold text-amber-400">{report.duplicates_removed}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold">Plants Discovered:</span>
                  <div className="flex gap-2 pt-1">
                    {report.plants_found?.map((p: string) => (
                      <span key={p} className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold">Chronological Date Range:</span>
                  <p className="text-white font-mono">{report.date_range?.join(" → ")}</p>
                </div>
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-slate-500 text-xs space-y-2 border border-slate-800/60 rounded-xl">
                <AlertCircle className="w-6 h-6 text-slate-600" />
                <span>Upload a CSV file to inspect validation results</span>
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
