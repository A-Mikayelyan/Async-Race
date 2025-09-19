import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./routes/AppRouter";
import "./index.css";
import "./styles/tokens.css";
import "./styles/global.css";
import "./styles/container.css";
import "./styles/forms.css";
import "./styles/buttons.css";
import "./styles/pagination.css";
import "./styles/tabs.css";
import "./styles/track.css";
import "./styles/overlay.css";
import "./styles/garage.css";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>,
);
