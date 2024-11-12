import { useState } from "react";
import "./GroupContent.css";

function GroupContent({ expenses }) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  return (
    <div className="group-content">
      {expenses && expenses.length > 0 ? (
        expenses.map((expense, index) => (
          <ExpenseCard
            key={index}
            expense={expense}
            users={users}
            currentUser={currentUser}
          />
        ))
      ) : (
        <p className="no-expenses-message">No expenses added yet.</p>
      )}
    </div>
  );
}

function ExpenseCard({ expense, users, currentUser }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Find the user who paid and format their full name
  const paidByUser = users.find((user) => user.id === expense.paidBy);
  const paidByName = paidByUser
    ? `${paidByUser.firstName} ${paidByUser.lastName}`
    : "Unknown";

  // Find the user who received the amount (if settle type)
  const receivedUser =
    expense.type === "settle" && expense.splitAmong.length > 0
      ? users.find((user) => user.id === expense.splitAmong[0])
      : null;
  const receivedUserName = receivedUser
    ? `${receivedUser.firstName} ${receivedUser.lastName}`
    : "Unknown User";

  // Calculate the split amount
  const splitAmount = (
    expense.lentAmount /
    (expense.splitAmong.length - 1)
  ).toFixed(2);
  console.log("data", splitAmount);
  const splitAmountD = expense.lentAmount;
  // console.log("data", splitAmount);

  return (
    <div
      className={`expense-card ${isExpanded ? "expanded" : ""} ${
        expense.type === "settle" ? "settle-style" : ""
      }`}
      onClick={toggleExpand}
    >
      <div className="expense-card-header">
        {/* Conditional title based on expense type */}
        <div className="expense-title">
          {expense.type === "settle" ? "Settle" : expense.title}
        </div>
        <div className="expense-amounts">
          <div className="paid-amount">
            <div className="paidBy">
              {/* Paid by {expense.paidBy !== currentUser.id && ` ${paidByName}`} */}
              Paid by {paidByName}
            </div>
            <div className="paidAmount">${expense.paidAmount}</div>
          </div>

          {expense.type === "settle" ? (
            // Display "Settle" style with receiver's name
            <div className="settle-recipient">
              {receivedUserName} received ${expense.amount}
            </div>
          ) : (
            // Display "Lent" or "Owe" based on current user
            <div
              className="owe-amount"
              style={{
                color: expense.paidBy !== currentUser.id ? `red` : `green`,
              }}
            >
              {expense.paidBy !== currentUser.id ? `You owe` : `Lent`}: $
              {expense.paidBy !== currentUser.id ? splitAmount : splitAmountD}
            </div>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="expense-details">
          {expense.type === "settle" ? (
            // Expanded details for "settle" type expense
            <>
              <div className="detail-row">
                <strong>Description:</strong>{" "}
                {`${paidByName} sent the money to ${receivedUserName}`}
              </div>
              <div className="detail-row">
                <strong>Settle Amount:</strong> ${expense.amount}
              </div>
              <div className="detail-row">
                <strong>Additional Info:</strong> Some lorem ipsum text here for
                additional information.
              </div>
            </>
          ) : (
            // Expanded details for regular expenses
            <>
              <div className="detail-row">
                <strong>Description:</strong>{" "}
                {expense.description || "No description provided"}
              </div>
              <div className="detail-row">
                <strong>Paid By:</strong> {paidByName}
              </div>
              <div className="detail-row">
                <strong>Splitted Among:</strong>
                <ul>
                  {expense.splitAmong.map((userId) => {
                    const user = users.find((u) => u.id === userId);
                    const userName = user
                      ? `${user.firstName} ${user.lastName}`
                      : "Unknown User";
                    return (
                      <li key={userId}>
                        {userName} owes ${splitAmount}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default GroupContent;
