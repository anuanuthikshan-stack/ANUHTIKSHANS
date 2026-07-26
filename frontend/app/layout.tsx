import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Industrial Material Consumption Forecasting System",
  description: "Production-ready AI forecasting platform powered by ARIMA, Prophet, and XGBoost.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen bg-[#0b0f19] text-slate-100 antialiased">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            {children}
          </main>
        </div>
        <Toaster position="top-right" theme="dark" richColors />
      </body>
    </html>
  );
}
