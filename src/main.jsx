import React from "react";
import ReactDOM from "react-dom/client";

import { Toaster } from "react-hot-toast";

import App from "./App";

import "./index.css";

import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>

      <App />

      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3500,

          style: {
            borderRadius: "14px",
            fontSize: "14px",
            padding: "16px",
          },

          success: {
            iconTheme: {
              primary: "#02C39A",
              secondary: "#fff",
            },
          },

          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#fff",
            },
          },
        }}
      />

    </AuthProvider>
  </React.StrictMode>
);