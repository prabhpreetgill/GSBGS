import * as React from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import PropTypes from "prop-types";

export default function BasicSelect({ value, onChange }) {
  return (
    <Box sx={{ width: 200, fontWeight: "bold" }}>
      <FormControl fullWidth>
        <Select
          id="demo-simple-select"
          value={value}
          onChange={onChange}
        >
          <MenuItem value={"Monthly"}>Monthly</MenuItem>
          <MenuItem value={"Annual"}>Annual</MenuItem>
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
