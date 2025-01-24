import { createBrowserRouter, createHashRouter } from "react-router-dom";
import MainComponent from "../components/main";
import Navigator from "../components/sidebar-sections/navigator";
import InformationRoute from "../components/sidebar-sections/information";

export default createHashRouter([
  {
    path: "/main_window",
    element: <MainComponent />,
    errorElement: <MainComponent />,
    children: [
      {
        path: "", // Default route for /main_window
        element: <Navigator />,
        index: true,
      },
      {
        path: "information", // Relative path for /main_window/information
        element: <InformationRoute />,
      },
    ],
  },
]);
