import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";

export default function BasicTextFields({ label, onChange, value }) {
  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1 },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        id={`input-${label}`}
        variant="standard"
        label={label}
        fullWidth
        onChange={onChange}
        value={value}
        sx={{ border: "none", fontWeight: "bold" }}
        InputProps={{
          style: {
            color: "black",
            fontWeight: "bold",
          },
        }}
      />
    </Box>
  );
}

// Define prop types
BasicTextFields.propTypes = {
  label: PropTypes.string, // label is a string
  onChange: PropTypes.func.isRequired, // onChange is a required function
  value: PropTypes.string, // value is a string
};
