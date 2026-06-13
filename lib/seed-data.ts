/**
 * Seed data for the WayPoint Field Operations app.
 * 200+ inspections across 18 installations spanning 6 months.
 */

export type InstallationStatus = "critical" | "attention" | "ok" | "offline";
export type InspectionStatus = "critical" | "attention" | "ok";
export type SyncState = "synced" | "pending" | "failed" | "local-only";
export type SignalStrength = "strong" | "moderate" | "weak";

export interface Installation {
  id: string;
  assetId: string;
  name: string;
  type: "wind-turbine" | "weather-station" | "solar-panel" | "generator" | "pump" | "hvac" | "transformer" | "robot";
  siteName: string;
  location: string;
  status: InstallationStatus;
  batteryPct: number;
  temperatureC: number;
  signalStrength: SignalStrength;
  vibrationMmS: number;
  lastInspectedAt: string;
  tags: string[];
}

export interface Inspection {
  id: string;
  installationId: string;
  installation: string;
  assetId: string;
  location: string;
  status: InspectionStatus;
  syncState: SyncState;
  inspector: string;
  inspectorRole: string;
  date: string;
  time: string;
  notes: string;
  duration: number;
  fieldsCompleted: number;
  totalFields: number;
  batteryPct: number;
  temperatureC: number | null;
  tags: string[];
  isDraft: boolean;
}

const INSPECTORS = [
  { name: "Jordan M.", role: "Site Manager" },
  { name: "Khalid M.", role: "Field Tech" },
  { name: "Priya S.", role: "Engineer" },
  { name: "Ahmed R.", role: "Technician" },
  { name: "Alex R.", role: "Technician" },
  { name: "Taylor K.", role: "Field Tech" },
  { name: "Omar T.", role: "Site Manager" },
  { name: "System", role: "Automated" },
];

export const INSTALLATIONS_DATA: Installation[] = [
  {
    id: "inst_wt_01",
    assetId: "WT-01",
    name: "Wind Turbine 01",
    type: "wind-turbine",
    siteName: "Abu Dhabi Wind Cluster",
    location: "North Field – Zone A",
    status: "ok",
    batteryPct: 87,
    temperatureC: 28,
    signalStrength: "strong",
    vibrationMmS: 2.1,
    lastInspectedAt: "2026-06-10",
    tags: ["routine"],
  },
  {
    id: "inst_wt_03",
    assetId: "WT-03",
    name: "Wind Turbine 03",
    type: "wind-turbine",
    siteName: "Abu Dhabi Wind Cluster",
    location: "North Field – Zone A",
    status: "critical",
    batteryPct: 14,
    temperatureC: 32,
    signalStrength: "weak",
    vibrationMmS: 8.2,
    lastInspectedAt: "2026-06-12",
    tags: ["battery", "vibration"],
  },
  {
    id: "inst_wt_07",
    assetId: "WT-07",
    name: "Wind Turbine 07",
    type: "wind-turbine",
    siteName: "Abu Dhabi Wind Cluster",
    location: "South Ridge – Zone B",
    status: "ok",
    batteryPct: 72,
    temperatureC: 30,
    signalStrength: "strong",
    vibrationMmS: 3.0,
    lastInspectedAt: "2026-06-08",
    tags: ["routine"],
  },
  {
    id: "inst_wt_09",
    assetId: "WT-09",
    name: "Wind Turbine 09",
    type: "wind-turbine",
    siteName: "Abu Dhabi Wind Cluster",
    location: "South Ridge – Zone B",
    status: "attention",
    batteryPct: 45,
    temperatureC: 34,
    signalStrength: "moderate",
    vibrationMmS: 5.4,
    lastInspectedAt: "2026-06-05",
    tags: ["vibration"],
  },
  {
    id: "inst_wt_11",
    assetId: "WT-11",
    name: "Wind Turbine 11",
    type: "wind-turbine",
    siteName: "Abu Dhabi Wind Cluster",
    location: "East Corridor",
    status: "attention",
    batteryPct: 52,
    temperatureC: 36,
    signalStrength: "moderate",
    vibrationMmS: 4.8,
    lastInspectedAt: "2026-06-11",
    tags: ["temperature"],
  },
  {
    id: "inst_ws_04",
    assetId: "WS-04",
    name: "Weather Station 04",
    type: "weather-station",
    siteName: "Abu Dhabi Wind Farm",
    location: "Central Hub",
    status: "ok",
    batteryPct: 91,
    temperatureC: 27,
    signalStrength: "strong",
    vibrationMmS: 0.3,
    lastInspectedAt: "2026-06-09",
    tags: ["routine"],
  },
  {
    id: "inst_ws_11",
    assetId: "WS-11",
    name: "Weather Station 11",
    type: "weather-station",
    siteName: "Abu Dhabi Wind Farm",
    location: "Perimeter North",
    status: "critical",
    batteryPct: 22,
    temperatureC: 42,
    signalStrength: "weak",
    vibrationMmS: 1.2,
    lastInspectedAt: "2026-06-12",
    tags: ["temperature", "battery"],
  },
  {
    id: "inst_sp_02",
    assetId: "SP-02",
    name: "Solar Panel Array 02",
    type: "solar-panel",
    siteName: "Abu Dhabi Solar Park",
    location: "Section C – Row 14",
    status: "ok",
    batteryPct: 95,
    temperatureC: 38,
    signalStrength: "strong",
    vibrationMmS: 0.1,
    lastInspectedAt: "2026-06-07",
    tags: ["routine"],
  },
  {
    id: "inst_sp_05",
    assetId: "SP-05",
    name: "Solar Panel Array 05",
    type: "solar-panel",
    siteName: "Abu Dhabi Solar Park",
    location: "Section D – Row 8",
    status: "attention",
    batteryPct: 68,
    temperatureC: 44,
    signalStrength: "moderate",
    vibrationMmS: 0.2,
    lastInspectedAt: "2026-06-04",
    tags: ["temperature"],
  },
  {
    id: "inst_gen_002",
    assetId: "GEN-002",
    name: "Generator G-02",
    type: "generator",
    siteName: "North Plant",
    location: "Building 4",
    status: "critical",
    batteryPct: 8,
    temperatureC: 78,
    signalStrength: "moderate",
    vibrationMmS: 12.5,
    lastInspectedAt: "2026-06-13",
    tags: ["vibration", "temperature", "battery"],
  },
  {
    id: "inst_gen_005",
    assetId: "GEN-005",
    name: "Generator G-05",
    type: "generator",
    siteName: "North Plant",
    location: "Building 7",
    status: "ok",
    batteryPct: 82,
    temperatureC: 45,
    signalStrength: "strong",
    vibrationMmS: 3.2,
    lastInspectedAt: "2026-06-06",
    tags: ["routine"],
  },
  {
    id: "inst_pmp_017",
    assetId: "PMP-017",
    name: "Pump P-17",
    type: "pump",
    siteName: "Water Treatment",
    location: "Zone 2",
    status: "attention",
    batteryPct: 55,
    temperatureC: 52,
    signalStrength: "moderate",
    vibrationMmS: 6.8,
    lastInspectedAt: "2026-06-11",
    tags: ["vibration", "temperature"],
  },
  {
    id: "inst_pmp_003",
    assetId: "PMP-003",
    name: "Pump P-03",
    type: "pump",
    siteName: "Water Treatment",
    location: "Zone 1",
    status: "ok",
    batteryPct: 78,
    temperatureC: 35,
    signalStrength: "strong",
    vibrationMmS: 2.4,
    lastInspectedAt: "2026-06-03",
    tags: ["routine"],
  },
  {
    id: "inst_hvac_012",
    assetId: "HVAC-012",
    name: "HVAC Unit 12",
    type: "hvac",
    siteName: "Admin Building",
    location: "Roof",
    status: "attention",
    batteryPct: 60,
    temperatureC: 48,
    signalStrength: "strong",
    vibrationMmS: 4.1,
    lastInspectedAt: "2026-06-10",
    tags: ["temperature"],
  },
  {
    id: "inst_hvac_003",
    assetId: "HVAC-003",
    name: "HVAC Unit 03",
    type: "hvac",
    siteName: "Admin Building",
    location: "Floor 2",
    status: "ok",
    batteryPct: 88,
    temperatureC: 24,
    signalStrength: "strong",
    vibrationMmS: 1.5,
    lastInspectedAt: "2026-06-01",
    tags: ["routine"],
  },
  {
    id: "inst_trn_003",
    assetId: "TRN-003",
    name: "Transformer T-3",
    type: "transformer",
    siteName: "Substation A",
    location: "Yard 1",
    status: "ok",
    batteryPct: 100,
    temperatureC: 42,
    signalStrength: "strong",
    vibrationMmS: 1.8,
    lastInspectedAt: "2026-06-02",
    tags: ["routine"],
  },
  {
    id: "inst_trn_007",
    assetId: "TRN-007",
    name: "Transformer T-7",
    type: "transformer",
    siteName: "Substation B",
    location: "Yard 3",
    status: "critical",
    batteryPct: 15,
    temperatureC: 85,
    signalStrength: "weak",
    vibrationMmS: 9.3,
    lastInspectedAt: "2026-06-12",
    tags: ["temperature", "vibration"],
  },
  {
    id: "inst_rb_07",
    assetId: "RB-07",
    name: "Autonomous Robot 07",
    type: "robot",
    siteName: "Patrol Fleet",
    location: "Sector 3",
    status: "critical",
    batteryPct: 11,
    temperatureC: 65,
    signalStrength: "weak",
    vibrationMmS: 7.6,
    lastInspectedAt: "2026-06-13",
    tags: ["battery", "temperature"],
  },
];

function generateInspections(): Inspection[] {
  const inspections: Inspection[] = [];
  const statuses: InspectionStatus[] = ["critical", "attention", "ok"];
  const syncStates: SyncState[] = ["synced", "pending", "failed", "local-only"];

  const notesPool: Record<InspectionStatus, string[]> = {
    critical: [
      "Battery critically low. Immediate replacement needed.",
      "Vibration exceeds safety threshold. Shutdown recommended.",
      "Temperature spike detected. Cooling system failure suspected.",
      "Multiple sensor failures. Full diagnostic required.",
      "Structural damage observed. Urgent maintenance needed.",
      "Electrical fault detected. High risk of fire.",
      "Pressure readings dangerously high. Emergency protocol initiated.",
    ],
    attention: [
      "Minor wear on bearings. Schedule replacement within 2 weeks.",
      "Temperature elevated but within tolerance. Monitor closely.",
      "Battery below 50%. Plan replacement during next maintenance window.",
      "Vibration slightly above normal. Recheck in 48 hours.",
      "Corrosion detected on housing. Surface treatment needed.",
      "Calibration drift noted. Recalibrate within 1 week.",
      "Oil level low. Top-up scheduled.",
      "Filter replacement overdue. Performance slightly degraded.",
    ],
    ok: [
      "All readings normal. Routine check complete.",
      "No issues found. Next inspection in 30 days.",
      "Systems operating within parameters.",
      "Routine maintenance completed successfully.",
      "Visual inspection passed. All components intact.",
      "Sensor readings nominal. Equipment in good condition.",
      "Lubrication complete. Moving parts functioning well.",
      "Electrical connections secure. No corrosion observed.",
      "Performance metrics within expected range.",
      "Safety systems tested and operational.",
    ],
  };

  let id = 1;
  const startDate = new Date("2026-01-01");
  const endDate = new Date("2026-06-13");

  INSTALLATIONS_DATA.forEach((inst) => {
    const numInspections = 10 + Math.floor(Math.abs(hashCode(inst.id)) % 8);

    for (let i = 0; i < numInspections; i++) {
      const dayOffset = Math.floor(
        (hashCode(`${inst.id}-${i}`) & 0x7fffffff) %
          ((endDate.getTime() - startDate.getTime()) / 86400000)
      );
      const date = new Date(startDate.getTime() + dayOffset * 86400000);
      const dateStr = date.toISOString().split("T")[0];

      const statusIdx = Math.abs(hashCode(`${inst.id}-status-${i}`)) % 10;
      let status: InspectionStatus;
      if (statusIdx < 2) status = "critical";
      else if (statusIdx < 5) status = "attention";
      else status = "ok";

      const syncIdx = Math.abs(hashCode(`${inst.id}-sync-${i}`)) % 10;
      let syncState: SyncState;
      if (syncIdx < 6) syncState = "synced";
      else if (syncIdx < 8) syncState = "pending";
      else if (syncIdx < 9) syncState = "failed";
      else syncState = "local-only";

      const inspectorIdx = Math.abs(hashCode(`${inst.id}-insp-${i}`)) % INSPECTORS.length;
      const notesArr = notesPool[status];
      const noteIdx = Math.abs(hashCode(`${inst.id}-note-${i}`)) % notesArr.length;

      const totalFields = 12;
      const fieldsCompleted = status === "ok" ? totalFields : 6 + (Math.abs(hashCode(`${inst.id}-fields-${i}`)) % 6);
      const isDraft = fieldsCompleted < totalFields && Math.abs(hashCode(`${inst.id}-draft-${i}`)) % 5 === 0;

      const hours = 6 + (Math.abs(hashCode(`${inst.id}-hour-${i}`)) % 12);
      const minutes = Math.abs(hashCode(`${inst.id}-min-${i}`)) % 60;
      const time = `${hours}:${String(minutes).padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`;

      const tagPool = inst.tags.length > 0 ? inst.tags : ["Routine"];
      const tempValue = inst.temperatureC > 0 ? inst.temperatureC + (Math.abs(hashCode(`${inst.id}-temp-${i}`)) % 10) - 5 : null;

      inspections.push({
        id: `insp_${String(id).padStart(3, "0")}`,
        installationId: inst.id,
        installation: inst.name,
        assetId: inst.assetId,
        location: `${inst.siteName}`,
        status,
        syncState,
        inspector: INSPECTORS[inspectorIdx].name,
        inspectorRole: INSPECTORS[inspectorIdx].role,
        date: dateStr,
        time,
        notes: notesArr[noteIdx],
        duration: 15 + (Math.abs(hashCode(`${inst.id}-dur-${i}`)) % 90),
        fieldsCompleted,
        totalFields,
        batteryPct: Math.max(5, inst.batteryPct + (Math.abs(hashCode(`${inst.id}-batt-${i}`)) % 20) - 10),
        temperatureC: tempValue,
        tags: tagPool,
        isDraft,
      });

      id++;
    }
  });

  inspections.sort((a, b) => b.date.localeCompare(a.date));
  return inspections;
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash;
}

export const INSPECTIONS_DATA = generateInspections();

export function getInspectionCounts() {
  const counts = { critical: 0, attention: 0, ok: 0, total: 0, pendingSync: 0 };
  INSPECTIONS_DATA.forEach((insp) => {
    counts[insp.status]++;
    counts.total++;
    if (insp.syncState === "pending" || insp.syncState === "local-only") {
      counts.pendingSync++;
    }
  });
  return counts;
}

export function getInstallationCounts() {
  const counts = { critical: 0, attention: 0, ok: 0, offline: 0, total: 0 };
  INSTALLATIONS_DATA.forEach((inst) => {
    counts[inst.status]++;
    counts.total++;
  });
  return counts;
}

export function getCriticalAssets() {
  return INSTALLATIONS_DATA.filter(
    (inst) => inst.status === "critical"
  );
}

export function getRecentInspections(limit = 10) {
  return INSPECTIONS_DATA.slice(0, limit);
}

export function getInspectionsByStatus(status: InspectionStatus) {
  return INSPECTIONS_DATA.filter((insp) => insp.status === status);
}
