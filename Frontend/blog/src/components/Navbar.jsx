import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPen, FaBookOpen, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [currentUser, setCurrentUser] = useState(null); // State to track logged-in user
  const [isOpen, setIsOpen] = useState(false); // Manage hamburger menu state
  const navigate = useNavigate();

  // Check if the user is logged in when the component mounts
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    setCurrentUser(user);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // return (
  //   <nav className="bg-white shadow-lg">
  //     <div className="container mx-auto px-4 flex justify-between">
  //       {/* Logo Section */}
  //       <div className="flex items-center h-16 ml-8">
  //         <Link
  //           to="/home"
  //           className="flex items-center space-x-2 transition duration-100 transform hover:scale-105"
  //         >
  //           <FaBookOpen className="h-6 w-6 text-indigo-600" />
  //           <span className="font-bold text-xl">TechBlog</span>
  //         </Link>
  //       </div>

  //       {/* Navbar Links */}
  //       <div className="flex items-center space-x-4 mr-8">
  //         {/* Posts Link */}
  //         <Link
  //           to="/posts"
  //           className="text-gray-700 transition duration-100 transform hover:text-indigo-700 hover:scale-105"
  //         >
  //           Posts
  //         </Link>

  //         {/* Conditionally Render Links */}
  //         {currentUser ? (
  //           <>
  //             {/* Write Link */}
  //             <Link
  //               to="/write"
  //               className="flex items-center gap-2 text-gray-700 transition duration-100 transform hover:text-indigo-700 hover:scale-105"
  //             >
  //               <FaPen className="h-4 w-3.5" />
  //               Write
  //             </Link>

  //             {/* Profile Link */}
  //             <Link
  //               to="/profile"
  //               className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600"
  //             >
  //               <FaUserCircle className="h-5 w-5" />
  //               <span>{currentUser.username}</span>
  //             </Link>
  //           </>
  //         ) : (
  //           // Login Button
  //           <button
  //             onClick={() => navigate("/login")}
  //             className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
  //           >
  //             Login
  //           </button>
  //         )}
  //       </div>
  //     </div>
  //   </nav>
  // );

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-10 flex justify-between items-center h-16">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link
            to="/home"
            className="flex items-center space-x-2 transition duration-100 transform hover:scale-105"
          >
            <FaBookOpen className="h-6 w-6 text-indigo-600" />
            <span className="font-bold text-xl">TechBlog</span>
          </Link>
        </div>

        {/* Desktop Navbar Links */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/posts"
            className="text-gray-700 transition duration-100 transform hover:text-indigo-700 hover:scale-105"
          >
            Posts
          </Link>
          {currentUser ? (
            <>
              <Link
                to="/write"
                className="flex items-center gap-2 text-gray-700 transition duration-100 transform hover:text-indigo-700 hover:scale-105"
              >
                <FaPen className="h-4 w-3.5" />
                Write
              </Link>
              <Link
                to="/profile"
                className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600"
              >
                <FaUserCircle className="h-5 w-5" />
                <span>{currentUser.username}</span>
              </Link>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Login
            </button>
          )}
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-700 hover:text-indigo-700 focus:outline-none"
          >
            {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="flex flex-col items-center space-y-4 py-4">
            <Link
              to="/posts"
              onClick={toggleMenu}
              className="text-gray-700 transition duration-100 hover:text-indigo-700"
            >
              Posts
            </Link>
            {currentUser ? (
              <>
                <Link
                  to="/write"
                  onClick={toggleMenu}
                  className="flex items-center gap-2 text-gray-700 transition duration-100 hover:text-indigo-700"
                >
                  <FaPen className="h-4 w-3.5" />
                  Write
                </Link>
                <Link
                  to="/profile"
                  onClick={toggleMenu}
                  className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600"
                >
                  <FaUserCircle className="h-5 w-5" />
                  <span>{currentUser.username}</span>
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  toggleMenu();
                  navigate("/login");
                }}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );

};

export default Navbar;
