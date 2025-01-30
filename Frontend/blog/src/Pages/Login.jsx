import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Default role
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); 

  // const API_URL = process.env.REACT_APP_API_URL;

  const API_URL = process.env.REACT_APP_API_URL;
  console.log("API_URL:", API_URL);


  // console.log("api_url:", API_URL)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // loading start

    try {
      if (isLogin) {
        // Login request to the backend
        console.log("Request Payload:", { email, password });
        const response = await axios.post(`${API_URL}/users/login` , {
          email,
          password,
        },{ withCredentials: true } 
      );

        console.log("Response from backend:", response.data);

        const { accessToken, username, role } = response.data;
        console.log("Access Token:", accessToken); 

         // Store token in localStorage
        localStorage.setItem("authToken", accessToken);

        // Optionally store username and role for UI purposes
        localStorage.setItem(
          "currentUser",
          JSON.stringify({ username, email, role })
        );

      
        toast.success("Login successful!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          });
          
        navigate("/home");

        // Reload the page to ensure navbar updates dynamically
        setTimeout(() => {
          setLoading(false); // Stop loading
          window.location.reload(); // Reload the page
        }, 2000); 
        
      } else {
        // Register request to the backend
        const response = await axios.post(
          `${API_URL}/users/register`,
          {
            username,
            email,
            password,
            role,
          }, { withCredentials: true }
        );

        const newUser = response.data;
        localStorage.setItem("currentUser", JSON.stringify(newUser));
        toast.success("Account created successfully!");
        navigate("/");
      }
    } catch (err) {
      console.log("Error caught:", err);
      const errorMessage =
        err.response?.data?.message || "Something went wrong!";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="mt-10 max-w-md mx-auto bg-white rounded-lg shadow-2xl p-6 z-10 ">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <>
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
{/* 
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                </select>
              </div> */}
            </>
          )}

          {/* {isLogin && (
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          )} */}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            disabled={loading} // disable button while loading
          >
            {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-600 hover:text-indigo-700"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>

      {/* Toast Container to display notifications */}
      {/* <ToastContainer /> */}
    </div>
  );
}
