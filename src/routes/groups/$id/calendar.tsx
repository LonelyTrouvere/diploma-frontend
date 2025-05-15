import "./calendar.css";
import { createFileRoute } from "@tanstack/react-router";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  getYear,
  isEqual,
  startOfDay,
  startOfMonth,
  startOfWeek,
  sub,
} from "date-fns";
import { useState } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { IconButton, Paper } from "@mui/material";
import { uk } from "date-fns/locale";
import { capitalizeFirstLetter } from "@/utils/helpers/capitalize";

export const Route = createFileRoute("/groups/$id/calendar")({
  component: RouteComponent,
});

function RouteComponent() {
  const [month, setMonth] = useState<Date>(new Date());
  const firstDateOfMonth = startOfMonth(month);
  const lastDayOfMonth = endOfMonth(month);
  const nonMonthDays =
    getDay(firstDateOfMonth) === 0
      ? [...Array(6).keys()]
      : [...Array(getDay(firstDateOfMonth) - 1).keys()];
  const daysInMonth = eachDayOfInterval({
    start: firstDateOfMonth,
    end: lastDayOfMonth,
  });

  const daysOfWeek = eachDayOfInterval({
    start: startOfWeek(new Date(), { weekStartsOn: 1 }),
    end: endOfWeek(new Date(), { weekStartsOn: 1 }),
  });

  const DAYS_OF_WEEK = daysOfWeek.map((day) =>
    format(day, "EEEE", { locale: uk })
  );

  function onMonthLeft() {
    const newMonth = sub(month, { months: 1 });
    if (getYear(newMonth) === getYear(month)) {
      setMonth(newMonth);
    }
  }

  function onMonthRight() {
    const newMonth = add(month, { months: 1 });
    if (getYear(newMonth) === getYear(month)) {
      setMonth(newMonth);
    }
  }

  return (
    <div className="px-12 py-10">
      <div className="w-full flex content-center justify-center gap-2 mb-6">
        <IconButton
          onClick={onMonthLeft}
          disabled={getYear(month) !== getYear(sub(month, { months: 1 }))}
        >
          <KeyboardArrowLeftIcon />
        </IconButton>
        <span className="text-3xl font-semibold">
          {capitalizeFirstLetter(format(month, "LLLL y", { locale: uk }))}
        </span>
        <IconButton
          onClick={onMonthRight}
          disabled={getYear(month) !== getYear(add(month, { months: 1 }))}
        >
          <KeyboardArrowRightIcon />
        </IconButton>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {DAYS_OF_WEEK.map((day) => (
          <div className="text-center py-2 bg-fuchsia-100 calendar-cell rounded-md">
            <span>{capitalizeFirstLetter(day)}</span>
          </div>
        ))}
        {nonMonthDays.map(() => (
          <div></div>
        ))}
        {daysInMonth.map((date) => (
          <Paper
            className="p-2 calendar-cell rounded-md min-h-20 relative"
            id={isEqual(startOfDay(new Date()), date) ? "today" : undefined}
          >
            <span>{format(date, "d")}</span>
          </Paper>
        ))}
      </div>
    </div>
  );
}
