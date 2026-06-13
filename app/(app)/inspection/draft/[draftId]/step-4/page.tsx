"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Camera, FileText, Tag, Trash2, X, Plus, Battery, Thermometer, Wifi, Activity, Wrench, CheckCircle2, Cloud } from "lucide-react";
import { PageHeader } from "@/components/app-shell/page-header";
import { WizardStepper } from "@/components/inspection-wizard/wizard-stepper";
import { StickyFooter } from "@/components/inspection-wizard/sticky-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = () => {
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
                <span className="text-sm font-medium text-foreground">Wind Turbine 03</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2.5">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Status</span>
                </div>
                <span className="text-sm font-bold text-red-600 dark:text-red-400 uppercase">Critical</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2.5">
                  <Battery className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Battery Level</span>
                </div>
                <span className="text-sm font-bold text-red-600 dark:text-red-400">14%</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2.5">
                  <Thermometer className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Temperature</span>
                </div>
                <span className="text-sm font-bold text-orange-600 dark:text-orange-400">42°C</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2.5">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Rotor Speed</span>
                </div>
                <span className="text-sm font-bold text-foreground">1820 RPM</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2.5">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Vibration</span>
                </div>
                <span className="text-sm font-bold text-foreground">2.1 mm/s</span>
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

      {/* Save Success Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowSaveModal(false)} />
          <div className="relative bg-card border border-border rounded-2xl shadow-2xl max-w-[700px] w-[90%] p-0 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left - Success */}
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="h-16 w-16 rounded-full bg-green-600 flex items-center justify-center mb-5">
                  <CheckCircle2 className="h-9 w-9 text-white" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Inspection Saved!</h2>
                <p className="text-sm font-medium text-foreground mt-2">WT-03 Wind Turbine 03</p>
                <p className="text-xs text-muted-foreground mt-1">Your inspection has been saved locally.</p>
                <div className="flex items-center gap-3 mt-6 w-full flex-col">
                  <Button
                    variant="outline"
                    className="flex-1 h-11 text-sm font-medium cursor-pointer min-w-[220px]"
                    onClick={() => router.push(`/inspections`)}
                  >
                    View Inspection Summary
                  </Button>
                  <Button
                    className="flex-1 h-11 text-sm font-medium cursor-pointer min-w-[220px]"
                    onClick={() => router.push(`/inspection/new`)}
                  >
                    <Plus className="h-4 w-4" />
                    New Inspection
                  </Button>
                </div>
              </div>

              {/* Right - What's Next */}
              <div className="bg-muted/30 border-l border-border p-8">
                <h3 className="text-base font-bold text-foreground mb-4">What&apos;s Next?</h3>
                <ul className="space-y-4">
                  <li>
                    <p className="text-sm font-semibold text-foreground">Sync when online</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Your inspection will sync to the cloud when connection is available.</p>
                  </li>
                  <li>
                    <p className="text-sm font-semibold text-foreground">Continue inspections</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Start a new inspection or view history.</p>
                  </li>
                  <li>
                    <p className="text-sm font-semibold text-foreground">Stay safe</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Thank you for keeping our assets operating at their best.</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
