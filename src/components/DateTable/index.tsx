import { Stack, Typography } from "@mui/material";
import { DateContext } from "context/dateContext";
import {
  addDays,
  format,
  getDay,
  getUnixTime,
  getWeeksInMonth,
  startOfDay,
  startOfMonth,
} from "date-fns";
import React, { useState } from "react";
import Column from "./Column";

type Props = {
  startDate: Date;
  onChange: (data: number[]) => unknown;
};

export default function DateTable({ startDate, onChange }: Props): JSX.Element {
  const columnCount = 7;
  const rowCount = getWeeksInMonth(startDate);

  const [matrix, setMatrix] = useState(
    Array.from({ length: columnCount }, () =>
      Array.from({ length: rowCount * 2 }, () => false)
    )
  );
  const [selectionStarted, setSelectionStarted] = useState(false);
  const [addMode, setAddMode] = useState(true);
  const [startRow, setStartRow] = useState(0);
  const [endRow, setEndRow] = useState(0);
  const [startColumn, setStartColumn] = useState(0);
  const [endColumn, setEndColumn] = useState(0);

  function encodeMatrix(data: boolean[][]): number[] {
    const freeTime: number[] = [];

    for (let x = 0; x < columnCount; x++) {
      for (let y = 0; y < rowCount * 2; y++) {
        if (data[x][y] === true) {
          const date = addDays(
            startOfMonth(startDate),
            x - getDay(startOfMonth(startDate)) + y * 7
          );

          freeTime.push(getUnixTime(startOfDay(date)));
        }
      }
    }

    return freeTime.sort((a, b) => a - b);
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
      <DateContext.Provider
        value={{
          values: matrix,
          selectionStarted: selectionStarted,
          startRow: startRow,
          endRow: endRow,
          startColumn: startColumn,
          endColumn: endColumn,
          startDate: startOfDay(startDate),
          handleTouchStart: handleTouchStart,
          handleTouchMoved: handleTouchMove,
        }}
      >
        <Typography variant="h3" textAlign="center" sx={{ mb: 1 }}>
          {format(startDate, "MMMM")}
        </Typography>
        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          alignItems="flex-start"
        >
          {[...Array(columnCount)].map((index, i) => (
            <Column rowCount={rowCount} column={i} key={i} />
          ))}
        </Stack>
      </DateContext.Provider>
    </div>
  );
}
