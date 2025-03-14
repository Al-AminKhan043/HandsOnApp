import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux"; // Import the Provider from react-redux
import store from "./utils/store"; // Import the store you've created
import "./index.css";
import App from "./App.jsx";

// Render the app and provide the Redux store to the app
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}> {/* Wrap App in the Provider */}
      <App />
    </Provider>
  </StrictMode>
);
