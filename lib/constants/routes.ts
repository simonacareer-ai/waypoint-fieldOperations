export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
  WORKSPACE: "/workspace",
  SETUP_DEVICE: "/setup-device",
  WELCOME: "/welcome",
  DASHBOARD: "/dashboard",
  INSPECTIONS: "/inspections",
  HISTORY: "/history",
  INSTALLATIONS: "/installations",
  INSTALLATION_DETAIL: (id: string) => `/installations/${id}`,
  INSPECTION_NEW: "/inspection/new",
  INSPECTION_DRAFT: (draftId: string, step: number) =>
    `/inspection/draft/${draftId}/step-${step}`,
  INSPECTION_SUCCESS: (id: string) => `/inspection/success/${id}`,
  OFFLINE_SYNC: "/offline-sync",
  SETTINGS: "/settings",
  PROFILE: "/profile",
} as const;

export const NAV_ITEMS = [
  { label: "Dashboard", href: ROUTES.DASHBOARD, icon: "LayoutDashboard" },
  { label: "Inspections", href: ROUTES.INSPECTIONS, icon: "ClipboardList" },
  { label: "History", href: ROUTES.HISTORY, icon: "History" },
  { label: "Installations", href: ROUTES.INSTALLATIONS, icon: "MapPin" },
  { label: "Offline & Sync", href: ROUTES.OFFLINE_SYNC, icon: "Cloud" },
  { label: "Settings", href: ROUTES.SETTINGS, icon: "Settings" },
  { label: "Profile", href: ROUTES.PROFILE, icon: "User" },
] as const;
