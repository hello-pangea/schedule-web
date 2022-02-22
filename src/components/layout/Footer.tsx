import { Box, Link, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box component="footer" sx={{ my: 4 }}>
      <Typography
        component="p"
        variant="subtitle2"
        color="textSecondary"
        align="center"
      >
        {"Copyright © Reece Carolan "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
      <Typography
        component="p"
        variant="subtitle2"
        color="textSecondary"
        align="center"
      >
        <Link href="/policies/privacy-policy">Privacy Policy</Link> and{" "}
        <Link href="/policies/user-agreement">User Agreement</Link>
      </Typography>
      <Typography
        component="p"
        variant="subtitle2"
        color="textSecondary"
        align="center"
      >
        <Link href="mailto:schedule@hellopangea.com">
          schedule@hellopangea.com
        </Link>
      </Typography>
    </Box>
  );
}
