import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// Context
import { AuthProvider } from "./context/AuthContext.jsx";

// Css
import "./index.css";
import "./global.css";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
