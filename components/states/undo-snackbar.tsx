"use client";

import { useEffect, useState } from "react";
import { Undo2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UndoSnackbarProps {
  message: string;
  onUndo: () => void;
  duration?: number;
  visible: boolean;
  onDismiss: () => void;
}

export function UndoSnackbar({
  message,
  onUndo,
  duration = 5000,
  visible,
  onDismiss,
}: UndoSnackbarProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onDismiss, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onDismiss]);

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      <div className="flex items-center gap-3 rounded-xl bg-foreground text-background px-5 py-3.5 shadow-lg">
        <span className="text-sm font-medium">{message}</span>
        <Button
          variant="ghost"
          size="sm"
          className="text-background hover:text-background/80 hover:bg-background/10 h-8 px-3"
          onClick={onUndo}
        >
          <Undo2 className="h-4 w-4 mr-1.5" />
          Undo
        </Button>
        <button onClick={onDismiss} className="text-background/60 hover:text-background">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
