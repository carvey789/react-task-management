import { MouseEvent, useState } from "react";
import { BsFillFlagFill } from "react-icons/bs";
import { Priority } from "../types/types";

interface PriorityPickerProps {
  selectedPriority: number | null;
  setSelectedPriority: React.Dispatch<React.SetStateAction<number | null>>;
}

export const PriorityPicker = ({
  selectedPriority,
  setSelectedPriority,
}: PriorityPickerProps) => {
  const color = [
    "text-red-600",
    "text-orange-600",
    "text-blue-600",
    "text-green-600",
    "text-slate-600",
  ];
  const priorities: {
    value: keyof typeof Priority;
    label: string;
  }[] = [
    { value: "VeryHigh", label: "Very High" },
    { value: "High", label: "High" },
    { value: "Medium", label: "Medium" },
    { value: "Low", label: "Low" },
    { value: "VeryLow", label: "Very Low" },
  ];

  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const taskPriority =
    selectedPriority || selectedPriority === 0
      ? priorities[selectedPriority]
      : null;

  const handleSelectPriority = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const id = e.currentTarget.id;

    const value = Priority[id as keyof typeof Priority];
    setSelectedPriority(value);
    setIsPriorityOpen(false);
  };

  return (
    <>
      <div
        className={`${
          isPriorityOpen ? "block" : "hidden"
        } absolute top-0 left-0 w-screen h-screen bg-transparent z-10`}
        onClick={() => setIsPriorityOpen(false)}
      />
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsPriorityOpen(true)}
          className="hover:bg-slate-100 flex items-center gap-1 text-sm text-black/60 p-1 border border-gray-900/20 rounded self-start"
        >
          <span className="flex items-center gap-1">
            <BsFillFlagFill
              className={`${
                taskPriority && color[Priority[taskPriority.value]]
              }`}
            />{" "}
            {taskPriority ? taskPriority.label : "Priority"}
          </span>
        </button>
        <div
          className={`${
            isPriorityOpen ? "block" : "hidden"
          } absolute top-full shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded z-[49] bg-white`}
        >
          {priorities.map((priority) => (
            <button
              className="flex gap-2 whitespace-nowrap items-center text-sm text-black/80 p-2 hover:bg-slate-100 w-full"
              id={priority.value}
              key={priority.value}
              value={priority.value}
              onClick={handleSelectPriority}
            >
              <BsFillFlagFill
                className={`${color[Priority[priority.value]]}`}
              />{" "}
              <span className="flex-[0_0_0]">{priority.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
