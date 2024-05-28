import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";

dayjs.extend(calendar);

export const getCalendarDisplay = (date: Date) => {
  return dayjs(date).calendar(null, {
    sameDay: "[Today at] HH:mm",
    nextDay: "[Tomorrow at] HH:mm",
    lastDay: "[Yesterday at] HH:mm",
    lastWeek: "[Last] dddd [at] HH:mm",
    sameElse: "DD-MM-YYYY [at] HH:mm",
  });
};
