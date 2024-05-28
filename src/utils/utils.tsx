import { arrayMove } from "@dnd-kit/sortable";
import { Card, FlattenedCard } from "../types/types";
import { UniqueIdentifier } from "@dnd-kit/core";

const getDragDepth = (offset: number, indentationWidth: number) => {
  return Math.round(offset / indentationWidth);
};

const getMaxDepth = ({ previousCard }: { previousCard: FlattenedCard }) => {
  if (previousCard) {
    return previousCard.cardDepth + 1;
  }

  return 0;
};

const getMinDepth = ({ nextCard }: { nextCard: FlattenedCard }) => {
  if (nextCard) {
    return nextCard.cardDepth;
  }

  return 0;
};

export const flatten = (
  cards: Card[],
  cardSectionId: string,
  cardParentId?: UniqueIdentifier,
  cardDepth = 0
): FlattenedCard[] => {
  return cards.reduce<FlattenedCard[]>((acc, card, index) => {
    return [
      ...acc,
      { ...card, cardSectionId, cardParentId, cardDepth, cardIndex: index },
      ...flatten(card.cardChildren, card.cardSectionId, card.id, cardDepth + 1),
    ];
  }, []);
};

export const flattenTree = (
  card: Card[],
  cardSectionId: string
): FlattenedCard[] => {
  return flatten(card, cardSectionId, "");
};

export const findCardDeep = (
  cards: Card[],
  targetCardId: UniqueIdentifier
): Card | undefined => {
  for (const card of cards) {
    const { id, cardChildren } = card;

    if (targetCardId === id) {
      return card;
    }

    if (cardChildren.length) {
      const child = findCardDeep(cardChildren, targetCardId);

      if (child) {
        return child;
      }
    }
  }

  return undefined;
};

export const removeCard = (
  cards: Card[],
  targetCardId: UniqueIdentifier
): Card[] => {
  const newCards = [];

  for (const card of cards) {
    if (card.id === targetCardId) continue;

    if (card.cardChildren.length) {
      card.cardChildren = removeCard(card.cardChildren, targetCardId);
    }

    newCards.push(card);
  }

  return newCards;
};

export const removeChildrenOf = (
  cards: FlattenedCard[],
  cardIds: UniqueIdentifier[]
): FlattenedCard[] => {
  const excludeParentIds = [...cardIds];

  return cards.filter((card) => {
    if (card.cardParentId && excludeParentIds.includes(card.cardParentId)) {
      if (card.cardChildren.length) {
        excludeParentIds.push(card.id);
      }
      return false;
    }

    return true;
  });
};

export const getProjection = (
  cards: FlattenedCard[],
  activeId: UniqueIdentifier,
  overId: UniqueIdentifier,
  dragOffset: number,
  indentationWidth: number
) => {
  const overCardIndex = cards.findIndex(({ id }) => id === overId);
  const activeCardIndex = cards.findIndex(({ id }) => id === activeId);
  const activeCard = cards[activeCardIndex];
  const newCards = arrayMove(cards, activeCardIndex, overCardIndex);
  const previousCard = newCards[overCardIndex - 1];
  const nextCard = newCards[overCardIndex + 1];
  const dragDepth = getDragDepth(dragOffset, indentationWidth);
  const projectedDepth = activeCard.cardDepth + dragDepth;
  const maxDepth = getMaxDepth({
    previousCard,
  });
  const minDepth = getMinDepth({ nextCard });
  let depth = projectedDepth;

  if (projectedDepth >= maxDepth) {
    depth = maxDepth;
  } else if (projectedDepth < minDepth) {
    depth = minDepth;
  }

  return { depth, maxDepth, minDepth, parentId: getParentId() };

  function getParentId() {
    if (depth === 0 || !previousCard) {
      return null;
    }

    if (depth === previousCard.cardDepth) {
      return previousCard.cardParentId;
    }

    if (depth > previousCard.cardDepth) {
      return previousCard.id;
    }

    const newParent = newCards
      .slice(0, overCardIndex)
      .reverse()
      .find((card) => card.cardDepth === depth)?.cardParentId;

    return newParent ?? null;
  }
};

export const buildTree = (flattenedCard: FlattenedCard[]): FlattenedCard[] => {
  const root: { id: UniqueIdentifier; cardChildren: FlattenedCard[] } = {
    id: "root",
    cardChildren: [],
  };
  const nodes = { [root.id]: root };
  const cards = flattenedCard.map((card) => ({ ...card, cardChildren: [] }));

  for (const card of cards) {
    const { id, cardChildren } = card;
    const parentId = card.cardParentId || root.id;
    const parent = nodes[parentId] || findItem(cards, parentId);

    nodes[id] = { id, cardChildren };
    parent.cardChildren.push(card);
  }

  return root.cardChildren;
};

export function findItem(cards: Card[], itemId: UniqueIdentifier) {
  return cards.find(({ id }) => id === itemId);
}

export function removeItem(cards: Card[], id: UniqueIdentifier) {
  const newCards = [];

  for (const card of cards) {
    if (card.id === id) {
      continue;
    }

    if (card.cardChildren.length) {
      card.cardChildren = removeItem(card.cardChildren, id);
    }

    newCards.push(card);
  }

  return newCards;
}

export function setProperty<T extends keyof Card>(
  cards: Card[],
  id: UniqueIdentifier,
  property: T,
  setter: (value: Card[T]) => Card[T]
) {
  for (const card of cards) {
    if (card.id === id) {
      card[property] = setter(card[property]);
      continue;
    }

    if (card.cardChildren.length) {
      card.cardChildren = setProperty(card.cardChildren, id, property, setter);
    }
  }

  return [...cards];
}
