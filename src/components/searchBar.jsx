import { InputAdornment, TextField } from "@mui/material";
import React from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

function SearchBar({ handleQueryValue, placeholder }) {
  const handleQuery = (e) => {
    handleQueryValue(e.target.value);
  };
  return (
    <TextField
      sx={{
        width:"400px",
        "& input::placeholder": {
          color: "#667085",
          opacity: "1",
          fontWeight: "400",
        },
        "& .MuiInputBase-input": {
          borderWidth: `1px !important`,
          position: "relative",
          fontSize: 16,
          padding: "10px 14px 10px 0px",

          color: "#000000",
        },
        "& fieldset": {
          borderWidth: `1px !important`,
          padding: "0px !important",
          borderColor: "#D0D5DD !important",
          borderRadius: "10px!important",
        },
      }}
      placeholder={placeholder}
      variant="outlined"
      onChange={(event) => handleQuery(event)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchOutlinedIcon sx={{ color: "#667085" }} />
          </InputAdornment>
        ),
      }}
    />
  );
}

export default SearchBar;
