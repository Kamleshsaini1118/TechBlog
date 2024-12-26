import React, { useState, useEffect } from 'react';
import { FaArrowRight, FaStar } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import PostCard from '../components/PostCard'; // Assuming PostCard component is used for each post

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track user login status
  const [posts, setPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);

  // Check login status and fetch posts based on user login
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true); // User is logged in
      fetchPosts(token); // Fetch all posts
    } else {
      setIsLoggedIn(false); // User is not logged in
    }
  }, []);

  // Function to fetch all posts from the backend
  const fetchPosts = async (token) => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:4000/posts/get', {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log("All posts:", response.data); // Debugging line to check API response structure
      setPosts(response.data);
      filterUserPosts(response.data, token); // Filter posts based on logged-in user
    } catch (error) {
      console.error("Error fetching posts", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to filter posts for the logged-in user
  const filterUserPosts = (allPosts, token) => {
    try {
      // Log the token to check if it's valid
      // console.log("JWT Token:", token);
  
      // Decode the token payload and log it for debugging
      const decodedToken = atob(token.split('.')[1]);
      // console.log("Decoded Token Payload:", decodedToken);
  
      const userId = JSON.parse(decodedToken)._id; // Extract userId from decoded token
      // console.log("Decoded User ID:", userId); // Check if userId exists
  
      if (!userId) {
        console.error("User ID is not present in the token payload.");
        return;
      }
  
      // Filter posts for logged-in user based on authorId._id
      const filteredPosts = allPosts.filter(post => post.authorId._id === userId);
      // console.log("Filtered Posts:", filteredPosts); // Check filtered posts
  
      setUserPosts(filteredPosts); // Set filtered posts for the logged-in user
    } catch (error) {
      console.error("Error filtering posts:", error);
    }
  };
  

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/login'); // Navigate to login page
    }, 1000);
  };

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="h-16 w-16 border-8 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <section className="flex flex-col items-center justify-center mt-12">
            {isLoggedIn ? (
              <div className=" items-center justify-center gap-8 mx-10 my-8">
                <h1 className="text-4xl text-gray-700 font-bold mb-5 text-center">Your Blog Posts</h1>
                <div className='flex items-center justify-center'>
                  <div className="w-96 border-t border-gray-400 mb-8 mx-4 "></div>
                  <FaStar className='h-5 w-5 mb-8' />
                  <div className="w-96 border-t border-gray-400 mb-8 mx-4 "></div>
                </div>
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8'>
                    {userPosts.length > 0 ? (
                      userPosts.map((post) => (
                        <PostCard key={post._id} post={post} />
                      ))
                    ) : (
                      <p className="text-center text-gray-500">You haven't created any posts yet.</p>
                    )}
                  </div>
              </div>
            ) : (
              <>
                <div className="text-5xl text-gray-700 font-light leading-relaxed text-center">
                  <h1>Publish your passions, your way</h1>
                </div>
                <div className="text-2xl mt-4 text-center">
                  <p>Create a unique and beautiful blog easily.</p>
                </div>
                <div className="m-10">
                  <button
                    onClick={handleClick}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
                  >
                    CREATE YOUR BLOG
                  </button>
                </div>
              </>
            )}
          </section>

          {/* Second Section with PostCard for logged-in user */}
          {/* <section className="items-center justify-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-10 my-14">
            {userPosts.length > 0 ? (
              userPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))
            ) : (
              <div className="text-center text-gray-500">No posts to display.</div>
            )}
          </section> */}

          <div className="text-center mb-10">
            <Link
              to="/posts"
              className="inline-flex items-center space-x-2 text-indigo-600 transition duration-75 hover:text-indigo-800 text-lg hover:scale-105"
            >
              <span>View all posts</span>
              <FaArrowRight className="h-4 w-4" /> 
            </Link>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
