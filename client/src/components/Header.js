import React, { useState } from "react";
import Signup from "./Signup";
import SignIn from "./SignIn";
import "./Navbar.css";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { useUserAuth } from "../context/UserAuthProvider";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import "./Header.css";

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: "black",
  color: theme.palette.common.white,
  borderRadius: "15%",
  margin: "5px",
}));

const Header = () => {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setSignupModalOpen] = useState(false);
  const { user, handleLogout } = useUserAuth();

  const handleLoginModalOpen = () => {
    setLoginModalOpen(true);
    setSignupModalOpen(false); 
  };

  const handleLoginModalClose = () => {
    setLoginModalOpen(false);
  };

  const handleSignupModalOpen = () => {
    setSignupModalOpen(true);
    setLoginModalOpen(false); 
  };

  const handleSignupModalClose = () => {
    setSignupModalOpen(false);
  };

  return (
    <div className="header">
      <div className="logo">
        <img
          src={require("../football.png")}
          alt="Logo"
          className="logo-image"
        />
        NFLeague
      </div>
      <div className="header-buttons">
        {user ? (
          <StyledButton variant="outlined" onClick={handleLogout}>
            Logout
          </StyledButton>
        ) : (
          <>
            <StyledButton variant="outlined" onClick={handleLoginModalOpen}>
              Login
            </StyledButton>
            <StyledButton variant="outlined" onClick={handleSignupModalOpen}>
              Signup
            </StyledButton>
            <Dialog open={isLoginModalOpen} onClose={handleLoginModalClose}>
              <DialogContent>
                <SignIn toggleSignupModal={handleSignupModalOpen} />
              </DialogContent>
            </Dialog>
            <Dialog open={isSignupModalOpen} onClose={handleSignupModalClose}>
              <DialogContent>
                <Signup toggleSignInModal={handleLoginModalOpen} />
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;