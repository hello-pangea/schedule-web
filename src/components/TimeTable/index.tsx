import { Stack } from "@mui/material";
import TimeColumn from "components/TimeColumn";
import { TimeContext } from "context/timeContext";
import {
  addHours,
  addMinutes,
  differenceInHours,
  differenceInMinutes,
  fromUnixTime,
  getDayOfYear,
  getHours,
  getMinutes,
  getUnixTime,
  setDayOfYear,
  startOfDay,
} from "date-fns";
import TimeInterval from "interfaces/timeInterval";
import { useEffect, useState } from "react";
import Column from "./Column";

type Props = {
  minTime: Date;
  maxTime: Date;
  days: number[];
  data: TimeInterval[];
  onChange: (data: TimeInterval[]) => unknown;
};

export default function TimeTable({
  minTime,
  maxTime,
  days,
  data,
  onChange,
}: Props) {
  const columnCount = days.length;
  const rowCount = differenceInHours(maxTime, minTime);
  console.log("Columns: " + columnCount + ", rows: " + rowCount);

  const [matrix, setMatrix] = useState(createMatrix());
  const [selectionStarted, setSelectionStarted] = useState(false);
  const [addMode, setAddMode] = useState(true);
  const [startRow, setStartRow] = useState(0);
  const [endRow, setEndRow] = useState(0);
  const [startColumn, setStartColumn] = useState(0);
  const [endColumn, setEndColumn] = useState(0);

  useEffect(() => {
    setMatrix(createMatrix());
  }, [data]);

  function createMatrix() {
    const emptyData = Array.from({ length: columnCount }, () =>
      Array.from({ length: rowCount * 2 }, () => false)
    );

    data.forEach((interval) => {
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
        emptyData[column][i] = true;
      }
    });

    return emptyData;
  }

  function encodeMatrix(data: boolean[][]): TimeInterval[] {
    const freeTime: TimeInterval[] = [];

    for (let x = 0; x < columnCount; x++) {
      let start: number | undefined;
      for (let y = 0; y < rowCount * 2; y++) {
        if (data[x][y] === true) {
          // console.log("Found true at: " + x + ", " + y);
          if (start === undefined) {
            // console.log("Start recording");
            // start = getUnixTime(addMinutes(addDays(startDate, x), y * 30));
            start = getUnixTime(
              addHours(
                addMinutes(fromUnixTime(days[x]), y * 30 + getMinutes(minTime)),
                getHours(minTime)
              )
            );
          }
        }
        if (
          (data[x][y] === false && start !== undefined) ||
          (data[x][y] === true && start !== undefined && y === rowCount * 2 - 1)
        ) {
          // console.log("End recording at: " + x + ", " + y);
          // const end = getUnixTime(addMinutes(addDays(startDate, x), y * 30));
          const end = getUnixTime(
            addHours(
              addMinutes(fromUnixTime(days[x]), y * 30 + getMinutes(minTime)),
              getHours(minTime)
            )
          );

          const interval: TimeInterval = { s: start, e: end };
          freeTime.push(interval);

          start = undefined;
        }
      }
    }

    return freeTime;
  }

  function handleTouchStart(e: any, column: number, row: number) {
    console.log("start touch: " + column + ", " + row);

    const isLeftClick = e.button === 0;
    const isTouch = e.type !== "mousedown";
    if (!selectionStarted && (isLeftClick || isTouch)) {
      e.preventDefault();

      setSelectionStarted(true);
      setStartRow(row);
      setEndRow(row);
      setStartColumn(column);
      setEndColumn(column);
      setAddMode(!matrix[column][row]);
    }
  }

  function handleTouchMove(e: any, column: number, row: number) {
    if (selectionStarted) {
      e.preventDefault();

      if (endRow !== row || endColumn !== column) {
        setEndRow(row);
        setEndColumn(column);
      }
    }
  }

  function handleTouchEnd(e: any) {
    console.log("end touch");

    const isLeftClick = e.button === 0;
    const isTouch = e.type !== "mousedown";
    if (selectionStarted && (isLeftClick || isTouch)) {
      const value = [...matrix];

      const minRow = Math.min(startRow, endRow);
      const maxRow = Math.max(startRow, endRow);
      for (let row = minRow; row <= maxRow; row++) {
        const minColumn = Math.min(startColumn, endColumn);
        const maxColumn = Math.max(startColumn, endColumn);
        for (let column = minColumn; column <= maxColumn; column++) {
          value[column][row] = addMode;
        }
      }
      setSelectionStarted(false);
      setMatrix(value);
      onChange(encodeMatrix(value));
    }
  }

  return (
    <div onMouseUp={handleTouchEnd} onTouchEnd={handleTouchEnd}>
      <TimeContext.Provider
        value={{
          values: matrix,
          selectionStarted: selectionStarted,
          startRow: startRow,
          endRow: endRow,
          startColumn: startColumn,
          endColumn: endColumn,
          startDate: startOfDay(fromUnixTime(days[0])),
          minTime: minTime,
          handleTouchStart: handleTouchStart,
          handleTouchMoved: handleTouchMove,
        }}
      >
        <Stack direction="row" alignItems="flex-start">
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
      </TimeContext.Provider>
    </div>
  );
}
