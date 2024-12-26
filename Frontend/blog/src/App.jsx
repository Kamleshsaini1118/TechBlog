import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Login from "./Pages/Login.jsx";
import Home from "./Pages/Home.jsx";
import Profile from "./Pages/Profile.jsx";
import PostDetail from './Pages/PostDetail';
import Write from "./Pages/Write.jsx";
import Posts from "./Pages/Posts.jsx";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Footer from "./components/Footer.jsx";
import PostUpdate from "./Pages/PostUpdate.jsx"

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen"> 
        <Navbar />
        <main className="flex-grow overflow-auto">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="posts" element={<Posts />} />
            <Route path="/posts/get/:id" element={<PostDetail />} />
            <Route path="/posts/update/:id" element={<PostUpdate />} />
            <Route path="/login" element={<Login />} />
            <Route path="/write" element={<Write />} />
            <Route path="profile" element={<Profile />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
        <ToastContainer />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
