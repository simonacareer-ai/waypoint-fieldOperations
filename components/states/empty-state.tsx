"use client";

import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  tip?: string;
  className?: string;
}

export function EmptyState({ icon, title, description, action, tip, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
      <div className="mb-5">
        {icon || (
          <div className="h-16 w-16 rounded-lg bg-secondary flex items-center justify-center">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-[380px] mb-5">{description}</p>
      {action}
      {tip && (
        <div className="mt-5 flex items-start gap-2 max-w-[420px] text-left px-4 py-3 rounded-lg border-l-4 border-primary bg-primary/5">
          <span className="text-primary text-sm mt-0.5">&#x1F4A1;</span>
          <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">Tip:</span> {tip}</p>
        </div>
      )}
    </div>
  );
}
