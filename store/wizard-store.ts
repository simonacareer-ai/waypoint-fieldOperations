import { create } from "zustand";
import type { WizardStep, InspectionStatus, MeasurementSet } from "@/types";

interface WizardState {
  draftId: string | null;
  currentStep: WizardStep;
  installationId: string | null;
  status: InspectionStatus | null;
  measurements: MeasurementSet;
  notes: string;
  tags: string[];
  attachmentIds: string[];
  setDraftId: (id: string | null) => void;
  setCurrentStep: (step: WizardStep) => void;
  setInstallationId: (id: string | null) => void;
  setStatus: (status: InspectionStatus | null) => void;
  setMeasurements: (measurements: MeasurementSet) => void;
  setNotes: (notes: string) => void;
  setTags: (tags: string[]) => void;
  setAttachmentIds: (ids: string[]) => void;
  reset: () => void;
}

const initialState = {
  draftId: null,
  currentStep: "step-1" as WizardStep,
  installationId: null,
  status: null,
  measurements: {},
  notes: "",
  tags: [],
  attachmentIds: [],
};

export const useWizardStore = create<WizardState>((set) => ({
  ...initialState,
  setDraftId: (id) => set({ draftId: id }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setInstallationId: (id) => set({ installationId: id }),
  setStatus: (status) => set({ status }),
  setMeasurements: (measurements) => set({ measurements }),
  setNotes: (notes) => set({ notes }),
  setTags: (tags) => set({ tags }),
  setAttachmentIds: (ids) => set({ attachmentIds: ids }),
  reset: () => set(initialState),
}));
