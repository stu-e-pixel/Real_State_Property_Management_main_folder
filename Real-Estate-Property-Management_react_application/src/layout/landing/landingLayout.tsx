import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";

const LandingLayout = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        bgcolor: "#ffffff",
      }}
    >
      <LandingNavbar />

      <Box component="main" sx={{ flex: 1, width: "100%" }}>
        <Outlet />
      </Box>

      <LandingFooter />
    </Box>
  );
};

export default LandingLayout;