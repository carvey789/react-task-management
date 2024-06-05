import { CSSProperties, useState } from "react";
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import { CSS } from "@dnd-kit/utilities";
import { UniqueIdentifier } from "@dnd-kit/core";
import { AnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import {
  BsTagFill,
  BsFillCalendar2WeekFill,
  BsChevronDown,
  BsChevronRight,
  BsGrid3X2GapFill,
  BsFillPenFill,
  BsTrashFill,
} from "react-icons/bs";

import { Card } from "../types/types";
import { getCalendarDisplay } from "../utils/calendar-date-display";
import { Checkbox } from "./Checkbox";
import { InlineTaskForm } from "./InlineTaskForm";

dayjs.extend(calendar);

interface CardCompProps extends Card {
  indentationWidth: number;
  cardDepth?: number;
  clone?: boolean;
  handleCollapse?: (id: UniqueIdentifier) => void;
  handleUncollapse?: (id: UniqueIdentifier) => void;
  handleDone?: (id: UniqueIdentifier) => void;
  handleUndone?: (id: UniqueIdentifier) => void;
  handleSubmitEdit?: (id: UniqueIdentifier, updatedCard: Card) => void;
  handleClickDelete?: (card: Card) => void;
}

export const CardComp = ({
  id,
  cardTitle,
  cardDesc,
  cardDueDate,
  cardLabels,
  cardChildren,
  cardDepth,
  cardPriority,
  cardIsDone,
  cardSectionId,
  isCollapse,
  indentationWidth,
  clone,
  handleCollapse,
  handleUncollapse,
  handleDone,
  handleUndone,
  handleSubmitEdit,
  handleClickDelete,
}: CardCompProps) => {
  const isBeforeDueDate = dayjs().isBefore(cardDueDate);

  const animateLayoutChanges: AnimateLayoutChanges = ({
    isSorting,
    wasDragging,
  }) => (isSorting || wasDragging ? false : true);

  const {
    attributes,
    isDragging,
    listeners,
    setDraggableNodeRef,
    setDroppableNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
    animateLayoutChanges,
  });

  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    width: `calc(100% - ${indentationWidth * (cardDepth || 0)}px + ${
      cardChildren.length ? indentationWidth : 0
    }px)`,
  };

  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <li className="flex group w-full" style={style} ref={setDroppableNodeRef}>
      <div className={`flex w-full`} ref={setDraggableNodeRef}>
        <button
          {...listeners}
          {...attributes}
          className={`outline-none ml-1 flex justify-center mr-[2px] items-center w-6 h-6 mt-[6px] hover:bg-black/5 rounded-md cursor-move transition-opacity opacity-0 group-hover:opacity-100 ${
            isFormOpen && "opacity-0 group-hover:opacity-0 pointer-events-none"
          }`}
        >
          <BsGrid3X2GapFill className="rotate-90 h-3 text-slate-600" />
        </button>
        <button
          onClick={
            !isCollapse && handleCollapse
              ? () => handleCollapse(id)
              : isCollapse && handleUncollapse
              ? () => handleUncollapse(id)
              : undefined
          }
          className={`${
            cardChildren.length ? "flex" : "hidden pointer-events-none"
          } ${
            clone && "hidden"
          } w-6 h-6 mt-[6px] flex justify-center items-center rounded-md mr-2 hover:bg-black/5 ${
            isFormOpen && "opacity-0 pointer-events-none"
          }`}
        >
          {!transform ? (
            !isCollapse ? (
              <BsChevronDown className="h-3 text-slate-400" />
            ) : (
              <BsChevronRight className="h-3 text-slate-400" />
            )
          ) : null}
        </button>
        <div
          className={`relative flex flex-col items-end w-full ${
            isDragging &&
            "bg-slate-200/30 border-t-2 border-red-accent relative before:content-[''] before:w-3 before:h-3 before:absolute before:-top-[7px] before:left-0 before:border-2 before:bg-white before:border-red-accent before:rounded-full"
          }`}
        >
          <div
            className={`absolute z-10 top-0 right-0 flex bg-white rounded-sm backdrop-blur-sm ${
              isFormOpen && "hidden"
            }`}
          >
            <button
              className="outline-none flex justify-center mr-[2px] items-center w-6 h-6 mt-[6px] hover:bg-black/5 rounded-md cursor-pointer transition-opacity opacity-0 group-hover:opacity-100"
              type="button"
              onClick={() => setIsFormOpen(true)}
            >
              <BsFillPenFill className="h-3 text-slate-600" />
            </button>
            <button
              className="outline-none flex justify-center mr-[2px] items-center w-6 h-6 mt-[6px] hover:bg-black/5 rounded-md cursor-pointer transition-opacity opacity-0 group-hover:opacity-100"
              type="button"
              onClick={
                handleClickDelete
                  ? () =>
                      handleClickDelete({
                        id,
                        cardTitle,
                        cardDesc,
                        cardChildren,
                        cardSectionId,
                        cardIsDone,
                        isCollapse,
                      })
                  : undefined
              }
            >
              <BsTrashFill className="h-3 text-slate-600" />
            </button>
          </div>
          <div
            className={`flex items-start py-2 border-b border-black/10 w-full ${
              transform && "bg-transparent rounded-md p-4 py-4"
            } ${
              clone &&
              "bg-transparent p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
            } ${isFormOpen && "flex-col"}`}
          >
            <div className={`${isFormOpen ? "block w-full" : "hidden"}`}>
              <InlineTaskForm
                card={{
                  id,
                  cardTitle,
                  cardDesc,
                  cardDueDate,
                  cardLabels,
                  cardChildren,
                  cardPriority,
                  cardIsDone,
                  isCollapse,
                  cardSectionId,
                }}
                isEditMode={true}
                isEditFormOpen={isFormOpen}
                setIsEditFormOpen={setIsFormOpen}
                handleSubmitEdit={handleSubmitEdit}
              />
            </div>
            <Checkbox
              isDragging={isDragging}
              priority={cardPriority || 4}
              handleDone={handleDone ? () => handleDone(id) : undefined}
              cardIsDone={cardIsDone}
              handleUndone={handleUndone ? () => handleUndone(id) : undefined}
              isFormOpen={isFormOpen}
            />
            <div
              className={`flex flex-col cursor-pointer pl-2 ${
                isDragging && "opacity-0"
              } ${isFormOpen && "hidden"}`}
            >
              <div className="flex flex-col mb-1 relative">
                <h1
                  className={`text-sm transition-colors ${
                    cardIsDone
                      ? "line-through text-black/50"
                      : "text-black/80</div>"
                  }`}
                >
                  {cardTitle}
                </h1>
                {cardDesc && (
                  <p className="text-xs text-black/60">{cardDesc}</p>
                )}
              </div>
              <div className="flex gap-2 text-xs text-black/50">
                {cardDueDate &&
                  (isBeforeDueDate ? (
                    <span
                      className={`${
                        cardIsDone ? "text-slate-400" : "text-green-600"
                      } flex items-center gap-[2px] text-green-600`}
                    >
                      <BsFillCalendar2WeekFill />{" "}
                      {getCalendarDisplay(cardDueDate)}
                    </span>
                  ) : (
                    <span
                      className={`${
                        cardIsDone ? "text-slate-400" : "text-red-600"
                      } flex items-center gap-[2px] `}
                    >
                      <BsFillCalendar2WeekFill />{" "}
                      {getCalendarDisplay(cardDueDate)}
                    </span>
                  ))}
                {cardLabels &&
                  cardLabels.map((label) => (
                    <span
                      key={label.labelId}
                      className="flex items-center gap-[2px]"
                    >
                      <BsTagFill className="h-4" /> {label.labelTitle}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
