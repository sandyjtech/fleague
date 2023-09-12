import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom"; // Import BrowserRouter
import "./index.css";
import App from "./App";
import PostsProvider from "./context/PostsContext";
import UserAuthProvider from "./context/UserAuthProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  
    <Router>
      <UserAuthProvider>
        <PostsProvider>
          <App />
        </PostsProvider>
      </UserAuthProvider>
    </Router>
 
);

