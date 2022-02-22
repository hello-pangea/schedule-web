import { Box, Paper, Tooltip } from "@mui/material";
import { useAvailabilityContext } from "context/availabilityContext";
import { addMinutes, format } from "date-fns";
import { useEffect, useState } from "react";

type Props = {
  column: number;
  row: number;
};

export default function Cell({ column, row }: Props) {
  const availabilityContext = useAvailabilityContext();
  const [availability, setAvailability] = useState(0);

  useEffect(() => {
    setAvailability(availabilityContext.values[column][row].length);
  }, [availabilityContext.values[column][row]]);

  let color = "#cfd8dc";

  if (availabilityContext.totalPeople > 0) {
    if (availability === availabilityContext.totalPeople) {
      color = "#4caf50";
    } else if (availability >= availabilityContext.totalPeople * 0.5) {
      color = "#a5d6a7";
    }
  }

  return (
    <div
      onMouseEnter={(e) => availabilityContext.handleTouchMoved(e, column, row)}
    >
      <Tooltip
        title={
          format(addMinutes(availabilityContext.minTime, 30 * row), "h:mm") +
          " - " +
          format(
            addMinutes(availabilityContext.minTime, 30 * (row + 1)),
            "h:mm aaa"
          )
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
