import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import PropTypes from "prop-types";

export default function BasicSelect({ value, onChange }) {
  return (
    <Box sx={{ width: 200, fontWeight: "bold" }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Paid?</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          label="Paid?"
          onChange={onChange}
        >
          <MenuItem value={true}>YES</MenuItem>
          <MenuItem value={false}>NO</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

// PropTypes validation
BasicSelect.propTypes = {
  value: PropTypes.any, // Since value can be of any type (string, number, etc.)
  onChange: PropTypes.func.isRequired, // onChange is a function and is required
};
