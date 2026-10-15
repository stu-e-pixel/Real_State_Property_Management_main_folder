import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  Typography,
  Divider,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import AddTaskIcon from "@mui/icons-material/AddTask";
import ChecklistIcon from "@mui/icons-material/Checklist";
import FilterListIcon from "@mui/icons-material/FilterList";
import ListIcon from "@mui/icons-material/List";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import HandshakeIcon from "@mui/icons-material/Handshake";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import RateReviewIcon from "@mui/icons-material/RateReview";

import { NavLink } from "react-router-dom";

const WriterSidebar = () => {
  const menuItems = [
    {
      title: "Dashboard",
      path: "/admin/dashboard",
      icon: <DashboardIcon />,
    },

    {
      title: "User List",
      path: "/admin/users",
      icon: <ChecklistIcon />,
    },
    {
      title: "Owner List",
      path: "/admin/owners",
      icon: <FilterListIcon />,
    },
    {
      title: "Agent List",
      path: "/admin/agents",
      icon: <ListIcon />,
    },

    {
      title: "Properties",
      path: "/admin/properties",
      icon: <ListIcon />,
    },
    {
      title: "Inquiries",
      path: "/admin/inquiries",
      icon: <AddTaskIcon />,
    },
    {
      title: "All Appointment",
      path: "/admin/appointments",
      icon: <CalendarMonthIcon />,
    },
    {
      title: "Admin Lease",
      path: "/admin/AllLeases",
      icon: <HandshakeIcon />,
    },
    {
      title: "Sale-Transactions",
      path: "/admin/sale-transactions",
      icon: <ReceiptLongIcon />,
    },

    {
      title: "All Review",
      path: "/admin/allreview",
      icon: <RateReviewIcon />,
    },

    {
      title: "My Profile",
      path: "/admin/profile",
      icon: <PersonIcon />,
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#ffffff",
      }}
    >
      <Divider />
      <List
        sx={{
          px: 1.5,
          py: 2,
        }}
      >
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            sx={{
              mb: 0.8,
              borderRadius: "10px",
              color: "#4b5563",

              "& .MuiListItemIcon-root": {
                color: "#6b7280",
                minWidth: 42,
              },

              "&:hover": {
                backgroundColor: "#f3f4f6",
              },

              "&.active": {
                backgroundColor: "#eff6ff",
                color: "#2563eb",

                "& .MuiListItemIcon-root": {
                  color: "#2563eb",
                },
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              {item.title}
            </Typography>
          </ListItemButton>
        ))}
      </List>
      <Box
        sx={{
          mt: "auto",
          p: 2,
        }}
      >
        <Divider sx={{ mb: 2 }} />

        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "center",
            color: "#9ca3af",
          }}
        >
          Admin Panel
        </Typography>
      </Box>
    </Box>
  );
};

export default WriterSidebar;
