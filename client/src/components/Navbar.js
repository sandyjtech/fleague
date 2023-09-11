import React, {useState} from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import {  FaRegCopyright } from 'react-icons/fa';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Footer from './Footer';

const Navbar = () => {
  const location = useLocation();
  const [isFooterModalOpen, setFooterModalOpen] = useState(false);

  const handleFooterModalOpen = () => {
    setFooterModalOpen(true);
  };

  const handleFooterModalClose = () => {
    setFooterModalOpen(false);
  };
  return (
    <nav className="navbar">     
      <div className="desktop-menu">
        
        <Link to="/scores" className={`menu-item ${location.pathname === '/projects' ? 'active' : ''}`}>
        Scores
        </Link>
        <Link to="/news" className={`menu-item ${location.pathname === '/news' ? 'active' : ''}`}>
        News
        </Link>
        <Link to="/posts" className={`menu-item ${location.pathname === '/blogs' ? 'active' : ''}`}>
          Posts
        </Link>
        <Link to="/" className={`menu-item ${location.pathname === '/' ? 'active' : ''}`}>
          Home
        </Link>       
        <Link to="/my-account" className={`menu-item ${location.pathname === '/my-account' ? 'active' : ''}`}>
         Account
        </Link>
        <Link to="/massage-center" className={`menu-item ${location.pathname === '/massage-center' ? 'active' : ''}`}>
          Message
        </Link>         
        <Button className="rights" onClick={handleFooterModalOpen}>
                  <FaRegCopyright/>
                </Button>
        <Dialog open={isFooterModalOpen} onClose={handleFooterModalClose}>                  
                  <DialogContent>
                    <Footer />
                  </DialogContent>
                </Dialog>
      </div>
    </nav>
  );
};

export default Navbar;
