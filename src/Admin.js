import React, { useEffect, useState } from "react";
import { Box, TextField, Pagination } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { red, lightGreen } from '@mui/material/colors';
import Button from '@mui/material/Button';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import axios from "axios";
import "./Admin.css";

function Admin() {

    const [members, setMembers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchResult, setSeachResult] = useState("");
    const [filteredList, setFilteredList] = useState([]);
    const [editMember, setEditMember] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [headerCheckboxChecked, setHeaderCheckboxChecked] = useState(false);
    const [totalPages, setTotalPages] = useState([]);
    const membersPerPage = 10;

    const handlePage = ((event, page) => {
        setCurrentPage(page);
        setHeaderCheckboxChecked(false);
        const indexOfLastMember = page * membersPerPage;
        const indexOfFirstMember = indexOfLastMember - membersPerPage;
        const currentPageMembers = filteredList.slice(indexOfFirstMember, indexOfLastMember);
        const currentPageMembersId = currentPageMembers.map((member) => member.id);
         const updatedSelectedItems = selectedItems.filter((itemId) =>
        currentPageMembersId.includes(itemId)
    );
        setSelectedItems(updatedSelectedItems);
    })

    const handleSearch = (text) => {
        setSeachResult(text);

        const selected = members.filter((admin) => {
            const { name, email, role } = admin;
            const lowerCaseText = text.toLowerCase();
            return (
                name.toLowerCase().includes(lowerCaseText) ||
                email.toLowerCase().includes(lowerCaseText) ||
                role.toLowerCase().includes(lowerCaseText)
            );
        });
        setFilteredList(selected);
        setCurrentPage(1);
        const totalPages = Math.ceil(selected.length / membersPerPage) || 1;
        localStorage.setItem("searchText", text);
        setTotalPages(totalPages);
    };

    const handleEdit = (member) => {
        setEditMember(member);
    }

    const handleUpdate = (updatedMember) => {
        setMembers((prevMembers) =>
            prevMembers.map((member) => (member.id === updatedMember.id ? updatedMember : member))
        );
        setFilteredList((prevFilteredList) =>
            prevFilteredList.map((member) => (member.id === updatedMember.id ? updatedMember : member))
        );
        setEditMember(null);
    };

    const handleCancel = () => {
        setEditMember(null);
    }

    const handleDelete = (id) => {
        setMembers((pastMembers) => pastMembers.filter((member) => member.id !== id));
        setFilteredList((pastFilterList) => pastFilterList.filter((member) => member.id !== id));
    };

    const handleCheckbox = (event, id) => {
        if (event.target.checked) {
            setSelectedItems((pastSelectedItems) => [...pastSelectedItems, id]);
        } else {
            setSelectedItems((pastSelectedItems) => pastSelectedItems.filter((itemId) => itemId !== id));
        }
        
    };

    const handleHeaderCheckbox = (event) => {
        const checked = event.target.checked;
        setHeaderCheckboxChecked(checked);
        if (checked) {
            const currentPageMembers = filteredList.slice(indexOfFirstMember, indexOfLastMember);
            const currentPageMembersId = currentPageMembers.map((member) => member.id);
            setSelectedItems(currentPageMembersId);
        } else {
            setSelectedItems([]);
        }
    };

    const deleteHandle = () => {
        setMembers((prevMembers) => prevMembers.filter((member) => !selectedItems.includes(member.id)));
        setFilteredList((prevFilteredList) => prevFilteredList.filter((member) => !selectedItems.includes(member.id)));
        setSelectedItems([]);
        setHeaderCheckboxChecked(false);

        const newTotalPages = Math.ceil((filteredList.length - selectedItems.length) / membersPerPage);
        setTotalPages(newTotalPages);
        if (currentPage > newTotalPages) {
            setCurrentPage(newTotalPages);
        }
    };

    useEffect(() => {

        const storedSearchText = localStorage.getItem("searchText");

        if (storedSearchText) {
            handleSearch(storedSearchText);
        } else {
            axios.get('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
                .then(response => {
                    setMembers(response.data);
                    setFilteredList(response.data);
                    console.log(response.data);
                    const totalPages = Math.ceil(response.data.length / membersPerPage) || 1;
                    setTotalPages(totalPages);
                })
                .catch(error => {
                    console.log("error");
                });
        }
    }, []);

    const indexOfLastMember = currentPage * membersPerPage;
    const indexOfFirstMember = indexOfLastMember - membersPerPage;
    const currentMembers = filteredList.slice(indexOfFirstMember, indexOfLastMember);

    return (
        <div>
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
            <table className="table-head">
                <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                checked={headerCheckboxChecked}
                                onChange={(e) => handleHeaderCheckbox(e)}
                            />
                        </th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentMembers.map((admin, index) =>
                        editMember && editMember.id === admin.id ? (
                            <tr key={admin.id}
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
                                    <input
                                        type="text"
                                        value={editMember.name}
                                        onChange={(e) =>
                                            setEditMember({ ...editMember, name: e.target.value })
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={editMember.email}
                                        onChange={(e) =>
                                            setEditMember({ ...editMember, email: e.target.value })
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={editMember.role}
                                        onChange={(e) =>
                                            setEditMember({ ...editMember, role: e.target.value })
                                        }
                                    />
                                </td>
                                <td>
                                    <Button variant="contained" sx={{ bgcolor: lightGreen[500], mr: 1, color: 'white' }} onClick={() => handleUpdate(editMember)}>Add</Button>
                                    <Button variant="contained" sx={{ bgcolor: red[500], color: 'white' }} onClick={handleCancel}>Cancel</Button>
                                </td>
                            </tr>
                        ) : (
                            <tr key={admin.id}
                                className={selectedItems.includes(admin.id) ? "highlightedRows" : ""}
                            >
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.includes(admin.id)}
                                        onChange={(e) => handleCheckbox(e, admin.id)}
                                    />
                                </td>
                                <td>{admin.name}</td>
                                <td>{admin.email}</td>
                                <td>{admin.role}</td>
                                <td>
                                    <div className="working-icons">
                                        <FontAwesomeIcon
                                            icon={faEdit}
                                            onClick={() => handleEdit(admin)}
                                            style={{ color: "#00060f" }}
                                            className="setIcon"
                                        />
                                        <div className="gap" />
                                        <DeleteOutlineIcon
                                            onClick={() => handleDelete(admin.id)}
                                            style={{ color: red[500] }}
                                        />
                                    </div>
                                </td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>
            <div className="pagination-controls">
                <div className="delete-button">
                    <Button variant="contained" color="error" sx={{ borderRadius: '20px' }}
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
        </div>
    );
}
export default Admin;