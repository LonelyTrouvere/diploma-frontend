import "./calendar.css";
import { createFileRoute } from "@tanstack/react-router";
import {
  add,
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  getYear,
  isAfter,
  isBefore,
  isEqual,
  startOfDay,
  startOfMonth,
  startOfWeek,
  sub,
} from "date-fns";
import { useEffect, useState } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { IconButton, Paper } from "@mui/material";
import { uk } from "date-fns/locale";
import { capitalizeFirstLetter } from "@/utils/helpers/capitalize";
import type { Event } from "@/api/events/entity";
import { getEvents } from "@/api/events/get";

export const Route = createFileRoute("/groups/$id/calendar")({
  component: RouteComponent,
});

const colorStyles = {
  meeting: "oklch(80.9% 0.105 251.813)",
  deadline: "#7bf1a8",
};

function RouteComponent() {
  const [events, setEvents] = useState<Event[]>([]);
  const [month, setMonth] = useState<Date>(new Date());

  useEffect(() => {
    getEvents({
      after: startOfMonth(month).toISOString(),
      before: endOfMonth(month).toISOString(),
    }).then((data) => {
      if (data.success) {
        setEvents(data.data);
      }
    });
  }, [month]);

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

  const recuringEvents: Event[] = [];
  for (const ev of events) {
    if (ev.recurring) {
      let recuringDateStart = new Date(ev.date);
      while (isBefore(recuringDateStart, lastDayOfMonth)) {
        recuringDateStart = add(recuringDateStart, { days: ev.recurringRule });
        if (isAfter(recuringDateStart, firstDateOfMonth) && isBefore(recuringDateStart, lastDayOfMonth)) {
          recuringEvents.push({
            ...ev,
            date: recuringDateStart.toISOString(),
          });
        }
      }
    }
  }

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
            <div className="mb-2">
              <span>{format(date, "d")}</span>
            </div>
            <div className="flex flex-col gap-1">
              {events.map((event) => {
                if (
                  isAfter(new Date(event.date), date) &&
                  isBefore(new Date(event.date), endOfDay(date))
                ) {
                  return (
                    <span
                      className="text-xs px-2 py-1 rounded-3xl"
                      style={{ backgroundColor: colorStyles[event.type] }}
                    >
                      {event.description}
                    </span>
                  );
                } else {
                  return <></>;
                }
              })}
              {recuringEvents.map((event) => {
                if (
                  isAfter(new Date(event.date), date) &&
                  isBefore(new Date(event.date), endOfDay(date))
                ) {
                  return (
                    <span
                      className="text-xs px-2 py-1 rounded-3xl"
                      style={{ backgroundColor: colorStyles[event.type] }}
                    >
                      {event.description}
                    </span>
                  );
                } else {
                  return <></>;
                }
              })}
            </div>
          </Paper>
        ))}
      </div>
    </div>
  );
}
