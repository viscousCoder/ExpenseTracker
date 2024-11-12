import { useState, useEffect, useMemo } from "react";
import Select from "react-select";
import "./AddExpenseDialog.css";
import { useFirebase } from "../../context/Firebase";

function AddExpenseDialog({ isOpen, onClose, groupUsers, groupId }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  console.log(isOpen, "isOpen");
  // Get the current user from local storage
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const firebase = useFirebase();

  // Include the current user in the user options
  const userOptions = useMemo(
    () =>
      groupUsers
        ?.filter((user) => user.id !== currentUser.id)
        ?.map((user) => ({
          value: user.id,
          label: `${user.firstName} ${user.lastName}`,
        }))
        .concat({
          value: currentUser.id,
          label: `${currentUser.firstName} ${currentUser.lastName}`,
        }),
    [groupUsers, currentUser.id, currentUser.firstName, currentUser.lastName]
  );

  useEffect(() => {
    if (isOpen) {
      // Set the initial selected users to include the current user
      const initialSelectedUsers = userOptions?.map((user) => user);
      setSelectedUsers(initialSelectedUsers);
    }
  }, [isOpen, userOptions]);

  const handleUserSelect = (selectedOptions) => {
    setSelectedUsers(selectedOptions || []);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !amount || selectedUsers.length === 0) {
      alert("Please fill in all required fields.");
      return;
    }

    const totalAmount = parseFloat(amount);
    const numberOfUsers = selectedUsers.length;

    // Calculate the per-user split amount
    const splitAmount = (totalAmount / numberOfUsers).toFixed(2);
    const lentAmount = (
      (totalAmount * (numberOfUsers - 1)) /
      numberOfUsers
    ).toFixed(2);

    const expense = {
      type: "expense",
      title,
      description,
      amount: totalAmount,
      paidAmount: totalAmount,
      lentAmount,
      paidBy: currentUser.id, // Current user is paying the entire amount
      splitAmong: selectedUsers.map((user) => user.value),
    };

    // Store the expense in local storage
    // const allGroups = JSON.parse(localStorage.getItem("groups")) || [];
    const allGroups = firebase.groupData;
    const updatedGroups = allGroups.map((group) => {
      if (group.id === Number(groupId)) {
        return {
          ...group,
          expenses: [...(group.expenses || []), expense],
        };
      }
      return group;
    });

    localStorage.setItem("groups", JSON.stringify(updatedGroups));
    firebase.setDatafirebase("groups", updatedGroups);

    // Reset form and close dialog
    setTitle("");
    setDescription("");
    setAmount("");
    setSelectedUsers([]);
    onClose();
  };

  return (
    isOpen && (
      <div className="dialog-overlay" onClick={onClose}>
        <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
          <h3>Add Expense</h3>
          <form onSubmit={handleSubmit}>
            <label>
              Title (where you pay):
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>
            <label>
              Description:
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter a brief description..."
              />
            </label>
            <label>
              Amount:
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                placeholder="Enter amount"
              />
            </label>
            <label>
              Select Users:
              <Select
                isMulti
                options={userOptions}
                value={selectedUsers}
                onChange={handleUserSelect}
                className="user-select"
                classNamePrefix="select"
                placeholder="Select users..."
              />
            </label>
            <div className="dialog-buttons">
              <button type="submit" className="submit-button">
                Submit
              </button>
              <button type="button" onClick={onClose} className="close-button">
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
}

export default AddExpenseDialog;
