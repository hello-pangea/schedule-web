import { Stack } from "@mui/material";
import TimeColumn from "components/TimeColumn";
import { AvailabilityContext } from "context/availabilityContext";
import {
  addMinutes,
  differenceInHours,
  differenceInMinutes,
  format,
  fromUnixTime,
  getDayOfYear,
  getUnixTime,
  setDayOfYear,
  startOfDay,
} from "date-fns";
import Person from "interfaces/person";
import { useEffect, useState } from "react";
import Column from "./Column";

type Props = {
  minTime: Date;
  maxTime: Date;
  days: number[];
  people: Person[];
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onChange: (day: string, available: string[]) => void;
};

export default function AvailabilityTable({
  minTime,
  maxTime,
  days,
  people,
  onMouseEnter,
  onMouseLeave,
  onChange,
}: Props) {
  const columnCount = days.length;
  const rowCount = differenceInHours(maxTime, minTime);
  console.count("Availability Table rendered");

  const [matrix, setMatrix] = useState(createMatrix());

  useEffect(() => {
    setMatrix(createMatrix());
  }, [people]);

  function createMatrix(): string[][][] {
    console.log("Creating availability matrix");
    const emptyData: string[][][] = Array.from({ length: columnCount }, () =>
      Array.from({ length: rowCount * 2 }, () => [])
    );

    people.forEach((person) => {
      person.freeTime.forEach((interval) => {
        const column = days.indexOf(
          getUnixTime(startOfDay(fromUnixTime(interval.s)))
        );

        const firstRow =
          differenceInMinutes(
            setDayOfYear(fromUnixTime(interval.s), getDayOfYear(minTime)),
            minTime
          ) / 30;
        const lastRow =
          differenceInMinutes(
            setDayOfYear(fromUnixTime(interval.e), getDayOfYear(minTime)),
            minTime
          ) /
            30 -
          1;

        for (let i = firstRow; i <= lastRow; i++) {
          emptyData[column][i].push(person.name);
        }
      });
    });

    return emptyData;
  }

  function handleTouchMove(_e: any, column: number, row: number) {
    const day = startOfDay(fromUnixTime(days[column]));
    const firstTime = addMinutes(minTime, 30 * row);
    const time = addMinutes(minTime, 30 * (row + 1));
    onChange(
      format(day, "eeee, MMM d. ") +
        format(firstTime, "h:mm - ") +
        format(time, "h:mm aaa"),
      matrix[column][row]
    );
  }

  return (
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <AvailabilityContext.Provider
        value={{
          values: matrix,
          startDate: startOfDay(fromUnixTime(days[0])),
          minTime: minTime,
          totalPeople: people.length,
          handleTouchMoved: handleTouchMove,
        }}
      >
        <Stack direction="row" spacing={0} alignItems="flex-start">
          <TimeColumn minTime={minTime} rowCount={rowCount} />
          {[...Array(columnCount)].map((index, i) => (
            <Column
              day={startOfDay(fromUnixTime(days[i]))}
              rowCount={rowCount}
              column={i}
              key={i}
            />
          ))}
        </Stack>
      </AvailabilityContext.Provider>
    </div>
  );
}
