import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import "./App.css";
import MainPage from "./components/MainPage";
import WelcomePage from "./components/MIddleComp/WelcomePage";
import GroupForm from "./components/MIddleComp/GroupForm";
import Group from "./components/MIddleComp/Group";
import { checkAuthLoader } from "./utils/LoaderFile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  { path: "/register", element: <Register /> },
  {
    path: "/main",
    element: <MainPage />,
    loader: checkAuthLoader,
    children: [
      { index: true, element: <WelcomePage /> },
      {
        path: "create-group",
        element: <GroupForm />,
      },
      {
        path: "group/:groupId",
        element: <Group />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

// function App() {
//   return (
//     <Router>
//       <div className="app">
//         <Routes>
//           <Route path="/" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           {/* <Route path="/main" element={<MainPage />} /> */}
//           <Route path="/main" element={<MainPage />}>
//             <Route index element={<WelcomePage />} /> {/* Default route */}
//             <Route path="create-group" element={<GroupForm />} />
//             <Route path="group/:groupId" element={<Group />} />
//             {/* Child route */}
//           </Route>
//         </Routes>
//       </div>
//     </Router>
//   );
// }

export default App;
