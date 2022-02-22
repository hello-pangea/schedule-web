import { Box, Stack, Typography } from "@mui/material";
import { addHours, format } from "date-fns";

type Props = {
  minTime: Date;
  rowCount: number;
};

export default function TimeColumn({ minTime, rowCount }: Props) {
  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="center"
      spacing={0}
    >
      <Typography variant="h4" sx={{ opacity: 0 }}>
        t
      </Typography>
      <Typography variant="h3" sx={{ opacity: 0 }}>
        t
      </Typography>
      {[...Array(rowCount)].map((index, i) => (
        <Box
          sx={{
            height: 55,
            width: 80,
            display: "flex",
            alignItems: "center",
          }}
          key={i}
        >
          <Typography variant="body1" textAlign="right" sx={{ width: "100%" }}>
            {format(addHours(minTime, i), "h:mm aaa")}
          </Typography>
        </Box>
      ))}
    </Stack>
    // </Grid>
  );
}
