import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Group.css";
import AddExpenseDialog from "./AddExpenseDialog";
import GroupContent from "./GroupContent";
import SettleDialog from "./SettleDialog";
import { useFirebase } from "../../context/Firebase";

function Group() {
  const firebase = useFirebase();
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [groupUsers, setGroupUsers] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [isSettleDisabled, setIsSettleDisabled] = useState(false);
  const [isSettleOpen, setIsSettleOpen] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    // const allGroups = JSON.parse(localStorage.getItem("groups")) || [];
    const allGroups = firebase.groupData;
    // const users = JSON.parse(localStorage.getItem("users")) || [];
    const users = firebase.users;
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const selectedGroup = allGroups.find((grp) => grp.id === Number(groupId));
    setGroup(selectedGroup);

    if (selectedGroup) {
      const members = users.filter((user) =>
        selectedGroup.selectedUsers.includes(user.id)
      );
      setGroupUsers(members);

      // Calculate the current user's balance in this group
      const balance = calculateUserBalance(currentUser.id, selectedGroup);
      setIsSettleDisabled(balance >= -1); // Disable if positive or zero
      console.log("balance", balance, isSettleDisabled);
    }
  }, [groupId, isExpenseOpen, isSettleOpen]);

  const calculateUserBalance = (userId, group) => {
    let totalPaid = 0;
    let totalLent = 0;

    group.expenses?.forEach((expense) => {
      if (expense.paidBy === userId) {
        totalPaid += Number(expense.lentAmount);
      }
      if (expense.splitAmong.includes(userId) && expense.paidBy !== userId) {
        totalLent += parseFloat(
          Number(expense.lentAmount) / (expense.splitAmong.length - 1)
        );
      }
    });

    return totalPaid - totalLent; // Net balance
  };

  const handleSettle = () => {
    setIsSettleOpen(!isSettleOpen); // Toggle SettleDialog visibility
  };

  const handleDialogToggle = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  const handleExpense = () => {
    setIsExpenseOpen(!isExpenseOpen);
  };
  console.log(isExpenseOpen, "isOpen");

  if (!group) {
    return <p>Group not found</p>;
  }

  return (
    <div className="group-page">
      <div className="group-header">
        <div className="group-title-container">
          <h2 onClick={handleDialogToggle} className="group-title">
            {group.groupName}
          </h2>
          <p className="group-description">
            {group.description.length > 30
              ? `${group.description.slice(0, 30)}...`
              : group.description}
          </p>
        </div>
        <div className="group-actions">
          <button className="add-expense-btn" onClick={handleExpense}>
            Add an Expense
          </button>
          {/* <button
            className="settle-up-btn disabled"
            disabled={isSettleDisabled}
          >
            Settle Up
          </button> */}
          <button
            className={`settle-up-btn ${isSettleDisabled ? "disabled" : ""}`}
            onClick={handleSettle}
            disabled={isSettleDisabled}
          >
            Settle Up
          </button>
        </div>
      </div>

      <AddExpenseDialog
        isOpen={isExpenseOpen}
        onClose={handleExpense}
        groupUsers={groupUsers}
        groupId={groupId}
      />
      <SettleDialog
        isOpen={isSettleOpen}
        onClose={handleSettle}
        groupUsers={groupUsers}
        groupId={groupId}
        group={group}
        currentUser={currentUser}
      />
      <div className="group-content-box">
        <GroupContent expenses={group.expenses || []} />
      </div>
      {isDialogOpen && (
        <div className="dialog-overlay" onClick={handleDialogToggle}>
          <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
            <h3>{group.groupName}</h3>
            <p>{group.description}</p>
            <div className="dialog-users">
              {groupUsers.length > 0 ? (
                groupUsers.map((user) => (
                  <div key={user.id} className="dialog-user">
                    <div className="user-avatar">👤</div>
                    <div className="user-info">
                      <span>
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-expense-message">Add your all expenses.</p>
              )}
            </div>
            <button className="close-dialog" onClick={handleDialogToggle}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Group;
