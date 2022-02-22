import { Paper, Typography } from "@mui/material";
import { useDateContext } from "context/dateContext";
import {
  addDays,
  format,
  getDay,
  isSameDay,
  isSameMonth,
  startOfMonth,
} from "date-fns";
import { useEffect, useState } from "react";

type Props = {
  column: number;
  row: number;
};

export default function Cell({ column, row }: Props): JSX.Element {
  const dateContext = useDateContext();
  const [isSelected, setIsSelected] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const date = addDays(
    startOfMonth(dateContext.startDate),
    column - getDay(startOfMonth(dateContext.startDate)) + row * 7
  );

  useEffect(() => {
    setIsSelected(dateContext.values[column][row]);
  }, [dateContext.values[column][row]]);

  useEffect(() => {
    const minRow = Math.min(dateContext.startRow, dateContext.endRow);
    const maxRow = Math.max(dateContext.startRow, dateContext.endRow);
    const minColumn = Math.min(dateContext.startColumn, dateContext.endColumn);
    const maxColumn = Math.max(dateContext.startColumn, dateContext.endColumn);

    setIsHighlighted(
      dateContext.selectionStarted &&
        row >= minRow &&
        row <= maxRow &&
        column >= minColumn &&
        column <= maxColumn
    );
  }, [dateContext.endRow, dateContext.endColumn, dateContext.selectionStarted]);

  let color = "#cfd8dc";

  if (!isSameMonth(date, dateContext.startDate)) {
    color = "#eceff1";
  }

  if (isSameDay(date, dateContext.startDate)) {
    color = "#bbdefb";
  }

  if (isHighlighted) {
    color = "#78909c";
  } else if (isSelected) {
    color = "#2196f3";
  }

  return (
    // <Grid item>
    <div
      onMouseDown={(e) => dateContext.handleTouchStart(e, column, row)}
      onMouseMove={(e) => dateContext.handleTouchMoved(e, column, row)}
    >
      <Paper
        elevation={0}
        sx={{
          height: 35,
          width: 35,
          backgroundColor: color,
          borderRadius: 3,
          display: "flex",
          alignItems: "center",
          // justifyContent: "flex",
        }}
      >
        <Typography variant="body1" textAlign="center" sx={{ width: "100%" }}>
          {format(date, "d")}
        </Typography>
      </Paper>
    </div>
    // </Grid>
  );
}
