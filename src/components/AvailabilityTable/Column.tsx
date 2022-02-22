import { Box, Stack, Typography } from "@mui/material";
import { format } from "date-fns";
import React from "react";
import Cell from "./Cell";

type Props = {
  day: Date;
  rowCount: number;
  column: number;
};

export default function Column({ day, rowCount, column }: Props) {
  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="center"
      spacing={0}
    >
      <Typography variant="h4" textAlign="center">
        {format(day, "MMM d")}
      </Typography>
      <Typography variant="h3" textAlign="center">
        {format(day, "eee")}
      </Typography>
      {[...Array(rowCount)].map((index, i) => (
        // <Paper elevation={0} key={i} sx={{ borderRadius: 3 }}>
        <React.Fragment key={i}>
          <Cell column={column} row={i * 2} />
          <Box
            sx={{
              backgroundColor: (theme) => theme.palette.background.default,
              height: "1px",
              width: "100%",
            }}
          />
          <Cell column={column} row={i * 2 + 1} />
        </React.Fragment>
        // </Paper>
      ))}
    </Stack>
  );
}
