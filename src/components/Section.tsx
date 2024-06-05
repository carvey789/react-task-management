import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BsChevronDown, BsChevronRight, BsTrashFill } from "react-icons/bs";
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
  editCardsById,
  flattenTree,
  getProjection,
  getTotalCard,
  removeCard,
  removeChildrenOf,
  setProperty,
} from "../utils/utils";

import { dropAnimationConfig } from "../configs/dnd-config";
import { db } from "../db/db";
import { InlineSectionForm } from "./InlineSectionForm";
import { useStore } from "../stores/stores";

export const SectionComp = ({ section }: { section: Section }) => {
  const { sections, setSections } = useStore();
  const { id, sectionId, sectionTitle, sectionCards, isCollapse } = section;
  const indentationWidth = 28;
  const [isSectionOpen, setIsSectionOpen] = useState(!isCollapse);
  const [cards, setCards] = useState(sectionCards);
  const [activeCardId, setActiveCardId] = useState<UniqueIdentifier | null>(
    null
  );
  const [overCardId, setOverCardId] = useState<UniqueIdentifier | null>(null);
  const [offsetLeft, setOffsetLeft] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [tobeDeletedCard, setTobeDeletedCard] = useState<Card | undefined>(
    undefined
  );
  const [tobeDeletedSection, setTobeDeletedSection] = useState<
    number | undefined
  >(undefined);

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

  const handleCollapse = (id: UniqueIdentifier) => {
    setCards((cards) =>
      setProperty(cards, id, "isCollapse", () => {
        return true;
      })
    );
  };

  const handleUncollapse = (id: UniqueIdentifier) => {
    setCards((cards) =>
      setProperty(cards, id, "isCollapse", () => {
        return false;
      })
    );
  };

  const handleDone = (id: UniqueIdentifier) => {
    setCards((cards) =>
      setProperty(cards, id, "cardIsDone", () => {
        return true;
      })
    );
  };

  const handleUndone = (id: UniqueIdentifier) => {
    setCards((cards) =>
      setProperty(cards, id, "cardIsDone", () => {
        return false;
      })
    );
  };

  const handleSubmitEdit = (id: UniqueIdentifier, updatedCard: Card) => {
    setCards((cards) => {
      const cardCopy = [...cards];
      editCardsById(cardCopy, id, updatedCard);
      return cardCopy;
    });
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setTobeDeletedCard(undefined);
    setTobeDeletedSection(undefined);
  };

  const handleClickDeleteCard = (card: Card) => {
    setIsDeleteModalOpen(true);
    setTobeDeletedCard(card);
  };

  const handleClickDeleteSection = () => {
    setIsDeleteModalOpen(true);
    setTobeDeletedSection(id);
  };

  const handleRemoveCard = () => {
    if (tobeDeletedCard) {
      setCards((cards) => removeCard(cards, tobeDeletedCard.id));
      setIsDeleteModalOpen(false);
    }
  };

  const handleRemoveSection = async () => {
    if (tobeDeletedSection || tobeDeletedSection === 0) {
      await db.sections.delete(tobeDeletedSection);
      setSections(
        sections.filter((section) => section.id != tobeDeletedSection)
      );
    }
  };

  useEffect(() => {
    sensorContext.current = {
      cards: flattenedItems,
      offset: offsetLeft,
    };
  }, [flattenedItems, offsetLeft]);

  useEffect(() => {
    const updateDbSection = async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await db.sections.update(id as number, { sectionCards: cards });
    };

    updateDbSection();
  }, [cards, id]);

  return (
    <>
      <div>
        <span className="relative flex group">
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
              {getTotalCard(cards, sectionId)}
            </span>
          </span>
          <div className="absolute z-10 top-0 right-0 flex bg-white rounded-sm backdrop-blur-sm">
            <button
              className="outline-none flex justify-center mr-[2px] items-center mt-[6px] rounded-md cursor-pointer transition-opacity opacity-0 group-hover:opacity-100"
              type="button"
              onClick={handleClickDeleteSection}
            >
              <BsTrashFill className="h-3 text-slate-600 hover:text-slate-900" />
            </button>
          </div>
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
                  handleUncollapse={handleUncollapse}
                  handleDone={handleDone}
                  handleUndone={handleUndone}
                  handleSubmitEdit={handleSubmitEdit}
                  handleClickDelete={handleClickDeleteCard}
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
        sectionId={sectionId}
        addCardToSection={addCardToSection}
        isEditMode={false}
      />
      <InlineSectionForm sectionId={sectionId} />
      <div
        onClick={handleCancelDelete}
        className={`${
          isDeleteModalOpen ? "flex" : "hidden"
        } absolute top-0 left-0 z-[100] w-screen h-screen overflow-hidden bg-slate-300/30`}
      ></div>
      <div
        className={`absolute z-[120] top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
          isDeleteModalOpen ? "flex" : "hidden"
        }  bg-white rounded-md p-4 flex-col items-end`}
      >
        <p className="text-sm">
          Are you sure want to delete{" "}
          <span className="font-bold">
            {tobeDeletedSection || tobeDeletedSection === 0
              ? sectionTitle
              : tobeDeletedCard
              ? tobeDeletedCard.cardTitle
              : "this"}{" "}
          </span>
          ?
        </p>
        <div className="mt-4 flex flex-row-reverse text-sm gap-2">
          <button
            className="px-2 py-1 rounded-md bg-red-600 font-semibold text-white hover:bg-red-accent disabled:bg-red-accent/20"
            type="button"
            onClick={
              tobeDeletedCard
                ? handleRemoveCard
                : tobeDeletedSection || tobeDeletedSection === 0
                ? handleRemoveSection
                : undefined
            }
          >
            Delete{" "}
            {tobeDeletedSection ? "section" : tobeDeletedCard ? "task" : ""}
          </button>
          <button
            type="button"
            onClick={handleCancelDelete}
            className="px-2 py-1 rounded-md bg-transparent font-semibold text-black/80 hover:bg-slate-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};
