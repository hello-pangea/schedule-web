import { Stack, Typography } from "@mui/material";
import { addDays, format, startOfWeek } from "date-fns";
import React from "react";
import Cell from "./Cell";

type Props = {
  rowCount: number;
  column: number;
};

export default function Column({ rowCount, column }: Props): JSX.Element {
  return (
    // <Grid item xs>
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="center"
      spacing={1}
      // divider={
      //   <Box
      //     sx={{
      //       backgroundColor: "#82b1ff",
      //       height: 2,
      //       width: "100%",
      //     }}
      //   />
      // }
    >
      <Typography variant="h3" textAlign="center">
        {format(addDays(startOfWeek(new Date()), column), "eee")}
      </Typography>
      {[...Array(rowCount)].map((index, i) => (
        // <Paper elevation={0} key={i} sx={{ borderRadius: 3 }}>
        <Cell column={column} row={i} key={i} />
        // </Paper>
      ))}
    </Stack>
    // </Grid>
  );
}
