import { create } from "zustand";

import { Label, Section } from "../types/types";

type Store = {
  isModalOpen: boolean;
  isConfirmationModalOpen: boolean;
  isAddingSection: boolean;
  setModalOpen: () => void;
  setModalClose: () => void;
  setAddingSection: (isAddingSection: boolean) => void;
  setConfirmationModal: (isConfirmationModalOpen: boolean) => void;
  sections: Section[];
  labels: Label[];
  setSections: (sections: Section[]) => void;
  setLabels: (labels: Label[]) => void;
};

export const useStore = create<Store>()((set) => ({
  isModalOpen: false,
  isAddingSection: false,
  isConfirmationModalOpen: false,
  setModalOpen: () => set(() => ({ isModalOpen: true })),
  setModalClose: () => set(() => ({ isModalOpen: false })),
  setAddingSection: (isAddingSection: boolean) =>
    set(() => ({ isAddingSection: isAddingSection })),
  setConfirmationModal: (isConfirmationModalOpen: boolean) =>
    set(() => ({ isConfirmationModalOpen: isConfirmationModalOpen })),
  sections: [],
  labels: [],
  setLabels: (labels: Label[]) => set(() => ({ labels })),
  setSections: (sections: Section[]) => set(() => ({ sections })),
}));
