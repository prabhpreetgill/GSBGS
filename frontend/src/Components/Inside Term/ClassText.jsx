// ComboBox.js
import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import PropTypes from 'prop-types';


export default function ClassText({ url, label, onChange, value }) {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    fetch("https://gsbgs-backend.vercel.app/api/" + url)
      .then((response) => response.json())
      .then((fetchedData) => {
        const sortedData = fetchedData.sort((a, b) => {
          return a._name.toLowerCase().localeCompare(b._name.toLowerCase());
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
    return option._name;
  };

  return (
    <Autocomplete
      disablePortal
      id={`combo-box-${label}`}
      options={data}
      getOptionLabel= {getOptionLabel}
      value={value}
      onChange={onChange}
      sx={{ m: 2, width: 300 }}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
}

ClassText.propTypes = {
  url: PropTypes.string.isRequired, // url must be a string and is required
  label: PropTypes.string.isRequired, // label must be a string and is required
  onChange: PropTypes.func.isRequired, // onChange must be a function and is required
  value: PropTypes.any // value can be of any type and is optional
};
