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
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FilterListIcon from "@mui/icons-material/FilterList";
import ListIcon from "@mui/icons-material/List";
import CreateIcon from "@mui/icons-material/Create";
import AddTaskIcon from "@mui/icons-material/AddTask";
import HomeIcon from "@mui/icons-material/Home";
import HandshakeIcon from "@mui/icons-material/Handshake";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import RateReviewIcon from '@mui/icons-material/RateReview'

import { NavLink } from "react-router-dom";

const WriterSidebar = () => {
  const menuItems = [
    {
      title: "Dashboard",
      path: "/owner/dashboard",
      icon: <DashboardIcon />,
    },

    {
      title: "Create Property",
      path: "/owner/properties/create",
      icon: <CreateIcon />,
    },
    {
      title: "Property List",
      path: "/owner/properties",
      icon: <FilterListIcon />,
    },
    {
      title: "Agent List",
      path: "/admin/agents",
      icon: <ListIcon />,
    },

    {
      title: "Appointment",
      path: "/owner/appointments",
      icon: <CalendarMonthIcon />,
    },
    {
      title: "Inquiries",
      path: "/owner/inquiries",
      icon: <AddTaskIcon />,
    },

    {
      title: "Owner Rentals",
      path: "/owner/rentals",
      icon: <HomeIcon />,
    },

    {
      title: "Owner Lease",
      path: "/owner/leases",
      icon: <HandshakeIcon />,
    },

    {
      title: "Sale-Offers",
      path: "/owner/sale-offers",
      icon: <LocalOfferIcon />,
    },
    {
      title:"Sale-Transactions",
      path:"/owner/sale-transactions",
      icon:<ReceiptLongIcon/>
    },
    {
      title:"Owner Review",
      path:"/owner/reviewmanage",
      icon:<RateReviewIcon/>
    },

    {
      title: "My Profile",
      path: "/owner/profile",
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
