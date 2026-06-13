import { z } from "zod";

export const measurementSchema = z.object({
  batteryPct: z.number().min(0).max(100).optional(),
  temperatureC: z.number().min(-50).max(100).optional(),
  rotorSpeedRpm: z.number().min(0).optional(),
  vibrationMmS: z.number().min(0).optional(),
  signalStrength: z.enum(["strong", "medium", "weak"]).optional(),
});

export const inspectionCreateSchema = z.object({
  workspaceId: z.string().min(1),
  installationId: z.string().min(1),
  status: z.enum(["ok", "attention", "critical", "offline"]),
  measurements: measurementSchema,
  notes: z.string().optional(),
  tags: z.array(z.string()),
  attachmentIds: z.array(z.string()),
  inspectedAt: z.string().datetime(),
});

export const draftUpdateSchema = z.object({
  installationId: z.string().optional(),
  step: z.enum(["step-1", "step-2", "step-3", "step-4"]).optional(),
  status: z.enum(["ok", "attention", "critical", "offline"]).optional(),
  measurements: measurementSchema.optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  attachmentIds: z.array(z.string()).optional(),
});

export type InspectionCreateInput = z.infer<typeof inspectionCreateSchema>;
export type DraftUpdateInput = z.infer<typeof draftUpdateSchema>;
