import * as React from "react";
import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
import PaidTable from "./PaidTable";

export default function Unpaid({ month, term }) {
  return (
    <Box sx={containerStyle}>
      <Typography sx={{ fontSize: { xs: "2rem", lg: "3rem" } }}>
        Paid
      </Typography>
      <PaidTable month={month} term={term} />
    </Box>
  );
}

const containerStyle = {
  bgcolor: "rgba(255, 255, 252, 0.95)",
  height: "65vh",
  borderRadius: "25px",
  boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  width: { xs: "80vw", lg: "30vw" },
  padding: "20px", // Added padding
};

Unpaid.propTypes = {
  month: PropTypes.string,
  term: PropTypes.string,
};
