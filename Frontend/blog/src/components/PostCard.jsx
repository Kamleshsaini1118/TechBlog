import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export default function PostCard({ post, onPostDeleted, onPostUpdated }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // console.log("post in card:", post)
  if (!post) {
    return <div className="text-red-500">Invalid Post Data</div>;
  }

  const {
    _id: id, // Assuming the post object contains a unique ID
    title,
    content,
    tags = [],
    imageUrl,
    views = 0,
    likes = 0,
    dislikes = 0,
    createdAt,
    authorId = {},
  } = post;

  const token = localStorage.getItem("authToken"); // Get JWT token

  const handleReadMore = () => {
    if (!id) {
      console.error("Post ID is undefined!");
      return;
    }

    const token = localStorage.getItem('authToken');

    if (!token) {
      toast.error("Please login to read the blog!");
      navigate("/login");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(`/posts/get/${id}`);
    }, 1500);
  };

  const handleDelete = async () => {
    if (!token) {
      toast.error("Please login to delete the blog!");
      navigate("/login");
      return;
    }
  
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;
  
    try {
      setLoading(true); // Start loading
      await axios.delete(`http://localhost:4000/posts/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token for authentication
        },
      });
  
      // Show success notification
      toast.success("Post deleted successfully!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
  
      // Reload the window after deletion
      setTimeout(() => {
        window.location.reload();
      }, 1500); // Delay of 1 second before reloading (optional for smooth UX)
  
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete the post. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };
  
  const handleUpdate = () => {
    if (!token) {
      toast.error("Please login to update the blog!");
      navigate("/login");
      return;
    }

    navigate(`/posts/update/${id}`); // Navigate to the edit page with the post ID
  };

  // const imageUrl = image ? `http://localhost:4000/images/${image}` : null;

 
  const image = post?.imageUrl;

  // console.log("POST card imageUrl:", image);

  return (
    <div className="relative max-w-sm bg-white rounded-lg shadow-md hover:shadow-2xl overflow-hidden border border-gray-300 mx-12 mb-16 transition duration-75 transform hover:scale-105 flex flex-col min-h-[500px]">
      {/* Loading Spinner */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="h-16 w-16 border-8 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Post Image */}
      {image ? (
        <img src={image} alt={post.title} className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
          No Image Available
        </div>
      )}

      {/* Post Content */}
      <div className="p-4 space-y-4 flex flex-col justify-between flex-grow">
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-indigo-100 text-indigo-600 text-xs font-medium px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800 truncate">{title}</h2>

        {/* Author */}
        <p className="text-gray-500 text-sm">
          By: <span className="font-medium">{authorId.username || "Unknown"}</span>
        </p>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm line-clamp-3">
          {content.length > 100 ? `${content.slice(0, 100)}...` : content}
        </p>

        {/* Metadata */}
        <div className="flex justify-between items-center text-gray-500 text-xs">
          <span>{new Date(createdAt).toLocaleDateString()}</span>
          <span>{views} views • {likes} likes • {dislikes} dislikes</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 flex gap-4">
        <button
          onClick={handleReadMore}
          className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          Read More
        </button>

        <button
          onClick={handleUpdate}
          className="flex-1 bg-yellow-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors"
        >
          Update
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
