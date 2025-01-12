import { createBrowserRouter, createHashRouter } from "react-router-dom";
import MainComponent from "../components/main";
import ExplorerRoute from "../components/sidebar-routes/navigator";
import SidebarIndexRoute from "../components/sidebar-routes/sidebarIndex";
import InformationRoute from "../components/sidebar-routes/information";

export default createHashRouter([
  {
    path: "/main_window",
    element: <MainComponent />,
    errorElement: <MainComponent />,
    children: [
      {
        path: "", // Default route for /main_window
        element: <ExplorerRoute />,
        index: true,
      },
      {
        path: "information", // Relative path for /main_window/information
        element: <InformationRoute />,
      },
    ],
  },
]);
