import React, { useEffect } from "react";
import { Routes, Route} from "react-router-dom";
import "./App.css";
import Home from "./pages/Home/Home";
import Scores from "./pages/Scores/Scores";
import News from "./pages/News/News";
import Posts from "./pages/Posts/Posts";
import MessageCenter from "./pages/Message/MessageCenter";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Account from "./pages/Account/Account";
import UnauthorizedAccess from "./UnauthorizedAccess"; // Import the UnauthorizedAccess component
import { useUserAuth } from "./context/UserAuthProvider";

function App() {
  const { user, checkAuthorized } = useUserAuth();

  useEffect(() => {
    checkAuthorized();
  }, []);

  // Check if the user is authenticated based on user object properties
  const isAuthenticated = user !== null && !user.error;

  return (
    <div className="App">
      <Header />
      <Routes>
      <Route path="/" element={<Home key="home" />} />
        {isAuthenticated ? (
          <>
            <Route path="/scores" element={<Scores />} />
            <Route path="/news" element={<News />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/massage-center" element={<MessageCenter />} />
            <Route path="/my-account" element={<Account />} />            
          </>
        ) : (
          // Redirect to "Unauthorized" page when not logged in
          <Route path="*" element={<UnauthorizedAccess />} />
        )}
      </Routes>
      <Navbar />
    </div>
  );
}

export default App;