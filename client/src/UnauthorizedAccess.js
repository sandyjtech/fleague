import React from "react";
import "./UnauthorizedAccess.css"; // Import the CSS file

function UnauthorizedAccess() {
  return (
    <div className="unauthorized-access">
      <div>
      <h2>Unauthorized Access</h2>
      <p>You are not authorized to access this page.</p>
      <p>Please log in or sign up.</p>
      </div>
      <div className="football-player"></div>
    </div>
  );
}

export default UnauthorizedAccess;
