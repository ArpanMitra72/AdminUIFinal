import { Box, TextField } from "@mui/material";
import React from "react";
import "./searchBar.css";

const SearchBar = ({ searchResult, handleSearch }) => {
  return (
    <div className="search-container">
      <Box width="100%">
        <TextField
          placeholder="Search by name, email or role"
          className="search-desktop"
          fullWidth
          value={searchResult}
          onChange={(event) => handleSearch(event.target.value)}
        />
      </Box>
    </div>
  );
};
export default SearchBar;
