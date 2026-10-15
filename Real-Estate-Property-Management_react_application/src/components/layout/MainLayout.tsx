import type { ReactNode } from "react";
import { Box, Container } from "@mui/material";

interface MainLayoutProps {
  children: ReactNode;
  contained?: boolean;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
}

const MainLayout = ({
  children,
  contained = false,
  maxWidth = "lg",
}: MainLayoutProps) => {
  return (
    <Box
      sx={{
        width: "100%",
        flex: 1,
        boxSizing: "border-box",
      }}
    >
      {contained ? (
        <Container
          maxWidth={maxWidth}
          sx={{
            py: 4,
            boxSizing: "border-box",
          }}
        >
          {children}
        </Container>
      ) : (
        <Box
          component="section"
          sx={{
            width: "100%",
            boxSizing: "border-box",
            py: 4,
            px: {
              xs: 2,
              sm: 3,
              md: 4,
            },
          }}
        >
          {children}
        </Box>
      )}
    </Box>
  );
};

export default MainLayout;
