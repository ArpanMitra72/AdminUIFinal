import React from "react";
import { Button } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import "./paginationControls.css";

const PaginationControls = ({
  totalPages,
  currentPage,
  handlePage,
  deleteHandle,
  selectedItems,
}) => {
  return (
    <div className="pagination-controls">
      <div className="delete-button">
        <Button
          variant="contained"
          color="error"
          sx={{ borderRadius: "20px" }}
          onClick={selectedItems.length > 0 ? deleteHandle : null}
        >
          Delete Selected
        </Button>
      </div>
      <div className="pagination-numbers">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePage}
          showFirstButton
          showLastButton
        />
      </div>
    </div>
  );
};
export default PaginationControls;
