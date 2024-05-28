import "react-day-picker/dist/style.css";
import { useState } from "react";
import dayjs from "dayjs";
import { BsFillCalendar2WeekFill } from "react-icons/bs";
import { DayPicker, SelectSingleEventHandler } from "react-day-picker";

import "./styles/datetime-picker.css";
import { TimePicker } from "./TimePicker";
import { getCalendarDisplay } from "../utils/calendar-date-display";

export const DatetimePicker = ({
  selectedDate,
  setSelectedDate,
}: {
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
}) => {
  const [isDatetimePickerOpen, setIsDatetimePickerOpen] = useState(false);
  const [timeValue, setTimeValue] = useState("23:59");

  const handleSelectDate: SelectSingleEventHandler = (date) => {
    if (date) {
      if (timeValue) {
        const [hour, minute] = (timeValue as string).split(":");
        const newDate = dayjs(date)
          .set("hour", Number(hour))
          .set("minute", Number(minute))
          .toDate();
        setSelectedDate(newDate);
      } else {
        setSelectedDate(dayjs(date).endOf("day").toDate());
      }
      setIsDatetimePickerOpen(false);
    }
  };

  return (
    <>
      <div
        className={`${
          isDatetimePickerOpen ? "block" : "hidden"
        } absolute top-0 left-0 w-screen h-screen bg-transparent z-10`}
        onClick={() => setIsDatetimePickerOpen(false)}
      />
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsDatetimePickerOpen(true)}
          className="hover:bg-slate-100 flex items-center gap-1 text-sm text-black/60 p-1 border border-gray-900/20 rounded self-start"
        >
          <span className="flex items-center gap-1">
            <BsFillCalendar2WeekFill />{" "}
            {selectedDate ? getCalendarDisplay(selectedDate) : "Due Date"}
          </span>
        </button>
        <div
          className={`${
            isDatetimePickerOpen ? "block" : "hidden"
          } absolute top-full shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded z-50`}
        >
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleSelectDate}
            footer={
              <TimePicker
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                timeValue={timeValue}
                setTimeValue={setTimeValue}
              />
            }
          />
        </div>
      </div>
    </>
  );
};
