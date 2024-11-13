import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import "./MainPage.css";
import { useFirebase } from "../context/Firebase";

function MainPage() {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const firebase = useFirebase();

  console.log("Aman", groups, firebase.groupData);
  useEffect(() => {
    const fetchData = () => {
      // const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
      const storedUsers = firebase.users;
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      // const allGroups = JSON.parse(localStorage.getItem("groups")) || [];
      const allGroups = firebase.groupData;

      // Filter groups where current user is a member
      const userGroups = allGroups.filter((group) =>
        group.selectedUsers.includes(currentUser?.id)
      );

      setUsers(storedUsers);
      setGroups(userGroups);
      const savedGroupId = localStorage.getItem("selectedGroupId");
      if (savedGroupId) {
        setSelectedGroupId(Number(savedGroupId));
      }
    };

    // Initial data fetch
    fetchData();

    // Set interval to monitor localStorage changes
    // const intervalId = setInterval(() => {
    //   fetchData(); // Refresh data every 2 seconds
    // }, 2000);

    // Clear interval on component unmount
    // return () => clearInterval(intervalId);
  }, [firebase.groupData]);

  const calculateLentOwe = (userId, group) => {
    let totalPaid = 0;
    let totalLent = 0;

    group.expenses?.forEach((expense) => {
      if (expense.paidBy === userId) {
        totalPaid += Number(expense.lentAmount);
      }
      if (expense?.splitAmong?.includes(userId) && expense.paidBy !== userId) {
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

    if (netBalance < 1 && netBalance > -1) {
      return {
        amount: "0.00",
        status: "lent",
      };
    }

    return {
      amount: Math.abs(netBalance).toFixed(2),
      status: netBalance >= 0 ? "lent" : "owe",
    };
  };

  const getFilteredUsers = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const path = location.pathname;

    if (path === "/main" || path === "/main/create-group") {
      return users;
    } else if (path.includes("/main/group/")) {
      const groupId = path.split("/").pop();
      const selectedGroup = groups.find(
        (group) => group.id === Number(groupId)
      );

      if (selectedGroup) {
        const groupMembers = selectedGroup.selectedUsers
          .map((userId) => users.find((user) => user.id === userId))
          .filter(Boolean);

        if (!groupMembers.some((member) => member.id === currentUser.id)) {
          groupMembers.push(currentUser);
        }
        return groupMembers.map((user) => ({
          ...user,
          balance: calculateLentOwe(user.id, selectedGroup),
        }));
      }
    }
    return [];
  };

  const handleGroupClick = (groupId) => {
    if (groupId === null) {
      setSelectedGroupId(null);
      return null;
    }
    setSelectedGroupId(groupId);
    localStorage.setItem("selectedGroupId", groupId); // Save selected group ID in localStorage
    navigate(`group/${groupId}`);
  };

  function handleClick() {
    localStorage.removeItem("selectedGroupId");
    handleGroupClick(null);
  }

  return (
    <div className="main-page">
      <div className="left-column">
        <Link to="/" className="logoutBtn">
          <button className="create-group-btn">LogOut</button>
        </Link>
        <Link to="/main" className="btn">
          <button className="create-group-btn mainBtn" onClick={handleClick}>
            Main
          </button>
        </Link>
        <Link to="create-group" className="btn">
          <button className="create-group-btn" onClick={handleClick}>
            Create Group
          </button>
        </Link>
        <div className="group-list">
          {groups.map((group) => (
            <div
              key={group.id}
              // className="group-item"
              // onClick={() => navigate(`group/${group.id}`)}
              className={`group-item ${
                selectedGroupId === group.id ? "selected" : ""
              }`}
              // onClick={() => {
              //   navigate(`group/${group.id}`);
              //   setSelectedGroupId(group.id);
              // }}
              onClick={() => handleGroupClick(group.id)}
            >
              {group.groupName}
            </div>
          ))}
        </div>
      </div>

      <div className="middle-column">
        <Outlet />
      </div>

      <div className="right-column">
        {getFilteredUsers().map((user) => (
          <div key={user.id} className="user-item">
            <div className="user-avatar">👤</div>
            <div className="user-info">
              <span>
                {user.firstName} {user.lastName}
              </span>
              <span>Age {user.age}</span>
              {user.balance && (
                <span
                  style={{
                    color: user.balance.status === "lent" ? "green" : "red",
                  }}
                >
                  {user.balance.status} {Math.round(user.balance.amount)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MainPage;
