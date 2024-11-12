import { useState } from "react";
import Select from "react-select";
import "./GroupForm.css";

import { useNavigate } from "react-router-dom";
import { useFirebase } from "../../context/Firebase";

function GroupForm() {
  const firebase = useFirebase();

  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  // const users = JSON.parse(localStorage.getItem("users")) || [];
  const users = firebase.users;
  const [errorMessage, setErrorMessage] = useState("");

  const userOptions = users
    .filter((user) => user.id !== currentUser.id)
    .map((user) => ({
      value: user.id,
      label: `${user.firstName} ${user.lastName}`,
    }));

  console.log(userOptions, "Amana");

  const [groupData, setGroupData] = useState({
    id: "",
    groupName: "",
    description: "",
    selectedUsers: [currentUser.id], // Start with current user in selected users
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGroupData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUserSelect = (selectedOptions) => {
    const selectedUserIds = selectedOptions.map((option) => option.value);
    setGroupData((prevData) => ({
      ...prevData,
      selectedUsers: [currentUser.id, ...selectedUserIds],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!groupData.groupName) {
      setErrorMessage("Group Name is required.");
      return;
    }
    if (groupData.selectedUsers.length < 2) {
      setErrorMessage("At least one user should be selected.");
      return;
    }

    // const existingGroups = JSON.parse(localStorage.getItem("groups")) || [];
    const existingGroups = firebase.groupData;
    const newGroup = { ...groupData, id: Date.now() };
    // localStorage.setItem(
    //   "groups",
    //   JSON.stringify([...existingGroups, newGroup])
    // );
    // let dataOne = JSON.stringify([...existingGroups, newGroup]);
    let dataOne = [...existingGroups, newGroup];
    firebase.setDatafirebase("groups", dataOne);
    // firebase.alertBox();

    console.log([...existingGroups, newGroup], "Aman");

    alert("Group created successfully!");
    setErrorMessage("");
    setGroupData({
      id: "",
      groupName: "",
      description: "",
      selectedUsers: [currentUser.id],
    });
    navigate("/main");
  };

  return (
    <form onSubmit={handleSubmit} className="group-form">
      <h2>Create Group</h2>
      <label>
        Group Name:
        <input
          type="text"
          name="groupName"
          value={groupData.groupName}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Description:
        <input
          type="text"
          name="description"
          value={groupData.description}
          onChange={handleInputChange}
        />
      </label>
      <label>Select Users:</label>
      <Select
        isMulti
        options={userOptions}
        onChange={handleUserSelect}
        className="user-select"
        classNamePrefix="select"
        placeholder="Select users..."
      />
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <button type="submit">Create Group</button>
    </form>
  );
}

export default GroupForm;
