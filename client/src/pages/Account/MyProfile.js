import React from 'react';
import './Account.css';

const MyProfile = ({ user }) => {
  return (
      <div>
      <h1>My Profile</h1>
      {user && (
        <div>
          <p>Username: {user.username}</p>
          {/* Render other user data as needed */}
        </div>
      )}
    </div>
  );
};
 export default MyProfile;