"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tablet, Wifi, HardDrive, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const CHECKS = [
  {
    id: "storage",
    label: "Local storage available",
    description: "IndexedDB accessible for offline data",
    icon: HardDrive,
  },
  {
    id: "network",
    label: "Network status detected",
    description: "Online/offline events are working",
    icon: Wifi,
  },
  {
    id: "device",
    label: "Device registered",
    description: "This device is ready for field operations",
    icon: Tablet,
  },
];

export default function SetupDevicePage() {
  const router = useRouter();
  const [completed, setCompleted] = useState<string[]>([]);
  const [checking, setChecking] = useState(false);

  const runChecks = () => {
    setChecking(true);
    CHECKS.forEach((check, index) => {
      setTimeout(() => {
        setCompleted((prev) => [...prev, check.id]);
        if (index === CHECKS.length - 1) {
          setChecking(false);
        }
      }, (index + 1) * 600);
    });
  };

  const allDone = completed.length === CHECKS.length;

  return (
    <div className="w-full max-w-[480px]">
      <div className="text-center mb-8">
        <div className="mx-auto h-14 w-14 rounded-lg bg-primary flex items-center justify-center mb-4">
          <Tablet className="h-7 w-7 text-primary-foreground" />
        </div>
        <h1 className="text-[28px] leading-[34px] font-bold text-foreground">
          Device Setup
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Verifying offline readiness and permissions
        </p>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-4">
        {CHECKS.map((check) => {
          const Icon = check.icon;
          const done = completed.includes(check.id);
          return (
            <div
              key={check.id}
              className="flex items-center gap-4 p-4 rounded-lg border border-border"
            >
              <div
                className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                  done ? "bg-success-50" : "bg-secondary"
                }`}
              >
                {done ? (
                  <CheckCircle2 className="h-5 w-5 text-success-700" />
                ) : (
                  <Icon className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">{check.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {check.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {!allDone ? (
        <Button
          onClick={runChecks}
          disabled={checking}
          className="w-full h-14 mt-6 text-base font-semibold"
        >
          {checking ? "Checking..." : "Run Device Checks"}
        </Button>
      ) : (
        <Button
          onClick={() => router.push("/welcome")}
          className="w-full h-14 mt-6 text-base font-semibold"
        >
          Continue to Waypoint
        </Button>
      )}
    </div>
  );
}
