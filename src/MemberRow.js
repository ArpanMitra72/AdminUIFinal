import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { red, lightGreen } from "@mui/material/colors";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Button from "@mui/material/Button";

const MemberRow = ({
  admin,
  selectedItems,
  handleCheckbox,
  handleUpdate,
  handleDelete,
}) => {
  const [editMember, setEditMember] = React.useState(null);

  //For edit icon
  const handleEditClick = () => {
    setEditMember(admin);
  };

  //for add button
  const handleUpdateClick = () => {
    handleUpdate(editMember);
    setEditMember(null);
  };
  //for cancel button
  const handleCancelClick = () => {
    setEditMember(null);
  };

  //for delete button
  const handleDeleteClick = () => {
    handleDelete(admin.id);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditMember((prevEditMember) => ({
      ...prevEditMember,
      [name]: value,
    }));
  };

  return (
    <tr
      key={admin.id}
      className={selectedItems.includes(admin.id) ? "highlightedRows" : ""}
    >
      <td>
        <input
          type="checkbox"
          checked={selectedItems.includes(admin.id)}
          onChange={(e) => handleCheckbox(e, admin.id)}
        />
      </td>
      <td>
        {editMember && editMember.id === admin.id ? (
          <input
            type="text"
            name="name"
            value={editMember.name}
            onChange={handleInputChange}
          />
        ) : (
          admin.name
        )}
      </td>
      <td>
        {editMember && editMember.id === admin.id ? (
          <input
            type="text"
            name="email"
            value={editMember.email}
            onChange={handleInputChange}
          />
        ) : (
          admin.email
        )}
      </td>
      <td>
        {editMember && editMember.id === admin.id ? (
          <input
            type="text"
            name="role"
            value={editMember.role}
            onChange={handleInputChange}
          />
        ) : (
          admin.role
        )}
      </td>
      <td>
        {editMember && editMember.id === admin.id ? (
          <>
            <Button
              variant="contained"
              sx={{
                bgcolor: lightGreen[500],
                mr: 1,
                color: "white",
              }}
              onClick={handleUpdateClick}
            >
              Add
            </Button>
            <Button
              variant="contained"
              sx={{
                bgcolor: red[500],
                color: "white",
              }}
              onClick={handleCancelClick}
            >
              Cancel
            </Button>
          </>
        ) : (
          <div className="working-icons">
            <FontAwesomeIcon
              icon={faEdit}
              onClick={handleEditClick}
              style={{ color: "#00060f" }}
              className="setIcon"
            />
            <div className="gap" />
            <DeleteOutlineIcon
              onClick={handleDeleteClick}
              style={{ color: red[500] }}
            />
          </div>
        )}
      </td>
    </tr>
  );
};

export default MemberRow;
