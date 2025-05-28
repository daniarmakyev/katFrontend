import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import NotFoundPage from "../pages/NotFoundPage";
import AuthPage from "../pages/AuthPage";
import Layout from "./layout";
import AdminLayout from "./adminLayout";
import Graf from "../pages/Graf";
import Admin from "../pages/Admin";

export const router = createBrowserRouter([
  {
    id: "root",
    //   errorElement: <ErrorPage />,
    element: <Layout />,
    children: [
      { path: "/admin/:specialization", element: <App /> },
      { path: "/", element: <AuthPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },

  {
    id:"admin",
    element:<AdminLayout/>,
    children: [
      {path: "/graf", element: <Graf />},
      {path: "/admin", element: <Admin />},
    ]
  }
]);
