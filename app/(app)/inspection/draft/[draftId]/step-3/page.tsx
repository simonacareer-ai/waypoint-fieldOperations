"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Battery, Thermometer, Activity, RadioTower, Minus, Plus, Info } from "lucide-react";
import { PageHeader } from "@/components/app-shell/page-header";
import { WizardStepper } from "@/components/inspection-wizard/wizard-stepper";
import { StickyFooter } from "@/components/inspection-wizard/sticky-footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const STEPS = [
  { label: "Installation", description: "Select asset" },
  { label: "Status", description: "Set condition" },
  { label: "Measurements", description: "Record data" },
  { label: "Notes & Save", description: "Review" },
];

export default function Step3Page() {
  const params = useParams();
  const router = useRouter();
  const [battery, setBattery] = useState(72);
  const [temperature, setTemperature] = useState(28);
  const [rotorSpeed, setRotorSpeed] = useState(1720);
  const [vibration, setVibration] = useState(3.2);

  return (
    <div className="space-y-6 max-w-[900px] pb-24">
      <WizardStepper currentStep={3} steps={STEPS} />

      <PageHeader
        title="Enter Measurements"
        description="Record current sensor readings from the asset."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="p-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-info-50 flex items-center justify-center">
                <Battery className="h-5 w-5 text-info-700" />
              </div>
              <div>
                <p className="font-medium text-foreground">Battery</p>
                <p className="text-xs text-muted-foreground">Percentage</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                aria-label="Decrease battery"
                className="h-16 w-16 rounded-xl text-lg text-primary hover:bg-primary/5 cursor-pointer"
                onClick={() => setBattery(Math.max(0, battery - 1))}
              >
                <Minus style={{ height: 25, width: 25 }} />
              </Button>
              <div className="text-center min-w-[80px]" aria-live="polite">
                <p className="text-[32px] font-bold text-foreground">{battery}</p>
                <p className="text-[16px] text-muted-foreground">%</p>
              </div>
              <Button
                variant="outline"
                size="icon"
                aria-label="Increase battery"
                className="h-16 w-16 rounded-xl text-lg text-primary hover:bg-primary/5 cursor-pointer"
                onClick={() => setBattery(Math.min(100, battery + 1))}
              >
                <Plus style={{ height: 25, width: 25 }} />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="p-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-warning-50 flex items-center justify-center">
                <Thermometer className="h-5 w-5 text-warning-700" />
              </div>
              <div>
                <p className="font-medium text-foreground">Temperature</p>
                <p className="text-[16px] text-muted-foreground">Celsius</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="h-16 w-16 rounded-xl text-lg text-primary hover:bg-primary/5"
                onClick={() => setTemperature(Math.max(-20, temperature - 1))}
              >
                <Minus style={{ height: 25, width: 25 }} />
              </Button>
              <div className="text-center min-w-[80px]">
                <p className="text-[32px] font-bold text-foreground">{temperature}</p>
                <p className="text-[16px] text-muted-foreground">°C</p>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-16 w-16 rounded-xl text-lg text-primary hover:bg-primary/5"
                onClick={() => setTemperature(Math.min(80, temperature + 1))}
              >
                <Plus style={{ height: 25, width: 25 }} />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="p-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-success-50 flex items-center justify-center">
                <Activity className="h-5 w-5 text-success-700" />
              </div>
              <div>
                <p className="font-medium text-foreground">Rotor Speed</p>
                <p className="text-xs text-muted-foreground">RPM</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="h-16 w-16 rounded-xl text-lg text-primary hover:bg-primary/5"
                onClick={() => setRotorSpeed(Math.max(0, rotorSpeed - 10))}
              >
                <Minus style={{ height: 25, width: 25 }} />
              </Button>
              <div className="text-center min-w-[80px]">
                <p className="text-[32px] font-bold text-foreground">{rotorSpeed}</p>
                <p className="text-[16px] text-muted-foreground">RPM</p>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-16 w-16 rounded-xl text-lg text-primary hover:bg-primary/5"
                onClick={() => setRotorSpeed(rotorSpeed + 10)}
              >
                <Plus style={{ height: 25, width: 25 }} />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="p-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-critical-50 flex items-center justify-center">
                <Activity className="h-5 w-5 text-critical-700" />
              </div>
              <div>
                <p className="font-medium text-foreground">Vibration</p>
                <p className="text-xs text-muted-foreground">mm/s</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="h-16 w-16 rounded-xl text-lg text-primary hover:bg-primary/5"
                onClick={() => setVibration(Math.max(0, +(vibration - 0.1).toFixed(1)))}
              >
                <Minus style={{ height: 25, width: 25 }} />
              </Button>
              <div className="text-center min-w-[80px]">
                <p className="text-[32px] font-bold text-foreground">{vibration}</p>
                <p className="text-[16px] text-muted-foreground">mm/s</p>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-16 w-16 rounded-xl text-lg text-primary hover:bg-primary/5"
                onClick={() => setVibration(+(vibration + 0.1).toFixed(1))}
              >
                <Plus style={{ height: 25, width: 25 }} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick info */}
      <div className="flex items-start gap-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 px-4 py-3">
        <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-foreground">Quick Info</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your measurements help ensure safe and reliable operations. Verify values before continuing.
          </p>
        </div>
      </div>

      <StickyFooter
        onBack={() => router.push(`/inspection/draft/${params.draftId}/step-2`)}
        onNext={() => router.push(`/inspection/draft/${params.draftId}/step-4`)}
        nextLabel="Continue to Notes & Save"
        showSavedStatus
      />
    </div>
  );
}
