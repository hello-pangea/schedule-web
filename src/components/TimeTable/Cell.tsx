import { Box, Paper, Tooltip } from "@mui/material";
import { useTimeContext } from "context/timeContext";
import { addMinutes, format } from "date-fns";
import { useEffect, useState } from "react";

type Props = {
  column: number;
  row: number;
};

export default function Cell({ column, row }: Props) {
  const timeContext = useTimeContext();
  const [isSelected, setIsSelected] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    setIsSelected(timeContext.values[column][row]);
  }, [timeContext.values[column][row]]);

  useEffect(() => {
    const minRow = Math.min(timeContext.startRow, timeContext.endRow);
    const maxRow = Math.max(timeContext.startRow, timeContext.endRow);
    const minColumn = Math.min(timeContext.startColumn, timeContext.endColumn);
    const maxColumn = Math.max(timeContext.startColumn, timeContext.endColumn);

    setIsHighlighted(
      timeContext.selectionStarted &&
        row >= minRow &&
        row <= maxRow &&
        column >= minColumn &&
        column <= maxColumn
    );
  }, [timeContext.endRow, timeContext.endColumn, timeContext.selectionStarted]);

  let color = "#cfd8dc";

  if (isHighlighted) {
    color = "#78909c";
  } else if (isSelected) {
    color = "#2196f3";
  }

  return (
    <div
      onMouseDown={(e) => timeContext.handleTouchStart(e, column, row)}
      onMouseEnter={(e) => timeContext.handleTouchMoved(e, column, row)}
    >
      <Tooltip
        title={
          format(addMinutes(timeContext.minTime, 30 * row), "h:mm") +
          " - " +
          format(addMinutes(timeContext.minTime, 30 * (row + 1)), "h:mm aaa")
        }
        disableInteractive
      >
        <Box
          sx={{
            px: 0.5,
            pt: row % 2 === 0 ? 0.25 : 0,
            pb: row % 2 !== 0 ? 0.25 : 0,
          }}
        >
          <Paper
            square
            elevation={0}
            sx={{
              height: 25,
              width: 38,
              backgroundColor: color,
              borderTopLeftRadius: row % 2 === 0 ? 12 : 0,
              borderTopRightRadius: row % 2 === 0 ? 12 : 0,
              borderBottomLeftRadius: row % 2 !== 0 ? 12 : 0,
              borderBottomRightRadius: row % 2 !== 0 ? 12 : 0,
            }}
          />
        </Box>
      </Tooltip>
    </div>
  );
}
