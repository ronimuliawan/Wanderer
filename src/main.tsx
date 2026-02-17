import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "./contexts/ThemeContext";

console.log("!!! APPLICATION ENTRY POINT EXECUTED !!!");
console.log("React Version:", React.version);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="explorer">
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
