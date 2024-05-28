import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

import { DatetimePicker } from "./DatetimePicker";
import { useStore } from "../stores/stores";
import { Card } from "../types/types";

export const InlineTaskForm = ({
  sectionId,
  addCardToSection,
}: {
  id?: number;
  sectionId: string;
  sectionCards: Card[];
  addCardToSection: (card: Card) => void;
}) => {
  const { isModalOpen, setModalOpen, setModalClose } = useStore(
    (state) => state
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [textAreaValue, setTextAreaValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    dayjs(new Date()).endOf("day").toDate()
  );

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target?.value;

    setTextAreaValue(val);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const card: Card = {
      id: uuidv4(),
      cardTitle: inputValue,
      cardDesc: textAreaValue,
      cardIsDone: false,
      cardDueDate: selectedDate,
      cardChildren: [],
      cardParentId: "",
      cardSectionId: sectionId,
      isCollapse: false,
    };

    addCardToSection(card);

    setIsFormOpen(false);
    setModalClose();
  };

  useEffect(() => {
    if (textAreaRef && textAreaRef.current) {
      textAreaRef.current.style.height = "0px";
      const scrollHeight = textAreaRef.current.scrollHeight;

      textAreaRef.current.style.height = scrollHeight + "px";
    }
  }, [textAreaRef, textAreaValue, isFormOpen]);

  useEffect(() => {
    if (!isFormOpen) {
      setInputValue("");
      setTextAreaValue("");
      setSelectedDate(dayjs(new Date()).endOf("day").toDate());
      setModalClose();
    } else {
      setModalOpen();
    }
  }, [isFormOpen, setModalClose, setModalOpen]);

  return (
    <div className="ml-7 mt-2 py-2">
      <form className={`${isFormOpen ? "block" : "hidden"} `} action="">
        <div className="w-full flex flex-col p-3 border border-gray-500/20 rounded-lg text-sm">
          <input
            name="taskTitle"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Text name"
            className="outline-none text-black/80 font-bold placeholder:text-black/40"
          />
          <textarea
            name="textDesc"
            placeholder="Description"
            className="outline-none resize-none my-1 text-sm text-black/80 h-5"
            rows={1}
            value={textAreaValue}
            ref={textAreaRef}
            onChange={handleTextAreaChange}
          />
          <div className="my-2">
            <DatetimePicker
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </div>
          <div className="border-t  pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-3 py-2 rounded-md bg-slate-100 font-semibold text-black/80 hover:bg-slate-300"
            >
              Cancel
            </button>
            <button
              disabled={!inputValue}
              onClick={handleSubmit}
              className="px-3 py-2 rounded-md bg-red-600 font-semibold text-white hover:bg-red-accent disabled:bg-red-accent/20"
            >
              Add task
            </button>
          </div>
        </div>
      </form>
      <button
        onClick={() => setIsFormOpen(true)}
        className={`${
          isModalOpen
            ? "opacity-0 cursor-not-allowed"
            : "opacity-100 cursor-pointer"
        } flex transition-opacity items-center gap-3 text-sm text-black/60 hover:text-red-accent before:content-['+'] before:h-5 before:w-5 before:flex before:justify-center before:items-center before:rounded-full hover:before:text-white hover:before:bg-red-accent`}
      >
        Add task
      </button>
    </div>
  );
};
