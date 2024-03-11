import * as React from "react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField } from "@mui/material";
import PropTypes from "prop-types";

export default function BasicDateRangePicker({
  onStartDateChange,
  onEndDateChange,
}) {
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Start Date"
        value={startDate}
        renderInput={(params) => <TextField {...params} />}
        sx={{ margin: 1 }}
        onChange={(newValue) => {
          setStartDate(newValue);
          onStartDateChange(newValue); // Pass the new value up
        }}
      />
      <DatePicker
        label="End Date"
        value={endDate}
        renderInput={(params) => <TextField {...params} />}
        sx={{ margin: 1 }}
        onChange={(newValue) => {
          setEndDate(newValue);
          onEndDateChange(newValue); // Pass the new value up
        }}
      />
    </LocalizationProvider>
  );
}

// PropTypes validation
BasicDateRangePicker.propTypes = {
  onStartDateChange: PropTypes.func.isRequired,
  onEndDateChange: PropTypes.func.isRequired,
};
