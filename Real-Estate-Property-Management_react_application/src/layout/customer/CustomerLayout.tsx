import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import UserNavbar from "../../components/customer/CustomerNavbar";
import UserFooter from "../../components/customer/CustomerFooter";

const UserLayout = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        overflowX: "hidden",
      }}
    >
      <UserNavbar />

      <Box
        component="main"
        sx={{
          flex: 1,
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Outlet />
      </Box>

      <UserFooter />
    </Box>
  );
};

export default UserLayout;