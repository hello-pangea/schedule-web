import { Box } from "@mui/material";
import Footer from "components/layout/Footer";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.background.default,
      }}
    >
      <main>{children}</main>
      <Footer />
    </Box>
  );
}
