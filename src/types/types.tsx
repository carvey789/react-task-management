import { UniqueIdentifier } from "@dnd-kit/core";
import { MutableRefObject } from "react";

enum Priority {
  VeryHigh,
  High,
  Medium,
  Low,
  VeryLow,
}

export interface Section {
  id: number;
  sectionId: string;
  sectionTitle: string;
  sectionCards: Card[];
  sectionTotalAllCards: number;
  isCollapse: boolean;
}

export type Label = {
  id?: number;
  labelId: string;
  labelTitle: string;
};

export interface Card {
  id: UniqueIdentifier;
  cardTitle: string;
  cardDesc?: string;
  cardDueDate?: Date;
  cardPriority?: Priority;
  cardSectionId: string;
  cardParentId?: UniqueIdentifier;
  cardIsDone: boolean;
  cardLabels?: Label[];
  cardChildren: Card[];
  isCollapse: boolean;
}

export interface FlattenedCard extends Card {
  cardDepth: number;
  cardIndex: number;
}

export type SensorContext = MutableRefObject<{
  cards: FlattenedCard[];
  offset: number;
}>;
