interface CheckboxProps {
  isDragging: boolean;
  priority: number;
  cardIsDone: boolean;
  handleUndone?: () => void;
  handleDone?: () => void;
  isFormOpen: boolean;
}

export const Checkbox = ({
  isDragging,
  priority,
  cardIsDone,
  isFormOpen,
  handleDone,
  handleUndone,
}: CheckboxProps) => {
  const bgColor = [
    "bg-red-900",
    "bg-orange-900",
    "bg-blue-900",
    "bg-green-900",
    "bg-transparent",
  ];
  const borderColor = [
    "border-red-600",
    "border-orange-600",
    "border-blue-600",
    "border-green-600",
    "border-slate-300",
  ];
  const checkboxColor = ["#dc2626", "#ea580c", "#2563eb", "#16a34a", "#475569"];

  return (
    <button
      type="button"
      role="checkbox"
      className={`relative group/checkbox cursor-pointer grid place-content-center w-6 h-6 ${
        isDragging && "opacity-0"
      } ${isFormOpen && "hidden"}`}
      onClick={cardIsDone ? handleUndone : handleDone}
    >
      <span
        className={`${
          cardIsDone ? "bg-slate-900" : bgColor[priority]
        } border-slate-600 h-5 w-5 rounded-full absolute top-0 left-0 opacity-10`}
      />
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${
          cardIsDone ? "opacity-100" : "opacity-0"
        } pointer-events-none group-hover/checkbox:opacity-100 transition-opacity`}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.5056 9.00958C16.2128 8.71668 15.7379 8.71668 15.445 9.00958L10.6715 13.7831L8.72649 11.8381C8.43359 11.5452 7.95872 11.5452 7.66583 11.8381C7.37294 12.1309 7.37293 12.6058 7.66583 12.8987L10.1407 15.3736C10.297 15.5299 10.5051 15.6028 10.7097 15.5923C10.8889 15.5833 11.0655 15.5104 11.2023 15.3735L16.5056 10.0702C16.7985 9.77735 16.7985 9.30247 16.5056 9.00958Z"
          fill={`${
            cardIsDone
              ? checkboxColor[checkboxColor.length - 1]
              : checkboxColor[priority]
          }`}
        ></path>
      </svg>
      <span
        className={`border-2 ${
          cardIsDone ? "border-slate-400" : borderColor[priority]
        } opacity-80 h-5 w-5 rounded-full absolute top-0 left-0`}
      />
    </button>
  );
};
