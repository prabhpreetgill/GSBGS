import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import PropTypes from 'prop-types';

// DayPicker.js
export default function DayPicker({ onChange, value }) {
  return (
    <div>
      <FormControl sx={{ m: 2, width: 300 }}>
        <InputLabel id="day-picker-label">Day</InputLabel>
        <Select
          labelId="day-picker-label"
          id="day-picker-select"
          value={value}
          onChange={onChange}
          label="Day"
          sx={{ width: 300, display: "flex" }}
        >
          <MenuItem value={"Friday"}>Friday</MenuItem>
          <MenuItem value={"Saturday"}>Saturday</MenuItem>
          <MenuItem value={"Sunday"}>Sunday</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

DayPicker.propTypes = {
  onChange: PropTypes.func.isRequired, // onChange is a function and is required
  value: PropTypes.any // value can be of any type and is optional
};