import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BsChevronDown, BsChevronRight } from "react-icons/bs";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  UniqueIdentifier,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { CardComp } from "./Card";
import { InlineTaskForm } from "./InlineTaskForm";
import { sortableTreeKeyboardCoordinates } from "../utils/keyboardCoordinates";
import { Card, FlattenedCard, Section, SensorContext } from "../types/types";
import {
  buildTree,
  flattenTree,
  getProjection,
  removeChildrenOf,
  removeItem,
  setProperty,
} from "../utils/utils";

import { dropAnimationConfig } from "../configs/dnd-config";
import { db } from "../db/db";

export const SectionComp = ({ section }: { section: Section }) => {
  const {
    id,
    sectionId,
    sectionTitle,
    sectionCards,
    sectionTotalAllCards,
    isCollapse,
  } = section;
  const indentationWidth = 28;
  const [isSectionOpen, setIsSectionOpen] = useState(!isCollapse);
  const [cards, setCards] = useState(sectionCards);
  const [activeCardId, setActiveCardId] = useState<UniqueIdentifier | null>(
    null
  );
  const [overCardId, setOverCardId] = useState<UniqueIdentifier | null>(null);
  const [offsetLeft, setOffsetLeft] = useState(0);

  const addCardToSection = (card: Card) => {
    const newCards = [...cards, card];
    setCards(newCards);
  };

  const flattenedItems = useMemo(() => {
    const flattenedTree = flattenTree(cards, sectionId);
    const collapsedItems = flattenedTree.reduce<UniqueIdentifier[]>(
      (acc, { cardChildren, isCollapse, id }) =>
        isCollapse && cardChildren.length ? [...acc, id] : acc,
      []
    );

    return removeChildrenOf(
      flattenedTree,
      activeCardId ? [activeCardId, ...collapsedItems] : collapsedItems
    );
  }, [activeCardId, cards, sectionId]);

  const projected =
    activeCardId && overCardId
      ? getProjection(
          flattenedItems,
          activeCardId,
          overCardId,
          offsetLeft,
          indentationWidth
        )
      : null;

  const sensorContext: SensorContext = useRef({
    cards: flattenedItems,
    offset: offsetLeft,
  });

  const [coordinateGetter] = useState(() =>
    sortableTreeKeyboardCoordinates(sensorContext, false, indentationWidth)
  );
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter,
    })
  );

  const sortedIds = useMemo(
    () => flattenedItems.map(({ id }) => id),
    [flattenedItems]
  );

  const activeCard = activeCardId
    ? flattenedItems.find(({ id }) => id === activeCardId)
    : null;

  const measuring = {
    droppable: {
      strategy: MeasuringStrategy.Always,
    },
  };

  const handleDragStart = ({
    active: { id: activeCardId },
  }: DragStartEvent) => {
    setActiveCardId(activeCardId);
    setOverCardId(activeCardId);

    document.body.style.setProperty("cursor", "grabbing");
  };

  const handleDragMove = ({ delta }: DragMoveEvent) => {
    setOffsetLeft(delta.x);
  };

  const handleDragOver = ({ over }: DragOverEvent) => {
    setOverCardId(over?.id ?? null);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    resetState();

    if (projected && over) {
      const { depth, parentId } = projected;
      const clonedCards: FlattenedCard[] = JSON.parse(
        JSON.stringify(flattenTree(cards, sectionId))
      );
      const overIndex = clonedCards.findIndex(({ id }) => id === over.id);
      const activeIndex = clonedCards.findIndex(({ id }) => id === active.id);
      const activeTreeItem = clonedCards[activeIndex];

      clonedCards[activeIndex] = {
        ...activeTreeItem,
        cardDepth: depth,
        cardParentId: parentId ?? undefined,
      };

      const sortedCards = arrayMove(clonedCards, activeIndex, overIndex);
      const newCards = buildTree(sortedCards);

      setCards(newCards);
    }
  };

  const handleDragCancel = () => {
    resetState();
  };

  const resetState = () => {
    setOverCardId(null);
    setActiveCardId(null);
    setOffsetLeft(0);

    document.body.style.setProperty("cursor", "");
  };

  const handleRemove = (id: UniqueIdentifier) => {
    setCards((items) => removeItem(items, id));
  };

  const handleCollapse = (id: UniqueIdentifier) => {
    setCards((cards) =>
      setProperty(cards, id, "isCollapse", (value) => {
        return !value;
      })
    );
  };

  useEffect(() => {
    sensorContext.current = {
      cards: flattenedItems,
      offset: offsetLeft,
    };
  }, [flattenedItems, offsetLeft]);

  useEffect(() => {
    const updateDbSection = async () => {
      await db.sections.update(id, { sectionCards: cards });
    };

    updateDbSection();
  }, [cards, id]);

  return (
    <>
      <div>
        <span className="flex">
          <button
            onClick={() => setIsSectionOpen((isSectionOpen) => !isSectionOpen)}
            className="w-6 h-6 flex justify-center items-center rounded-md mr-1 hover:bg-black/5"
          >
            {isSectionOpen ? (
              <BsChevronDown className="h-3 text-slate-400" />
            ) : (
              <BsChevronRight className="h-3 text-slate-400" />
            )}
          </button>
          <span className="flex items-center text-sm w-full font-bold border-b border-black/10 pb-2">
            {sectionTitle}{" "}
            <span className="font-light text-xs ml-1">
              {sectionTotalAllCards}
            </span>
          </span>
        </span>
      </div>
      <div className={`${isSectionOpen ? "block" : "hidden"}`}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          measuring={measuring}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext
            items={sortedIds}
            strategy={verticalListSortingStrategy}
          >
            {flattenedItems.map((card) => (
              <div className="flex flex-col items-end">
                <CardComp
                  {...card}
                  key={card.id}
                  indentationWidth={indentationWidth}
                  handleCollapse={handleCollapse}
                  cardDepth={
                    card.id === activeCardId ? projected?.depth : card.cardDepth
                  }
                />
              </div>
            ))}
            {createPortal(
              <DragOverlay
                dropAnimation={dropAnimationConfig}
                modifiers={undefined}
              >
                {activeCardId && activeCard ? (
                  <CardComp
                    indentationWidth={indentationWidth}
                    {...activeCard}
                    clone
                  />
                ) : null}
              </DragOverlay>,
              document.body
            )}
          </SortableContext>
        </DndContext>
      </div>
      <InlineTaskForm
        id={id}
        sectionId={sectionId}
        sectionCards={cards}
        addCardToSection={addCardToSection}
      />
      <button className="w-full py-2 flex items-center opacity-0 transition-all text-sm font-bold border-none text-red-accent hover:opacity-100 before:mr-[10px] before:bg-red-accent before:content-[''] before:block before:h-[1px] before:opacity-50 before:flex-auto after:ml-[10px] after:bg-red-accent after:content-[''] after:block after:h-[1px] after:opacity-50 after:flex-auto">
        Add Section
      </button>
    </>
  );
};
