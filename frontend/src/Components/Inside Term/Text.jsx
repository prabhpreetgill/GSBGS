// ComboBox.js
import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import PropTypes from 'prop-types';

export default function Text({ url, label, onChange, value }) {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    fetch("https://gsbgs-backend.vercel.app/api/" + url)
      .then((response) => response.json())
      .then((fetchedData) => {
        const sortedData = fetchedData.sort((a, b) => {
          return a._firstName.localeCompare(b._firstName);
        });
        setData(sortedData);
      })
      .catch((error) => console.error("Error:", error));
  }, [url]);

  const getOptionLabel = (option) => {
    // Handle nullish and empty values
    if (!option) {
      return "";
    }
    // Assuming 'name' is the property to display
    return `${option._firstName} ${option._middleName} ${option._lastName}`;
  };

  return (
    <Autocomplete
      disablePortal
      id={`combo-box-${label}`}
      options={data}
      value={value}
      onChange={onChange}
      getOptionLabel={getOptionLabel}
      sx={{ m: 2, width: 300 }}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
}

Text.propTypes = {
  url: PropTypes.string, // url must be a string (optional)
  label: PropTypes.string.isRequired, // label must be a string and is required
  onChange: PropTypes.func.isRequired, // onChange must be a function and is required
  value: PropTypes.any // value can be of any type and is optional
};