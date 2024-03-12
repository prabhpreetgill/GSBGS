import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme,
  Typography,
} from "@mui/material";
 import PropTypes from "prop-types";
import StudentTable from "./StudentTable";

function Btn({ label }) {
  // Correct way to handle click event
  const [open, setOpen] = React.useState(false); // Controls the Dialog (Modal) Open/Close

  const handleClickOpen = () => {
    setOpen(true);
  };

  // Function to Close the Dialog
  const handleClose = () => {
    setOpen(false);
  };

  // Theme and Media Query for Responsive Dialog
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <div>
      <Button
        variant="outlined"
        sx={{
          padding: "10px 50px",
          width: {xs: "80vw", lg: "20vw"},
          height: {xs: "13vh",lg: "20vh"},
          display: "flex",
          justifyContent: "space-around",
          borderRadius: "30px",
          background:
            "url(https://static.vecteezy.com/system/resources/thumbnails/005/412/075/small_2x/abstract-pastel-purple-minimal-background-for-invitation-or-banner-free-vector.jpg)",
          backgroundSize: "cover",
          border: "none",
          margin: {xs: 2, lg: 10},
          transitionDuration: "0.2s",
          "&:hover": {
            boxShadow: "rgba(0, 0, 0, 0.45) 0px 5px 15px",
            transitionDuration: "0.2s",
            border: "none",
          },
        }}
        onClick={handleClickOpen}
      >
        <Typography color="black" fontWeight="bold" sx={{fontSize: {xs: '2.5rem', lg: "3rem"}}} >
          {label}
        </Typography>
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        sx={{
          "& .MuiDialog-paper": {
            width: {xs: '90vw', lg: "50%"},
            height: "80%",
            maxHeight: "100vh",
            maxWidth: "100vw",
          },
        }}
      >
        <DialogTitle
          id="responsive-dialog-title"
          sx={{ fontSize: "3rem", textAlign: "center", fontWeight: "bold" }}
        >
          All Students
        </DialogTitle>
        <DialogContent>{StudentTable("students")}</DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "left" }}>
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

// PropTypes validation
Btn.propTypes = {
  label: PropTypes.string.isRequired,
  delay: PropTypes.number,
};

export default Btn;
