"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const WORKSPACES = [
  { id: "ws_abu_dhabi", name: "Abu Dhabi Site", code: "AD-WF", region: "UAE" },
  { id: "ws_dubai", name: "Dubai North", code: "DB-NF", region: "UAE" },
  { id: "ws_riyadh", name: "Riyadh Solar Farm", code: "RY-SF", region: "KSA" },
];

export default function WorkspacePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  const handleContinue = () => {
    if (selected) {
      router.push("/setup-device");
    }
  };

  return (
    <div className="w-full max-w-[480px]">
      <div className="text-center mb-8">
        <div className="mx-auto h-14 w-14 rounded-lg bg-primary flex items-center justify-center mb-4">
          <Building2 className="h-7 w-7 text-primary-foreground" />
        </div>
        <h1 className="text-[28px] leading-[34px] font-bold text-foreground">
          Select Workspace
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Choose the site you&apos;ll be working at today
        </p>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-3">
        {WORKSPACES.map((ws) => (
          <button
            key={ws.id}
            onClick={() => setSelected(ws.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left min-h-[64px] ${
              selected === ws.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30 hover:bg-accent"
            }`}
          >
            <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
              <Building2 className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground">{ws.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {ws.code} · {ws.region}
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
          </button>
        ))}
      </div>

      <Button
        onClick={handleContinue}
        disabled={!selected}
        className="w-full h-14 mt-6 text-base font-semibold"
      >
        Continue
      </Button>
    </div>
  );
}
