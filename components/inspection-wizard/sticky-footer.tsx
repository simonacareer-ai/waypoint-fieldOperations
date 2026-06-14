"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Save, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StickyFooterProps {
  onBack?: () => void;
  onNext?: () => void;
  onSave?: () => void;
  backLabel?: string;
  nextLabel?: string;
  saveLabel?: string;
  showBack?: boolean;
  showNext?: boolean;
  showSave?: boolean;
  showSavedStatus?: boolean;
  disabled?: boolean;
  className?: string;
}

export function StickyFooter({
  onBack,
  onNext,
  onSave,
  backLabel = "Back",
  nextLabel = "Continue",
  saveLabel = "Save Inspection",
  showBack = true,
  showNext = true,
  showSave = false,
  showSavedStatus = false,
  disabled = false,
  className,
}: StickyFooterProps) {
  return (
    <div
      className={cn(
        "fixed bottom-[65px] md:bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-sm px-4 md:px-6 py-4",
        className
      )}
    >
      <div className=" mx-auto flex flex-col sm:flex-row items-center justify-end gap-3 sm:gap-5">
        {showSavedStatus && (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-green-700 dark:text-green-400">Saved locally</span>
            <span className="text-xs text-muted-foreground ml-2">Draft updated 2 min ago</span>
          </div>
        )}
        {showBack ? (
          <Button
            variant="outline"
            className="h-14 px-6 text-base font-semibold cursor-pointer w-full sm:w-auto"
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            {backLabel}
          </Button>
        ) : (
          !showSavedStatus && <div />
        )}
        {showNext && (
          <Button
            className="h-14 px-8 text-base font-semibold cursor-pointer w-full sm:w-auto"
            onClick={onNext}
            disabled={disabled}
          >
            {nextLabel}
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        )}
        {showSave && (
          <Button
            className="h-14 px-8 text-base font-semibold bg-success-500 hover:bg-success-700 text-white cursor-pointer w-full sm:w-auto"
            onClick={onSave}
            disabled={disabled}
          >
            <Save className="h-5 w-5 mr-2" />
            {saveLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
