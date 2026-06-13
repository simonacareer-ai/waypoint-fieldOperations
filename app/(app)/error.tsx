"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertOctagon, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-[500px] mx-auto">
      <div className="h-16 w-16 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center mb-5">
        <AlertOctagon className="h-8 w-8 text-red-600 dark:text-red-400" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">Something went wrong</h2>
      <p className="text-sm text-muted-foreground mb-6">
        An unexpected error occurred. Your data is safe — any unsaved changes are stored locally.
      </p>
      <Button onClick={reset} className="cursor-pointer">
        <RotateCcw className="h-4 w-4 mr-2" />
        Try again
      </Button>
    </div>
  );
}
