import Dexie, { Table } from "dexie";

import { Label, Section } from "../types/types";

export class TaskManagementDexie extends Dexie {
  sections!: Table<Section>;
  labels!: Table<Label>;

  constructor() {
    super("task-management-carveych");
    this.version(1).stores({
      sections:
        "++id, sectionId, sectionTitle, sectionCards, sectionTotalAllCards, isCollapse, order",
      labels: "++id, labelId, labelTitle",
    });
  }
}

export const db = new TaskManagementDexie();
