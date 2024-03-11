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
    if (!option) {
      return "";
    }
    return `${option._firstName} ${option._middleName} ${option._lastName}` || "";
  };

  return (
    <Autocomplete
      disablePortal
      multiple // Enable multiple selections
      id={`combo-box-${label}`}
      options={data}
      value={value} // Make sure value is an array
      onChange={onChange} // Handle change should update an array
      getOptionLabel={getOptionLabel}
      sx={{ m: 2, width: '80%' }}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
}

Text.propTypes = {
  url: PropTypes.string,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.array // Ensure this is an array
};

