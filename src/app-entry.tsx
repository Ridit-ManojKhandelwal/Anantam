import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./shared/store";
import App from "./app";
import { Tools } from "./components/tools";
import DataStudio from "./components/data-studio/app";

const root = createRoot(document.querySelector("#root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

const toolsWindow = createRoot(document.querySelector("#toolsWindow"));
toolsWindow.render(
  <Provider store={store}>
    <Tools />
  </Provider>
);

const dataStudio = createRoot(document.querySelector("#dataStudio"));
dataStudio.render(
  <Provider store={store}>
    <DataStudio />
  </Provider>
);
