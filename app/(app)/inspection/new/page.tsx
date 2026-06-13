"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NewInspectionPage() {
  const router = useRouter();

  useEffect(() => {
    const draftId = `draft_${Date.now()}`;
    router.replace(`/inspection/draft/${draftId}/step-1`);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
        <p className="text-sm text-muted-foreground mt-4">Creating inspection draft...</p>
      </div>
    </div>
  );
}
