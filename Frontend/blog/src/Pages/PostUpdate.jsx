import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const UpdatePost = () => {
  const [post, setPost] = useState({ title: "", content: "", image: "", tags: [] });
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null); // For image upload
  const [tags, setTags] = useState(""); // To hold tag input
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          toast.error("You need to login first.");
          navigate("/login");
          return;
        }

        const response = await axios.get(`http://localhost:4000/posts/get/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPost(response.data);
        setTags(response.data.tags.join(", ")); // Convert tags array to comma-separated string
      } catch (error) {
        console.error("Error fetching post:", error);
        toast.error("Failed to load post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", post.title);
    formData.append("content", post.content);
    formData.append("tags", tags.split(",").map((tag) => tag.trim())); // Split tags into an array
    if (image) {
      formData.append("image", image); // Append image if uploaded
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("You need to login first.");
        navigate("/login");
        return;
      }

      const response = await axios.put(
        `http://localhost:4000/posts/update/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response from server:", response.data);

      toast.success("Post updated successfully", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      navigate(`/posts/get/${id}`);
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post.");
    }
  };

    // Constructing the image URL path based on the assumption that the image is saved in 'public/images'
    // const imageUrl = image ? `http://localhost:4000/images/${image}` : null;
    // console.log("Constructed Image URL:", imageUrl);

    // const image1 = post.image;
    // console.log("update mein image", image1);
    

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-lg p-8">
        <h1 className="text-2xl font-semibold text-center mb-6">Update Post</h1>
        <form onSubmit={handleUpdate}>
          {/* Title Field */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              placeholder="Enter post title"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Content Field */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="content">
              Content
            </label>
            <textarea
              id="content"
              value={post.content}
              onChange={(e) => setPost({ ...post, content: e.target.value })}
              placeholder="Enter post content"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="6"
              required
            />
          </div>

          {/* Image Field */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="image">
              Upload Image
            </label>
            <input
              id="image"
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {image && (
              <p className="mt-2 text-sm text-gray-500">{image.name}</p>
            )}
          </div>

          {/* Tags Field */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="tags">
              Tags (comma separated)
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Enter tags"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300"
            >
              {loading ? "Updating..." : "Update Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePost;
