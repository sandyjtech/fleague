import React, {useState} from 'react'
import Signup from './Signup'
import SignIn from './SignIn'
import './Navbar.css';
import { styled} from '@mui/material/styles';
import Button from '@mui/material/Button';
import { useUserAuth  } from "../context/UserAuthProvider";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'black', // Green pastel color
  color: theme.palette.common.white,
  borderRadius: "15%",
  margin: "5px",
  '&:hover': {
    backgroundColor: '#7bc68c', // Slightly darker shade on hover
  },
}));

const Header = () => {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setSignupModalOpen] = useState(false);
  const { user, handleLogout } = useUserAuth() ;

  const handleLoginModalOpen = () => {
    setLoginModalOpen(true);
  };

  const handleLoginModalClose = () => {
    setLoginModalOpen(false);
  };

  const handleSignupModalOpen = () => {
    setSignupModalOpen(true);
  };

  const handleSignupModalClose = () => {
    setSignupModalOpen(false);
  };
  
  return (
    <div>
      <div className="logo">NFLeague</div>
      <div>
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
                  <DialogTitle>Login</DialogTitle>
                  <DialogContent>
                    <SignIn onLogin={() => handleLoginModalClose()} />
                  </DialogContent>
                </Dialog>
                <Dialog open={isSignupModalOpen} onClose={handleSignupModalClose}>
                  <DialogTitle>Signup</DialogTitle>
                  <DialogContent>
                    <Signup />
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>      
    </div>
  )
}

export default Header