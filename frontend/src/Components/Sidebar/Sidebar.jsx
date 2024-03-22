import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
  Button,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import useSignOut from "react-auth-kit/hooks/useSignOut";

const drawerWidth = 150;

export default function PermanentDrawerLeft() {
  const [mobileOpen, setMobileOpen] = useState(false);
  let navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (where) => () => {
    navigate(where);
    if (isMobile) {
      setMobileOpen(false);
    }
  };
  const signOut = useSignOut();

  const signout = () => {
    signOut();
    navigate("/login");
  };

  const drawer = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column", // Stack children vertically.
        height: "100%", // Take full height to allow flex-grow to work.
        justifyContent: "center",
      }}
    >
      <List
        sx={{
          flexGrow: 1, // Allows the list to grow and take up available space.
          display: "flex",
          flexDirection: "column", // Stack list items vertically.
          justifyContent: "center", // Center list items vertically.
        }}
      >
        {[
          { name: "Home", url: "/" },
          { name: "Enroll", url: "/enroll" },
          { name: "Attendance", url: "/attendance" },
          { name: "Finance", url: "/finance" },
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
      <Box
        sx={{
          p: 2, // Add padding around the sign-out button.
          borderTop: 1, // Optional: add a top border for visual separation.
          borderColor: "divider", // Use the theme's divider color.
          display: "flex",
          justifyContent: "end",
        }}
      >
        <Button fullWidth variant="outlined" onClick={signout}>
          Sign Out
        </Button>
      </Box>
    </Box>
  );

  return (
    <div>
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ marginLeft: 1, display: { lg: "none" } }}
        >
          <MenuIcon sx={{ fontSize: 40 }} />
        </IconButton>
      )}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            display: "flex",
            justifyContent: "space-evenly",
            height: "100vh",
            position: "fixed",
            borderRadius: "0 20px 20px 0",
            bgcolor: "rgba(255, 255, 252, 1)",
            boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
            border: "none",
          },
        }}
        anchor="left"
      >
        <Box>{drawer}</Box>
      </Drawer>
    </div>
  );
}
