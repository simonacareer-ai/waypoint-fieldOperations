"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Camera, FileText, Tag, Trash2, X, Plus, Battery, Thermometer, Wifi, Activity, Wrench, CheckCircle2, CloudUpload } from "lucide-react";
import { PageHeader } from "@/components/app-shell/page-header";
import { WizardStepper } from "@/components/inspection-wizard/wizard-stepper";
import { StickyFooter } from "@/components/inspection-wizard/sticky-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { addInspection, useInstallations } from "@/hooks/use-dexie-data";

const STEPS = [
  { label: "Installation", description: "Select asset" },
  { label: "Status", description: "Set condition" },
  { label: "Measurements", description: "Record data" },
  { label: "Notes & Save", description: "Review" },
];

const AVAILABLE_TAGS = ["battery", "temperature", "signal", "vibration", "maintenance-check"];

const TAG_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  battery: Battery,
  temperature: Thermometer,
  signal: Wifi,
  vibration: Activity,
  "maintenance-check": Wrench,
};

export default function Step4Page() {
  const params = useParams();
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(AVAILABLE_TAGS);
  const [photos, setPhotos] = useState<string[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const { installations } = useInstallations();

  const [wizardInstallationId, setWizardInstallationId] = useState("");
  const [wizardStatus, setWizardStatus] = useState("ok");
  const [wizardBattery, setWizardBattery] = useState(72);
  const [wizardTemperature, setWizardTemperature] = useState(28);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const draftId = params.draftId as string;
    const instId = sessionStorage.getItem(`wizard-${draftId}-step1`) || sessionStorage.getItem("wizard_selectedInstallation") || "";
    const status = sessionStorage.getItem(`wizard-${draftId}-step2`) || sessionStorage.getItem("wizard_selectedStatus") || "ok";
    const battery = sessionStorage.getItem(`wizard-${draftId}-battery`);
    const temp = sessionStorage.getItem(`wizard-${draftId}-temperature`);
    setWizardInstallationId(instId);
    setWizardStatus(status);
    if (battery) setWizardBattery(Number(battery));
    if (temp) setWizardTemperature(Number(temp));
  }, [params.draftId]);

  const selectedInstallation = installations.find((i) => i.id === wizardInstallationId);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = async () => {
    await addInspection({
      installationId: wizardInstallationId,
      status: wizardStatus,
      measurements: { batteryPct: wizardBattery, temperatureC: wizardTemperature },
      notes,
      tags: selectedTags,
    });

    setShowSaveModal(true);
  };

  return (
    <div className="space-y-6 max-w-[900px] pb-24">
      <WizardStepper currentStep={4} steps={STEPS} />

      <PageHeader
        title="Notes & Review"
        description="Add notes, tags, and photos, then save your inspection."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add inspection notes..."
                className="w-full h-32 rounded-lg border border-border bg-card p-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Tag className="h-5 w-5 text-muted-foreground" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => {
                  const TagIcon = TAG_ICONS[tag];
                  return (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full text-[12px] font-medium border border-border bg-card text-foreground h-[48px] cursor-pointer"
                    >
                      {TagIcon && <TagIcon className="h-3.5 w-3.5 text-muted-foreground" />}
                      {tag}
                      <button
                        onClick={() => toggleTag(tag)}
                        className="hover:text-red-500 transition-colors cursor-pointer flex items-center justify-center ml-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  );
                })}
                <button
                  onClick={() => {
                    const remaining = AVAILABLE_TAGS.filter((t) => !selectedTags.includes(t));
                    if (remaining.length > 0) toggleTag(remaining[0]);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 h-14 rounded-full text-sm font-medium border border-primary text-primary cursor-pointer hover:bg-primary/5 transition-colors h-[48px]"
                >
                  <Plus className="h-4 w-4" />
                  Add Tag
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Camera className="h-5 w-5 text-muted-foreground" />
                Photos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {photos.map((photo, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg bg-secondary border border-border overflow-hidden group"
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Camera className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <button
                      onClick={() => setPhotos(photos.filter((_, i) => i !== index))}
                      className="absolute top-1 right-1 h-6 w-6 rounded-full bg-critical-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full h-12 h-[48px]"
                onClick={() => setPhotos([...photos, `photo_${photos.length + 1}`])}
              >
                <Camera className="h-4 w-4 mr-2" />
                Add Photo
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                Review Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0 divide-y divide-border mt-[-15px]">
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2.5">
                  <Plus className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Installation</span>
                </div>
                <span className="text-sm font-medium text-foreground">{selectedInstallation?.name || "—"}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2.5">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Status</span>
                </div>
                <span className={`text-sm font-bold uppercase ${
                  wizardStatus === "critical" ? "text-red-600 dark:text-red-400"
                    : wizardStatus === "warning" ? "text-yellow-600 dark:text-yellow-400"
                    : "text-green-600 dark:text-green-400"
                }`}>{wizardStatus}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2.5">
                  <Battery className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Battery Level</span>
                </div>
                <span className={`text-sm font-bold ${wizardBattery < 30 ? "text-red-600 dark:text-red-400" : "text-foreground"}`}>{wizardBattery}%</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2.5">
                  <Thermometer className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Temperature</span>
                </div>
                <span className={`text-sm font-bold ${wizardTemperature > 35 ? "text-orange-600 dark:text-orange-400" : "text-foreground"}`}>{wizardTemperature}°C</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2.5">
                  <Wifi className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Signal Strength</span>
                </div>
                <span className="text-sm font-bold text-orange-600 dark:text-orange-400">Weak</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <StickyFooter
        onBack={() => router.push(`/inspection/draft/${params.draftId}/step-3`)}
        showNext={false}
        showSave
        showSavedStatus
        onSave={handleSave}
      />

      {/* Save Success Popup */}
      {showSaveModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowSaveModal(false)} />
          <div className="relative bg-card border border-border rounded-2xl shadow-2xl max-w-[640px] w-[92%] max-h-[90vh] overflow-y-auto">
            <div className="flex flex-col items-center text-center p-6 md:p-8">
              {/* Green checkmark */}
              <div className="h-18 w-18 rounded-full bg-green-600 flex items-center justify-center mb-4 shadow-lg shadow-green-600/20">
                <CheckCircle2 className="h-10 w-10 text-white" />
              </div>

              <h2 className="text-xl font-bold text-foreground">Inspection Saved!</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedInstallation?.name || "Installation"} — {wizardStatus.charAt(0).toUpperCase() + wizardStatus.slice(1)} status recorded
              </p>

              {/* Summary Card */}
              <div className="w-full mt-5 bg-muted/30 border border-border rounded-xl overflow-hidden text-left">
                <div className="grid grid-cols-[1fr_auto] items-center px-4 py-3 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Activity className="h-4.5 w-4.5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{selectedInstallation?.name || "Unknown Installation"}</p>
                      <p className="text-xs text-muted-foreground">{selectedInstallation?.location || "—"}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                    wizardStatus === "critical"
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      : wizardStatus === "warning"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  }`}>
                    {wizardStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 border-b border-border">
                  <div className="px-4 py-2.5 border-r border-border">
                    <p className="text-xs text-muted-foreground">Battery</p>
                    <p className={`text-sm font-bold ${wizardBattery < 30 ? "text-red-600 dark:text-red-400" : "text-foreground"}`}>{wizardBattery}%</p>
                  </div>
                  <div className="px-4 py-2.5">
                    <p className="text-xs text-muted-foreground">Temperature</p>
                    <p className={`text-sm font-bold ${wizardTemperature > 35 ? "text-orange-600 dark:text-orange-400" : "text-foreground"}`}>{wizardTemperature}°C</p>
                  </div>
                </div>

                <div className="px-4 py-2.5 border-b border-border flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-muted-foreground mr-0.5">Tags</span>
                  {selectedTags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-full text-xs font-medium border border-border bg-card text-foreground capitalize">
                      {tag.replace("-", " ")}
                    </span>
                  ))}
                  {selectedTags.length > 3 && (
                    <span className="text-xs text-muted-foreground">+{selectedTags.length - 3}</span>
                  )}
                </div>

                {notes && (
                  <div className="px-4 py-2.5 border-b border-border">
                    <p className="text-xs text-muted-foreground line-clamp-1">{notes}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 px-4 py-2.5">
                  <p className="text-xs text-muted-foreground">Inspector: <span className="text-sm text-foreground font-medium">Simona D.</span></p>
                  <p className="text-xs text-muted-foreground text-right">Timestamp: <span className="text-sm text-foreground font-medium">Today at {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span></p>
                </div>
              </div>

              {/* Saved Locally - green with sync progress */}
              <div className="w-full mt-5 space-y-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">Saved Locally</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <CloudUpload className="h-6 w-6 animate-pulse text-primary" />
                  <span className="text-sm">Syncing to cloud...</span>
                  <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full w-2/3 bg-primary rounded-full animate-[pulse_2s_ease-in-out_infinite]" />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 mt-6 w-full">
                <Button
                  className="h-[48px] px-5 text-sm font-semibold cursor-pointer"
                  onClick={() => router.push(`/inspection/new`)}
                >
                  <Plus className="h-4 w-4" />
                  Start Another Inspection
                </Button>
                <Button
                  variant="outline"
                  className="h-[48px] px-5 text-sm font-semibold cursor-pointer"
                  onClick={() => router.push(`/history`)}
                >
                  View in History
                </Button>
                <Button
                  variant="ghost"
                  className="h-[48px] px-5 text-sm font-semibold cursor-pointer"
                  onClick={() => router.push(`/dashboard`)}
                >
                  Back to Dashboard
                </Button>
              </div>

              {/* Confirmation text */}
              <p className="mt-4 text-md text-green-600 dark:text-green-400">
                Draft cleared. Your inspection is safely stored.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
