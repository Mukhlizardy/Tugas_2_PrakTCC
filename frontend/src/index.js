import React from "react";
import ReactDOM from "react-dom/client"; // Menggunakan 'react-dom/client'
import "./style.css";
import App from "./App";
import "bulma/css/bulma.css";

// Cari elemen root
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render menggunakan createRoot
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
