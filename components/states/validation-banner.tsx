"use client";

import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

interface ValidationBannerProps {
  message: string;
  errors?: string[];
}

export function ValidationBanner({ message, errors }: ValidationBannerProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="rounded-lg border border-critical-500/30 bg-critical-50 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-critical-700 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-critical-700">{message}</p>
          {errors && errors.length > 0 && (
            <ul className="mt-2 space-y-1">
              {errors.map((error, i) => (
                <li key={i} className="text-xs text-critical-700/80">
                  • {error}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-critical-700/60 hover:text-critical-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
