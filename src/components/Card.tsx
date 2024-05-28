import { CSSProperties } from "react";
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import { CSS } from "@dnd-kit/utilities";
import { UniqueIdentifier } from "@dnd-kit/core";
import { Checkbox } from "@material-tailwind/react";
import { AnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import {
  BsTagFill,
  BsFillCalendar2WeekFill,
  BsChevronDown,
  BsChevronRight,
  BsGrid3X2GapFill,
} from "react-icons/bs";

import { Card } from "../types/types";
import { getCalendarDisplay } from "../utils/calendar-date-display";

dayjs.extend(calendar);

interface CardCompProps extends Card {
  indentationWidth: number;
  cardDepth?: number;
  clone?: boolean;
  handleCollapse?: (id: UniqueIdentifier) => void;
}

export const CardComp = ({
  id,
  cardTitle,
  cardDesc,
  cardDueDate,
  cardLabels,
  cardPriority,
  cardChildren,
  cardDepth,
  isCollapse,
  indentationWidth,
  clone,
  handleCollapse,
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
    width: `calc(100% - ${indentationWidth * (cardDepth || 0)}px)`,
  };

  return (
    <li className="flex group" style={style} ref={setDroppableNodeRef}>
      <div
        className={`${cardChildren.length && "-ml-6"} flex w-full`}
        ref={setDraggableNodeRef}
      >
        <button
          {...listeners}
          {...attributes}
          className={`outline-none flex justify-center mr-[2px] items-center w-6 h-6 mt-[6px] hover:bg-black/5 rounded-md cursor-move transition-opacity opacity-0 group-hover:opacity-100`}
        >
          <BsGrid3X2GapFill className="rotate-90 h-3 text-slate-600" />
        </button>
        <button
          onClick={handleCollapse ? () => handleCollapse(id) : null}
          className={`${
            cardChildren.length ? "flex" : "hidden pointer-events-none"
          } ${
            clone && "hidden"
          } w-6 h-6 mt-[6px] flex justify-center items-center rounded-md mr-1 hover:bg-black/5`}
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
          className={`flex flex-col items-end w-full ${
            isDragging &&
            "bg-slate-200/30 border-t-2 border-red-accent relative before:content-[''] before:w-3 before:h-3 before:absolute before:-top-[7px] before:left-0 before:border-2 before:bg-white before:border-red-accent before:rounded-full"
          }`}
        >
          <div
            className={`flex items-start py-2 border-b border-black/10 w-full ${
              transform && "bg-transparent rounded-md p-4 py-4"
            } ${
              clone &&
              "bg-transparent p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
            }`}
          >
            <input
              type="checkbox"
              className={`cursor-pointer mt-[2px] w-4 h-4 mr-2 rounded-full outline-none border-red-500 focus:ring-0 ${
                isDragging && "opacity-0"
              }`}
            />
            <div
              className={`flex flex-col cursor-pointer ${
                isDragging && "opacity-0"
              }`}
            >
              <div className="flex flex-col mb-1">
                <h1 className="text-sm text-black/80">{cardTitle}</h1>
                {cardDesc && (
                  <p className="text-xs text-black/60">{cardDesc}</p>
                )}
              </div>
              <div className="flex gap-2 text-xs text-black/50">
                {cardDueDate &&
                  (isBeforeDueDate ? (
                    <span className="flex items-center gap-[2px] text-green-600">
                      <BsFillCalendar2WeekFill />{" "}
                      {getCalendarDisplay(cardDueDate)}
                    </span>
                  ) : (
                    <span className="flex items-center gap-[2px] text-red-600">
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
