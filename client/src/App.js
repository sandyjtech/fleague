import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home/Home";
import Scores from "./pages/Scores/Scores";
import News from "./pages/News/News";
import Posts from "./pages/Posts/Posts";
import MessageCenter from "./pages/Message/MessageCenter";
import Header from "./components/Header";
import Navbar from "./components/Navbar"
import Account from "./pages/Account/Account"
import PostsProvider from "./context/PostsContext";

function App() {
  return (
    <div className="App">
      <PostsProvider>
      <Header />
      {/* Define your routes */}
      <Routes>
        <Route path="/scores" element={<Scores />} />
        <Route path="/news" element={<News />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/massage-center" element={<MessageCenter />} />
        <Route path="/my-account" element={<Account/>}/>
        {/* The home route should come last */}
        <Route path="/" element={<Home />} />
      </Routes>      
      <Navbar/>
      </PostsProvider>
    </div>
  );
}

export default App;
