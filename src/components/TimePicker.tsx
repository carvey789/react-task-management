import { useEffect, useState } from "react";
import dayjs from "dayjs";

import { BsClockFill } from "react-icons/bs";

export const TimePicker = ({
  selectedDate,
  setSelectedDate,
  timeValue,
  setTimeValue,
}: {
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  timeValue: string;
  setTimeValue: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [isTimeValid, setIsTimeValid] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value;
    setTimeValue(timeValue);
    if (timeValue) {
      const isTimeValid = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/.test(timeValue);
      setIsTimeValid(isTimeValid);
    }
  };

  const handleSaveTime: React.FormEventHandler = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    if (timeValue && isTimeValid) {
      const [hour, minute] = (timeValue as string).split(":");
      const newDate = dayjs(selectedDate)
        .set("hour", Number(hour))
        .set("minute", Number(minute))
        .toDate();
      setSelectedDate(newDate);
      setIsTimePickerOpen(false);
    }
  };

  useEffect(() => {
    if (!isTimePickerOpen)
      setTimeValue(
        dayjs(selectedDate).hour() + ":" + dayjs(selectedDate).minute()
      );
  }, [isTimePickerOpen, selectedDate, setTimeValue]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsTimePickerOpen(true)}
        className="hover:bg-slate-100 w-full flex items-center gap-1 text-sm text-black/60 p-1 border border-gray-900/20 rounded"
      >
        <span className="flex w-full items-center gap-1 justify-center">
          <BsClockFill /> Time
        </span>
      </button>
      <div
        className={`${
          isTimePickerOpen ? "flex" : "hidden"
        } absolute bottom-full left-0 w-full bg-white rounded z-[55] p-3 shadow-[0_3px_10px_rgb(0,0,0,0.2)]`}
      >
        <div className="w-full">
          {!isTimeValid && (
            <p className="text-red-accent/80 text-sm text-center pb-1">
              Time is not Valid!
            </p>
          )}
          <span className="flex items-center gap-2 border-b pb-4 flex-grow w-full">
            <label htmlFor="time" className="font-bold">
              Time
            </label>
            <input
              type="text"
              name="time"
              onChange={handleInputChange}
              className="border border-gray-900/20 rounded p-1 px-2 outline-none w-full"
              value={timeValue}
              placeholder="23:59"
            />
          </span>
          <div className="pt-2 flex gap-3 justify-end items-center">
            <button
              onClick={() => setIsTimePickerOpen(false)}
              type="button"
              className="px-3 py-2 rounded-md bg-slate-100 font-semibold text-black/80 hover:bg-slate-300"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!isTimeValid}
              onClick={handleSaveTime}
              className="px-3 py-2 rounded-md bg-red-600 font-semibold text-white hover:bg-red-accent disabled:bg-red-accent/20"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
