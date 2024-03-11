import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";
import { Box } from "@mui/material";
import PropTypes from "prop-types";

export default function TransitionsSnackbar({ open, setOpen, alert }) {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      setOpen(false);
    }
  };

  return (
    <Box>
      <Snackbar
        open={open}
        onClose={handleClose}
        TransitionComponent={Slide}
        message={alert}
      />
    </Box>
  );
}

// Define propTypes
TransitionsSnackbar.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  alert: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.node,
  ]), // Adjust based on what alert is supposed to be
};
