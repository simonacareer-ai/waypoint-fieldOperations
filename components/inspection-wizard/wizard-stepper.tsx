"use client";

import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface WizardStepperProps {
  currentStep: number;
  steps: { label: string; description: string }[];
}

export function WizardStepper({ currentStep, steps }: WizardStepperProps) {
  return (
    <div className="flex items-center gap-2 w-full">
      {steps.map((step, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isComplete = stepNum < currentStep;

        return (
          <div key={step.label} className="flex items-center flex-1">
            <div className="flex items-center gap-3 flex-1">
              <div
                className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center shrink-0 text-sm font-semibold transition-all",
                  isComplete && "bg-success-500 text-white",
                  isActive && "bg-primary text-primary-foreground",
                  !isComplete && !isActive && "bg-secondary text-muted-foreground"
                )}
              >
                {isComplete ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  stepNum
                )}
              </div>
              <div className="hidden md:block min-w-0">
                <p
                  className={cn(
                    "text-sm font-medium truncate",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground truncate">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 flex-1 mx-2 rounded-full",
                  isComplete ? "bg-success-500" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
