import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); 
  

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Clear user data
    localStorage.removeItem("currentUser"); // Clear user data

    toast.success("Logout successful!", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
    });

    navigate("/"); // Redirect to homepage

    setTimeout(() => {
      setLoading(false); // Stop loading
      window.location.reload(); // Reload the page
    }, 2000); 
  };

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  return (
    <div className="container mx-auto mt-10 p-6 max-w-md bg-white shadow-xl border border-gray-500 rounded-lg flex flex-col items-center justify-center">
      <h2 className="text-gray-600 text-2xl font-semibold text-center ">Profile</h2>

      <div className="w-full border-t border-gray-400 mt-4 mb-2 mx-6"></div>

      <div className="mt-4 text-center leading-8">
        <p>
          <strong>Username:</strong> {currentUser?.username || "N/A"}
        </p>
        <p>
          <strong>Email:</strong> {currentUser?.email || "N/A"}
        </p>
        <p>
          <strong>Role:</strong> {currentUser?.role || "N/A"}
        </p>
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
