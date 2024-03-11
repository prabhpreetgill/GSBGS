import React from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const drawerWidth = 150;

export default function PermanentDrawerLeft() {
  let navigate = useNavigate();

  // Function to handle navigation
  const handleNavigation = (where) => () => {
    navigate(where);
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          display: "flex",
          justifyContent: "space-evenly",
          height: "100vh",
          position: "fixed",
          borderRadius: "0 20px 20px 0",
          bgcolor: "rgba(255, 255, 252, 1)",
          boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
          border: "none",
        },
        display: {xs: 'none', lg: 'contents'}
      }}
      variant="permanent"
      anchor="left"
    >
      <List>
        {[
          { name: "Home", url: "/" },
          { name: "Enroll", url: "/enroll" },
          { name: "Attendance", url: "/attendance" },
          { name: "Term", url: "/term" },
          { name: "School", url: "/school" },
        ].map((item) => (
          <ListItem
            key={item.name}
            disablePadding
            onClick={handleNavigation(item.url)}
          >
            <ListItemButton>
              <Typography
                sx={{
                  fontSize: "1.3rem",
                  padding: "20px 0",
                  fontWeight: "bold",
                }}
              >
                {item.name}
              </Typography>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
