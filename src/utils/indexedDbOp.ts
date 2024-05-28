import { data } from "../data/initialData";
import { db } from "../db/db";
import { Card } from "../types/types";

export const initDataIndexedDb = async () => {
  const isSectionDataInitialized = await db.sections.count();
  const isLabeldataInitialized = await db.labels.count();

  if (!isSectionDataInitialized || isSectionDataInitialized < 2) {
    try {
      await db.sections.bulkAdd(data.sections);
    } catch {
      console.error("Failed to initialized section data");
    }
  }

  if (!isLabeldataInitialized || isLabeldataInitialized < 2) {
    try {
      await db.labels.bulkAdd(data.labels);
    } catch {
      console.error("Failed to initialized label data");
    }
  }
};

export const addCardToSectionDb = async (cards: Card[], id: number) => {
  const result = await db.sections.update(id, { sectionCards: cards });

  return result;
};

export const updateCardOnSectionDb = async (
  sectionId: string,
  updatedCard: Card
) => {
  const result = await db.sections.where("sectionId").equals(sectionId).first();

  const newCards = result?.sectionCards.map((card) => {
    if (card.id === updatedCard.id) {
      return { ...card, ...updatedCard };
    } else {
      return { ...card };
    }
  });

  await db.sections
    .where("sectionId")
    .equals(sectionId)
    .modify({ sectionCards: newCards });
};
