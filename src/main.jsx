import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import { Provider } from "react-redux";
import store from "./redux/Store/store.js";
import { ToastContainer } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
    <ToastContainer />
  </Provider>
);
