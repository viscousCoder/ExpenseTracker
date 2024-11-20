import { useState, useMemo } from "react";
import Select from "react-select";
import "./SettleDialog.css";
import { useFirebase } from "../../context/Firebase";
/* eslint-disable react/prop-types */

function SettleDialog({ isOpen, onClose, groupUsers, groupId, group }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const firebase = useFirebase();

  // Calculate lent/owe details for each user and filter only those with positive balance

  const calculateLentOwe = (userId) => {
    let totalPaid = 0;
    let totalLent = 0;

    group.expenses?.forEach((expense) => {
      if (expense.paidBy === userId) {
        totalPaid += Number(expense.lentAmount);
      }
      if (expense.splitAmong.includes(userId) && expense.paidBy !== userId) {
        if (expense.splitAmong.length - 1 === 0) {
          totalLent += parseFloat(Number(expense.lentAmount));
        } else {
          totalLent += parseFloat(
            Number(expense.lentAmount) / (expense.splitAmong.length - 1)
          );
        }
      }
    });

    const netBalance = totalPaid - totalLent;

    return {
      amount: Math.abs(netBalance).toFixed(2),
      status: netBalance >= 0 ? "lent" : "owe",
    };
  };

  // Filter users with positive lent amounts for selection
  const settleOptions = useMemo(
    () =>
      groupUsers
        ?.filter(
          (user) =>
            user.id !== currentUser.id &&
            calculateLentOwe(user.id).status === "lent"
        )
        .map((user) => ({
          value: user.id,
          label: `${user.firstName} ${user.lastName}`,
          amount: calculateLentOwe(user.id).amount,
        })),
    [groupUsers, currentUser.id, group]
  );

  const handleUserSelect = (selectedOption) => {
    setSelectedUser(selectedOption);

    // Calculate the owed amount between current user and selected user
    const currentUserBalance = calculateLentOwe(currentUser.id);
    const selectedUserBalance = calculateLentOwe(selectedOption.value);

    // Check if the current user's owe amount is less than or equal to the selected user's lent amount
    if (
      currentUserBalance.status === "owe" &&
      parseFloat(currentUserBalance.amount) <=
        parseFloat(selectedUserBalance.amount)
    ) {
      setAmount(currentUserBalance.amount); // Auto-fill with the current user owe amount
    } else {
      setAmount(selectedOption.amount); // Default to the selected user's lent amount
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedUser || !amount) {
      alert("Please select a user and specify an amount.");
      return;
    }

    // Create a settle expense entry
    const settleExpense = {
      title: "",
      description: "",
      amount: parseFloat(amount),
      paidAmount: parseFloat(amount),
      lentAmount: String(amount),
      paidBy: currentUser.id,
      splitAmong: [selectedUser.value],
      type: "settle",
    };

    // Update local storage
    // const allGroups = JSON.parse(localStorage.getItem("groups")) || [];
    const allGroups = firebase.groupData;
    const updatedGroups = allGroups.map((group) => {
      if (group?.id === Number(groupId)) {
        return {
          ...group,
          expenses: [...(group?.expenses || []), settleExpense],
        };
      }
      return group;
    });

    localStorage.setItem("groups", JSON.stringify(updatedGroups));
    firebase.setDatafirebase("groups", updatedGroups);
    // console.log("key", dataone, "key2");

    // Reset and close dialog
    setSelectedUser(null);
    setAmount("");
    onClose();
  };

  return (
    isOpen && (
      <div className="dialog-overlay" onClick={onClose}>
        <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
          <h3>Settle Amount</h3>
          <form onSubmit={handleSubmit}>
            <label>
              Select User:
              <Select
                options={settleOptions}
                value={selectedUser}
                onChange={handleUserSelect}
                className="user-select"
                classNamePrefix="select"
                placeholder="Select user..."
              />
            </label>
            <label>
              Amount:
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                required
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

export default SettleDialog;
