import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { applyThemeVariables } from "./policyengineTheme";
import "./styles.css";

applyThemeVariables();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
