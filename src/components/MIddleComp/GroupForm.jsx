// import { useState } from "react";
// import Select from "react-select";
// import "./GroupForm.css";

// import { useNavigate } from "react-router-dom";
// import { useFirebase } from "../../context/Firebase";

// function GroupForm() {
//   const firebase = useFirebase();

//   const navigate = useNavigate();
//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//   // const users = JSON.parse(localStorage.getItem("users")) || [];
//   const users = firebase.users;
//   const [errorMessage, setErrorMessage] = useState("");

//   const userOptions = users
//     .filter((user) => user.id !== currentUser.id)
//     .map((user) => ({
//       value: user.id,
//       label: `${user.firstName} ${user.lastName}`,
//     }));

//   console.log(userOptions, "Amana");

//   const [groupData, setGroupData] = useState({
//     id: "",
//     groupName: "",
//     description: "",
//     selectedUsers: [currentUser.id], // Start with current user in selected users
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setGroupData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   const handleUserSelect = (selectedOptions) => {
//     const selectedUserIds = selectedOptions.map((option) => option.value);
//     setGroupData((prevData) => ({
//       ...prevData,
//       selectedUsers: [currentUser.id, ...selectedUserIds],
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!groupData.groupName) {
//       setErrorMessage("Group Name is required.");
//       return;
//     }
//     if (groupData.selectedUsers.length < 2) {
//       setErrorMessage("At least one user should be selected.");
//       return;
//     }

//     // const existingGroups = JSON.parse(localStorage.getItem("groups")) || [];
//     const existingGroups = firebase.groupData;
//     const newGroup = { ...groupData, id: Date.now() };
//     // localStorage.setItem(
//     //   "groups",
//     //   JSON.stringify([...existingGroups, newGroup])
//     // );
//     // let dataOne = JSON.stringify([...existingGroups, newGroup]);
//     let dataOne = [...existingGroups, newGroup];
//     firebase.setDatafirebase("groups", dataOne);
//     // firebase.alertBox();

//     console.log([...existingGroups, newGroup], "Aman");

//     alert("Group created successfully!");
//     setErrorMessage("");
//     setGroupData({
//       id: "",
//       groupName: "",
//       description: "",
//       selectedUsers: [currentUser.id],
//     });
//     navigate("/main");
//   };

//   return (
//     <form onSubmit={handleSubmit} className="group-form">
//       <h2>Create Group</h2>
//       <label>
//         Group Name:
//         <input
//           type="text"
//           name="groupName"
//           value={groupData.groupName}
//           onChange={handleInputChange}
//         />
//       </label>
//       <label>
//         Description:
//         <input
//           type="text"
//           name="description"
//           value={groupData.description}
//           onChange={handleInputChange}
//         />
//       </label>
//       <label>Select Users:</label>
//       <Select
//         isMulti
//         options={userOptions}
//         onChange={handleUserSelect}
//         className="user-select"
//         classNamePrefix="select"
//         placeholder="Select users..."
//       />
//       {errorMessage && <p className="error-message">{errorMessage}</p>}
//       <button type="submit">Create Group</button>
//     </form>
//   );
// }

// export default GroupForm;

import { useState } from "react";
import Select from "react-select";
import "./GroupForm.css";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "../../context/Firebase";

function GroupForm() {
  const firebase = useFirebase();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const users = firebase.users;
  const [groupData, setGroupData] = useState({
    id: "",
    groupName: "",
    description: "",
    selectedUsers: [currentUser.id],
  });

  // Error states for each field
  const [errors, setErrors] = useState({
    groupName: "",
    description: "",
    selectedUsers: "",
  });

  const userOptions = users
    .filter((user) => user.id !== currentUser.id)
    .map((user) => ({
      value: user.id,
      label: `${user.firstName} ${user.lastName}`,
    }));

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

    let formValid = true;
    const newErrors = { groupName: "", description: "", selectedUsers: "" };

    if (!groupData.groupName) {
      newErrors.groupName = "Group Name is required.";
      formValid = false;
    }

    if (!groupData.description) {
      newErrors.description = "Description is required.";
      formValid = false;
    }

    if (groupData.selectedUsers.length < 2) {
      newErrors.selectedUsers = "At least one user should be selected.";
      formValid = false;
    }

    if (!formValid) {
      setErrors(newErrors);
      return;
    }

    const existingGroups = firebase.groupData;
    const newGroup = { ...groupData, id: Date.now() };
    let dataOne = [...existingGroups, newGroup];
    firebase.setDatafirebase("groups", dataOne);

    alert("Group created successfully!");
    setErrors({});
    setGroupData({
      id: "",
      groupName: "",
      description: "",
      selectedUsers: [currentUser.id],
    });
    navigate("/main");
  };

  const handleFocus = (field) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
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
          onFocus={() => handleFocus("groupName")}
          className={errors.groupName ? "error-input" : ""}
        />
        {errors.groupName && (
          <p className="groupForm-error-message">{errors.groupName}</p>
        )}
      </label>

      <label>
        Description:
        <input
          type="text"
          name="description"
          value={groupData.description}
          onChange={handleInputChange}
          onFocus={() => handleFocus("description")}
          className={errors.description ? "error-input" : ""}
        />
        {errors.description && (
          <p className="groupForm-error-message">{errors.description}</p>
        )}
      </label>

      <label>Select Users:</label>
      <Select
        isMulti
        options={userOptions}
        onChange={handleUserSelect}
        className={`user-select ${errors.selectedUsers ? "error-input" : ""}`}
        classNamePrefix="select"
        placeholder="Select users..."
        onFocus={() => handleFocus("selectedUsers")}
      />
      {errors.selectedUsers && (
        <p className="groupForm-error-message">{errors.selectedUsers}</p>
      )}

      <button type="submit">Create Group</button>
    </form>
  );
}

export default GroupForm;
