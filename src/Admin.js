import React, { useEffect, useState } from "react";
import PaginationControls from "./PaginationControls";
import MemberRow from "./MemberRow";
import SearchBar from "./SearchBar";
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

  const handlePage = (event, page) => {
    setCurrentPage(page);
    setHeaderCheckboxChecked(false);
    const indexOfLastMember = page * membersPerPage;
    const indexOfFirstMember = indexOfLastMember - membersPerPage;
    const currentPageMembers = filteredList.slice(
      indexOfFirstMember,
      indexOfLastMember
    );
    const currentPageMembersId = currentPageMembers.map((member) => member.id);
    const updatedSelectedItems = selectedItems.filter((itemId) =>
      currentPageMembersId.includes(itemId)
    );
    setSelectedItems(updatedSelectedItems);
  };

  //function to handle searchbar on the page
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

  //for add button inside edit section
  const handleUpdate = (updatedMember) => {
    setMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.id === updatedMember.id ? updatedMember : member
      )
    );
    setFilteredList((prevFilteredList) =>
      prevFilteredList.map((member) =>
        member.id === updatedMember.id ? updatedMember : member
      )
    );
    setEditMember(null);
  };

  //function to handle delete icon activity
  const handleDelete = (id) => {
    setMembers((pastMembers) =>
      pastMembers.filter((member) => member.id !== id)
    );
    setFilteredList((pastFilterList) =>
      pastFilterList.filter((member) => member.id !== id)
    );
  };
  //function to handle checkbox opeartion
  const handleCheckbox = (event, id) => {
    if (event.target.checked) {
      setSelectedItems((pastSelectedItems) => [...pastSelectedItems, id]);
    } else {
      setSelectedItems((pastSelectedItems) =>
        pastSelectedItems.filter((itemId) => itemId !== id)
      );
    }
  };
  //function to handle header checkbox opeartion
  const handleHeaderCheckbox = (event) => {
    const checked = event.target.checked;
    setHeaderCheckboxChecked(checked);
    if (checked) {
      const currentPageMembers = filteredList.slice(
        indexOfFirstMember,
        indexOfLastMember
      );
      const currentPageMembersId = currentPageMembers.map(
        (member) => member.id
      );
      setSelectedItems(currentPageMembersId);
    } else {
      setSelectedItems([]);
    }
  };
  //to handle "delete selected button"
  const deleteHandle = () => {
    setMembers((prevMembers) =>
      prevMembers.filter((member) => !selectedItems.includes(member.id))
    );
    setFilteredList((prevFilteredList) =>
      prevFilteredList.filter((member) => !selectedItems.includes(member.id))
    );
    setSelectedItems([]);
    setHeaderCheckboxChecked(false);

    const newTotalPages = Math.ceil(
      (filteredList.length - selectedItems.length) / membersPerPage
    );
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
      axios
        .get(
          "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
        )
        .then((response) => {
          setMembers(response.data);
          setFilteredList(response.data);
          console.log(response.data);
          const totalPages =
            Math.ceil(response.data.length / membersPerPage) || 1;
          setTotalPages(totalPages);
        })
        .catch((error) => {
          console.log("error");
        });
    }
  }, []);

  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = filteredList.slice(
    indexOfFirstMember,
    indexOfLastMember
  );

  return (
    <div>
      <SearchBar searchResult={searchResult} handleSearch={handleSearch} />
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
          {currentMembers.map((admin) => (
            <MemberRow
              key={admin.id}
              admin={admin}
              selectedItems={selectedItems}
              handleCheckbox={handleCheckbox}
              handleUpdate={handleUpdate}
              handleDelete={handleDelete}
            />
          ))}
        </tbody>
      </table>
      <PaginationControls
        totalPages={totalPages}
        currentPage={currentPage}
        handlePage={handlePage}
        deleteHandle={deleteHandle}
        selectedItems={selectedItems}
      />
    </div>
  );
}
export default Admin;
