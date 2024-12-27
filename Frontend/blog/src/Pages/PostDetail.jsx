import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa"; // React Icons
import axios from "axios";

const PostDetail = () => {
  const { id } = useParams(); // Post ID from URL
  const [post, setPost] = useState(null); // State to store post details
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Login status
  const [newComment, setNewComment] = useState(""); // New comment text
  const [comments, setComments] = useState([]); // Post comments

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(token); // Check if user is logged in

    // Fetch post details
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/posts/get/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("response:", response.data);
        setPost(response.data);
        setComments(response.data.comments || []); // Set existing comments
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [id]);

// This will log the updated post after the state has been set
  useEffect(() => {
    console.log("Post Object:", post);
  }, [post])

  // Handle like and dislike button click
  const handleLike = async () => {
    try {
      const response = await axios.post(`http://localhost:4000/posts/like/${id}`);
      setPost((prevPost) => ({
        ...prevPost,
        likes: response.data.likes,  // Update like count
      }));
    } catch (error) {
      console.error("Error liking the post:", error);
    }
  };

  // Handle dislike button click
  const handleDislike = async () => {
    try {
      const response = await axios.post(`http://localhost:4000/posts/dislike/${id}`);
      setPost((prevPost) => ({
        ...prevPost,
        dislikes: response.data.dislikes,  // Update dislike count
      }));
    } catch (error) {
      console.error("Error disliking the post:", error);
    }
  };
  // Handle comment submission
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
  
    try {
      const token = localStorage.getItem("authToken");

      console.log("Token:", token);  // Log the token

      if (!token) {
        console.error("Auth token not found");
        return;
      }
  
      const response = await axios.post(
        `http://localhost:4000/posts/comments/${id}`,  // Correct route URL
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setComments([...comments, response.data]); // Update comments list
      setNewComment(""); // Clear input field
    } catch (error) {
      console.error("Error submitting comment:", error.response?.data || error.message);
      if (error.response) {
        // Log the full error response for debugging
        console.error("Error Response Data:", error.response.data);
        console.error("Error Response Status:", error.response.status);
        console.error("Error Response Headers:", error.response.headers);
      }
    }
  };  

  // const handleCommentDelete = async (commentId) => {
  //   try {
  //     const token = localStorage.getItem("authToken");
  //     if (!token) {
  //       console.error("Auth token not found");
  //       return;
  //     }

  //     // Send DELETE request to backend
  //     await axios.delete(
  //       `http://localhost:4000/posts/comments/${id}/${commentId}`,
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     // Update the comments list after deleting
  //     setComments(comments.filter((comment) => comment._id !== commentId));
  //   } catch (error) {
  //     console.error("Error deleting comment:", error.response?.data || error.message);
  //   }
  // };
    
  // const imageUrl = post?.image ? `http://localhost:4000/images/${post.image}` : null;
 
  const imageUrl = post?.imageUrl
  // console.log("Detail Image URL:", imageUrl);

  return (
    <div className="container mx-auto px-4 py-8">
      {post ? (
        <>
          {/* Post Image Section */}
          <div className="max-w-4xl mx-auto mb-6">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={post.title}
                className="w-full h-96 object-cover rounded-lg shadow-md"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 flex items-center justify-center text-gray-400 rounded-lg shadow-md">
                No Image Available
              </div>
            )}
          </div>

          {/* Post Title and Content */}
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-center">{post.title}</h1>
            <p className="text-gray-700 mb-6 text-center">{post.content}</p>

            {/* Post Metadata - Likes & Views */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <button
                className="flex items-center text-gray-700 hover:text-red-600 transition"
                onClick={handleLike}
              >
                <FaThumbsUp className="text-xl" />
                <span className="ml-1">{post.likes || 0}</span>
              </button>

              <button
                className="flex items-center text-gray-700 hover:text-blue-600 transition"
                onClick={handleDislike}
              >
                <FaThumbsDown className="text-xl" />
                <span className="ml-1">{post.dislikes || 0}</span>
              </button>

              <span className="text-gray-500">{post.views || 0} views</span>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Comments</h2>
            <ul className="space-y-4 mb-6">
              {comments.map((comment) => (
                <li key={comment._id || comment.createdAt} className="p-4 border rounded-lg">
                  <p className="text-gray-800">{comment.content}</p>
                  <span className="text-gray-500 text-sm">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>

            {/* Conditional Rendering for Comment Input */}
            {isLoggedIn ? (
              <div className="flex flex-col space-y-4">
                <textarea
                  className="border rounded-lg p-2 w-full"
                  rows="4"
                  placeholder="Add your comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button
                  onClick={handleCommentSubmit}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 w-full"
                >
                  Submit Comment
                </button>
              </div>
            ) : (
              <p className="text-gray-600">
                Login to add a comment.{" "}
                <Link to="/login" className="text-indigo-600 hover:underline">
                  Login
                </Link>
              </p>
            )}
          </div>
        </>
      ) : (
        <p>Loading post...</p>
      )}
    </div>
  );
};

export default PostDetail;


