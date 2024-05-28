import { create } from "zustand";

import { Label, Section } from "../types/types";

type Store = {
  isModalOpen: boolean;
  setModalOpen: () => void;
  setModalClose: () => void;
  sections: Section[];
  labels: Label[];
  setSections: (sections: Section[]) => void;
  setLabels: (labels: Label[]) => void;
};

export const useStore = create<Store>()((set) => ({
  isModalOpen: false,
  setModalOpen: () => set(() => ({ isModalOpen: true })),
  setModalClose: () => set(() => ({ isModalOpen: false })),
  sections: [],
  labels: [],
  setLabels: (labels: Label[]) => set(() => ({ labels })),
  setSections: (sections: Section[]) => set(() => ({ sections })),
}));
