"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  AlertTriangle,
  CheckCircle2,
  Cloud,
  Plus,
  Search,
  Trash2,
  RotateCcw,
  ArrowRight,
} from "lucide-react";

const COLORS = [
  { section: "Brand", tokens: [
    { name: "Navy 900", var: "--token-brand-navy-900", hex: "#0F172A" },
    { name: "Navy 800", var: "--token-brand-navy-800", hex: "#13203A" },
    { name: "Blue 600", var: "--token-brand-blue-600", hex: "#2563EB" },
    { name: "Blue 500", var: "--token-brand-blue-500", hex: "#3B82F6" },
    { name: "Green 600", var: "--token-brand-green-600", hex: "#16A34A" },
  ]},
  { section: "Surface", tokens: [
    { name: "App BG", var: "--token-surface-app", hex: "#F8FAFC" },
    { name: "Primary", var: "--token-surface-primary", hex: "#FFFFFF" },
    { name: "Secondary", var: "--token-surface-secondary", hex: "#F1F5F9" },
    { name: "Tertiary", var: "--token-surface-tertiary", hex: "#E2E8F0" },
  ]},
  { section: "Text", tokens: [
    { name: "Primary", var: "--token-text-primary", hex: "#0F172A" },
    { name: "Secondary", var: "--token-text-secondary", hex: "#475569" },
    { name: "Muted", var: "--token-text-muted", hex: "#64748B" },
    { name: "Inverse", var: "--token-text-inverse", hex: "#FFFFFF" },
  ]},
  { section: "Success", tokens: [
    { name: "50", var: "--token-success-50", hex: "#ECFDF5" },
    { name: "500", var: "--token-success-500", hex: "#22C55E" },
    { name: "700", var: "--token-success-700", hex: "#15803D" },
  ]},
  { section: "Warning", tokens: [
    { name: "50", var: "--token-warning-50", hex: "#FFFBEB" },
    { name: "500", var: "--token-warning-500", hex: "#F59E0B" },
    { name: "700", var: "--token-warning-700", hex: "#B45309" },
  ]},
  { section: "Critical", tokens: [
    { name: "50", var: "--token-critical-50", hex: "#FEF2F2" },
    { name: "500", var: "--token-critical-500", hex: "#EF4444" },
    { name: "700", var: "--token-critical-700", hex: "#B91C1C" },
  ]},
  { section: "Info", tokens: [
    { name: "50", var: "--token-info-50", hex: "#EFF6FF" },
    { name: "500", var: "--token-info-500", hex: "#3B82F6" },
    { name: "700", var: "--token-info-700", hex: "#1D4ED8" },
  ]},
];

const SPACING = [
  { token: "1", value: "4px" },
  { token: "2", value: "8px" },
  { token: "3", value: "12px" },
  { token: "4", value: "16px" },
  { token: "5", value: "20px" },
  { token: "6", value: "24px" },
  { token: "8", value: "32px" },
  { token: "10", value: "40px" },
  { token: "12", value: "48px" },
  { token: "16", value: "64px" },
];

const TYPOGRAPHY = [
  { name: "Display", size: "36px", lh: "44px", weight: "700" },
  { name: "Page Title", size: "28px", lh: "34px", weight: "700" },
  { name: "Section Title", size: "20px", lh: "28px", weight: "600" },
  { name: "Card Title", size: "18px", lh: "24px", weight: "600" },
  { name: "Body", size: "16px", lh: "24px", weight: "400" },
  { name: "Body Strong", size: "16px", lh: "24px", weight: "500" },
  { name: "Small", size: "14px", lh: "20px", weight: "400" },
  { name: "Small Strong", size: "14px", lh: "20px", weight: "500" },
  { name: "Caption", size: "12px", lh: "18px", weight: "400" },
  { name: "Metric XL", size: "32px", lh: "36px", weight: "700" },
  { name: "Metric LG", size: "24px", lh: "28px", weight: "700" },
];

const RADII = [
  { name: "xs", value: "8px" },
  { name: "sm", value: "10px" },
  { name: "md", value: "12px" },
  { name: "lg", value: "16px" },
  { name: "xl", value: "20px" },
  { name: "pill", value: "999px" },
];

export default function StyleguidePage() {
  return (
    <div className="min-h-screen bg-background p-6 md:p-10 xl:p-16 max-w-[1400px] mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-foreground">Waypoint Design System</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Documented tokens and reusable components for Waypoint Field Operations.
        </p>
      </header>

      {/* COLORS */}
      <section className="mb-16" aria-labelledby="colors-heading">
        <h2 id="colors-heading" className="text-2xl font-bold text-foreground mb-6 border-b border-border pb-3">
          Colors
        </h2>
        {COLORS.map((group) => (
          <div key={group.section} className="mb-8">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {group.section}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {group.tokens.map((token) => (
                <div key={token.var} className="flex flex-col">
                  <div
                    className="h-16 rounded-lg border border-border shadow-sm"
                    style={{ backgroundColor: `var(${token.var}, ${token.hex})` }}
                  />
                  <p className="text-xs font-medium text-foreground mt-1.5">{token.name}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">{token.hex}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">{token.var}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* SPACING */}
      <section className="mb-16" aria-labelledby="spacing-heading">
        <h2 id="spacing-heading" className="text-2xl font-bold text-foreground mb-6 border-b border-border pb-3">
          Spacing Scale
        </h2>
        <div className="space-y-2">
          {SPACING.map((s) => (
            <div key={s.token} className="flex items-center gap-4">
              <span className="text-xs font-mono text-muted-foreground w-16">space-{s.token}</span>
              <div
                className="h-4 bg-primary rounded"
                style={{ width: s.value }}
              />
              <span className="text-xs text-foreground">{s.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* TYPOGRAPHY */}
      <section className="mb-16" aria-labelledby="type-heading">
        <h2 id="type-heading" className="text-2xl font-bold text-foreground mb-6 border-b border-border pb-3">
          Typography
        </h2>
        <div className="space-y-4">
          {TYPOGRAPHY.map((t) => (
            <div key={t.name} className="flex items-baseline gap-6 border-b border-border/50 pb-3">
              <span className="w-32 shrink-0 text-xs font-mono text-muted-foreground">
                {t.size}/{t.lh} w{t.weight}
              </span>
              <p
                style={{
                  fontSize: t.size,
                  lineHeight: t.lh,
                  fontWeight: Number(t.weight),
                }}
                className="text-foreground"
              >
                {t.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* RADIUS */}
      <section className="mb-16" aria-labelledby="radius-heading">
        <h2 id="radius-heading" className="text-2xl font-bold text-foreground mb-6 border-b border-border pb-3">
          Border Radius
        </h2>
        <div className="flex flex-wrap gap-6">
          {RADII.map((r) => (
            <div key={r.name} className="flex flex-col items-center gap-2">
              <div
                className="h-16 w-16 bg-primary/20 border-2 border-primary"
                style={{ borderRadius: r.value }}
              />
              <span className="text-xs font-mono text-muted-foreground">{r.name}</span>
              <span className="text-[10px] text-muted-foreground">{r.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SHADOWS */}
      <section className="mb-16" aria-labelledby="shadows-heading">
        <h2 id="shadows-heading" className="text-2xl font-bold text-foreground mb-6 border-b border-border pb-3">
          Shadows
        </h2>
        <div className="flex flex-wrap gap-8">
          {[
            { name: "sm", shadow: "var(--token-shadow-sm, 0 1px 2px rgba(15,23,42,0.06))" },
            { name: "md", shadow: "var(--token-shadow-md, 0 4px 12px rgba(15,23,42,0.08))" },
            { name: "lg", shadow: "var(--token-shadow-lg, 0 10px 24px rgba(15,23,42,0.10))" },
          ].map((s) => (
            <div
              key={s.name}
              className="h-24 w-32 rounded-xl bg-card flex items-center justify-center border border-border"
              style={{ boxShadow: s.shadow }}
            >
              <span className="text-sm font-medium text-foreground">{s.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SIZING */}
      <section className="mb-16" aria-labelledby="sizing-heading">
        <h2 id="sizing-heading" className="text-2xl font-bold text-foreground mb-6 border-b border-border pb-3">
          Control Sizing
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="h-12 w-full bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-medium">48px Control</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Standard control height</p>
          </div>
          <div className="text-center">
            <div className="h-14 w-full bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-medium">56px CTA</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Primary CTA height</p>
          </div>
          <div className="text-center">
            <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center mx-auto">
              <Plus className="h-5 w-5 text-primary-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">40px icon button</p>
          </div>
          <div className="text-center">
            <div className="h-16 w-16 bg-primary rounded-xl flex items-center justify-center mx-auto">
              <Plus className="h-7 w-7 text-primary-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">64px wizard button</p>
          </div>
        </div>
      </section>

      {/* COMPONENT GALLERY */}
      <section className="mb-16" aria-labelledby="components-heading">
        <h2 id="components-heading" className="text-2xl font-bold text-foreground mb-6 border-b border-border pb-3">
          Components
        </h2>

        {/* Buttons */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-4">Buttons</h3>
          <div className="flex flex-wrap gap-3 items-center">
            <Button className="cursor-pointer">Primary</Button>
            <Button variant="secondary" className="cursor-pointer">Secondary</Button>
            <Button variant="ghost" className="cursor-pointer">Ghost</Button>
            <Button variant="destructive" className="cursor-pointer">Destructive</Button>
            <Button variant="outline" className="cursor-pointer">Outline</Button>
            <Button size="icon" className="cursor-pointer"><Plus className="h-4 w-4" /></Button>
            <Button size="lg" className="h-14 px-8 cursor-pointer">
              Large CTA
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Inputs */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-4">Inputs</h3>
          <div className="flex flex-wrap gap-3 items-center max-w-lg">
            <Input placeholder="Text input" className="h-12" />
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search input" className="h-12 pl-10" />
            </div>
          </div>
        </div>

        {/* Status Chips */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-4">Status Chips</h3>
          <div className="flex flex-wrap gap-3 items-center">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-success-500/30 bg-success-50 px-2.5 py-1 text-xs font-bold text-success-700">
              <CheckCircle2 className="h-3.5 w-3.5" /> OK
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-warning-500/30 bg-warning-50 px-2.5 py-1 text-xs font-bold text-warning-700">
              <AlertTriangle className="h-3.5 w-3.5" /> ATTENTION
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-critical-500/30 bg-critical-50 px-2.5 py-1 text-xs font-bold text-critical-700">
              <AlertTriangle className="h-3.5 w-3.5" /> CRITICAL
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-info-500/30 bg-info-50 px-2.5 py-1 text-xs font-bold text-info-700">
              <Cloud className="h-3.5 w-3.5" /> PENDING SYNC
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-neutral-400/30 bg-neutral-100 px-2.5 py-1 text-xs font-bold text-neutral-700">
              OFFLINE
            </span>
          </div>
        </div>

        {/* Sync Chips */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-4">Sync Pills</h3>
          <div className="flex flex-wrap gap-3 items-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-success-500/30 bg-success-50 px-3 py-1.5 text-xs font-semibold text-success-700">
              <CheckCircle2 className="h-3.5 w-3.5" /> Synced
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-info-500/30 bg-info-50 px-3 py-1.5 text-xs font-semibold text-info-700">
              <Cloud className="h-3.5 w-3.5" /> 12 Pending Sync
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-critical-500/30 bg-critical-50 px-3 py-1.5 text-xs font-semibold text-critical-700">
              <RotateCcw className="h-3.5 w-3.5" /> Retry Sync
            </span>
          </div>
        </div>

        {/* Cards */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-4">Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
            <div className="p-5 rounded-xl border border-border bg-card shadow-sm">
              <p className="font-semibold text-foreground">Standard Card</p>
              <p className="text-sm text-muted-foreground mt-1">Default surface + border</p>
            </div>
            <div className="p-5 rounded-xl border-2 border-primary/30 bg-primary/5">
              <p className="font-semibold text-primary">Accent Card</p>
              <p className="text-sm text-muted-foreground mt-1">Primary highlight card</p>
            </div>
            <div className="p-5 rounded-xl border border-critical-500/30 bg-critical-50">
              <p className="font-semibold text-critical-700">Alert Card</p>
              <p className="text-sm text-muted-foreground mt-1">Semantic status card</p>
            </div>
          </div>
        </div>

        {/* Toggle */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-4">Toggle / Switch</h3>
          <div className="flex items-center gap-3">
            <Switch defaultChecked />
            <span className="text-sm text-foreground">Active toggle</span>
          </div>
        </div>

        {/* Icon Buttons */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-4">Icon Actions</h3>
          <div className="flex gap-3 items-center">
            <Button size="icon" variant="ghost" className="h-12 w-12 cursor-pointer">
              <Search className="h-5 w-5" />
            </Button>
            <Button size="icon" variant="ghost" className="h-12 w-12 cursor-pointer">
              <Trash2 className="h-5 w-5 text-destructive" />
            </Button>
            <Button size="icon" className="h-12 w-12 cursor-pointer">
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* ACCESSIBILITY */}
      <section className="mb-16" aria-labelledby="a11y-heading">
        <h2 id="a11y-heading" className="text-2xl font-bold text-foreground mb-6 border-b border-border pb-3">
          Accessibility Notes
        </h2>
        <ul className="space-y-2 text-sm text-foreground list-disc list-inside">
          <li>Minimum touch target: <strong>48 x 48px</strong></li>
          <li>Wizard +/- buttons: <strong>64 x 64px</strong></li>
          <li>Focus rings visible on all interactive elements (keyboard navigation)</li>
          <li>Status always rendered as: icon + label + color (never color alone)</li>
          <li>High-contrast text on all surfaces (&ge; 4.5:1 AA compliant)</li>
          <li>Skip-to-content link available</li>
          <li>Semantic HTML: headings, landmarks, lists, tables</li>
          <li>ARIA labels on icon-only buttons</li>
        </ul>
      </section>
    </div>
  );
}
