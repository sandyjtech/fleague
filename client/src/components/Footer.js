import React from 'react';
import {  FaRegCopyright } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">        
        <div className="footer-items">
          <p>
            <FaRegCopyright /> {year} Sandra Gonzalez. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
