import { z } from "zod";

export const settingsUpdateSchema = z.object({
  themeMode: z.enum(["light", "dark"]).optional(),
  autoSync: z.boolean().optional(),
  syncOnWifiOnly: z.boolean().optional(),
  notificationsEnabled: z.boolean().optional(),
  reducedMotion: z.boolean().optional(),
});

export type SettingsUpdateInput = z.infer<typeof settingsUpdateSchema>;
