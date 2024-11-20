<!-- # React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh -->

# Expense Tracker - README

## Overview

**Expense Tracker** is a React-based web application that helps users track and manage their expenditures. It allows users to authenticate, create and manage expense groups, track expenses, and settle balances with others in the group. The app uses **Firebase Realtime Database** for storing user and group data.

### Live Demo

You can see the live version of the project hosted on [Netlify](https://expensetrackerweb01.netlify.app/).

---

## Features

- **User Authentication**: Allows users to register and log in with email and password via Firebase Authentication.
- **Dashboard**: After logging in, users are redirected to a main dashboard with a 3-column layout:
  - **Column 1**: Navigation buttons (Mainpage, Create Group, Group List, Logout)
  - **Column 2**: Displays dynamic data based on user interaction (group details, expenses).
  - **Column 3**: Displays the list of users.
- **Group Management**:
  - Users can create groups by providing a name, description, and selecting members from the available user list.
  - Groups are listed in the left column, and users can click on a group to view detailed information about that group.
- **Expense Management**:

  - Users can add expenses by entering a title, description, amount, and selecting the users with whom they want to split the amount.
  - Expenses are shown in a card format, with the option to expand for full details.
  - Users can settle debts by selecting the person they owe money to and submitting a payment.

- **User List**: In group pages, only the users added to the group are visible, with the current user always displayed at the top.

- **Modal/Popup**: When clicking on a group, a modal appears showing the full group description (truncated if it exceeds 30 words) and the list of users in that group.

---

## Installation & Setup

Follow these steps to set up the project on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v12 or higher)
- [Firebase Account](https://firebase.google.com/) with a Realtime Database setup.

### Steps to Run the Project

1. **Clone the repository:**

   ```bash
   git clone https://github.com/viscousCoder/ExpenseTracker.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd ExpenseTracker
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Set up Firebase:**

   - Go to [Firebase Console](https://console.firebase.google.com/).
   - Create a new Firebase project (if you don't have one).
   - Enable Firebase Authentication and set up the Realtime Database.
   - Get the **Firebase config** (secret keys) for your project.

5. **Add Firebase credentials to your project:**

   - In the root directory of the project, create a `.env` file.
   - Add your Firebase configuration as follows:

   ```plaintext
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   ```

6. **Run the project:**

   ```bash
   npm start
   ```

   Your app should now be running on `http://localhost:3000`.

---

## Project Structure

```bash
src/
├── components/      # React components for the app's UI
├── firebase/        # Firebase configuration and database functions
├── pages/           # React components for each page (Login, Register, Dashboard)
├── styles/          # CSS/SCSS files for styling
└── App.js           # Main app component that includes routing
```
