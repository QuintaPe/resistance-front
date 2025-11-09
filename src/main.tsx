import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import { SocketProvider } from "./context/SocketContext";
import "./index.css";

const container = document.getElementById("root");
if (!container) throw new Error("Root element not found");

createRoot(container).render(
    <React.StrictMode>
        <BrowserRouter>
            <SocketProvider>
                <App />
            </SocketProvider>
        </BrowserRouter>
    </React.StrictMode>
);
