import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import { FaRegCopyright } from "react-icons/fa";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Footer from "./Footer";
import { FaHome, FaUser, FaNewspaper, FaComment } from "react-icons/fa";
import { TbScoreboard } from "react-icons/tb";
import { BsFileEarmarkPostFill } from "react-icons/bs";

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
        <Link
          to="/scores"
          className={`menu-item ${
            location.pathname === "/scores" ? "active" : ""
          }`}
        >
          <TbScoreboard
            className="menu-icon"
            style={{
              color: "whitesmoke",
              fontSize: "1.5em",
              marginRight: "15px",
            }}
          />
        </Link>
        <Link
          to="/news"
          className={`menu-item ${
            location.pathname === "/news" ? "active" : ""
          }`}
        >
          <FaNewspaper
            className="menu-icon"
            style={{
              color: "whitesmoke",
              fontSize: "1.5em",
              marginRight: "15px",
            }}
          />
        </Link>
        <Link
          to="/posts"
          className={`menu-item ${
            location.pathname === "/posts" ? "active" : ""
          }`}
        >
          <BsFileEarmarkPostFill
            className="menu-icon"
            style={{
              color: "whitesmoke",
              fontSize: "1.5em",
              marginRight: "15px",
            }}
          />
        </Link>
        <Link
          to="/"
          className={`menu-item ${location.pathname === "/" ? "active" : ""}`}
        >
          <FaHome
            className="menu-icon"
            style={{
              color: "whitesmoke",
              fontSize: "1.5em",
              marginRight: "15px",
            }}
          />
        </Link>
        <Link
          to="/my-account"
          className={`menu-item ${
            location.pathname === "/my-account" ? "active" : ""
          }`}
        >
          <FaUser
            className="menu-icon"
            style={{
              color: "whitesmoke",
              fontSize: "1.5em",
              marginRight: "15px",
            }}
          />
        </Link>
        <Link
          to="/massage-center"
          className={`menu-item ${
            location.pathname === "/massage-center" ? "active" : ""
          }`}
        >
          <FaComment
            className="menu-icon"
            style={{
              color: "whitesmoke",
              fontSize: "1.5em",
              marginRight: "15px",
            }}
          />
        </Link>
        <Button className="rights" onClick={handleFooterModalOpen}>
          <FaRegCopyright />
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
