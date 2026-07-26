import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "glass-card glass-card-hover rounded-2xl p-5 border border-slate-800/80 shadow-xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
