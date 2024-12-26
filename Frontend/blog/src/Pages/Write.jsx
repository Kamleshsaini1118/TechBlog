import React, { useState } from "react";
import axios from "axios";
import ReactQuill from "react-quill"; // Rich Text Editor
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import { toast } from "react-toastify";

// Helper function to strip HTML tags
const stripHtmlTags = (html) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

const WritePage = () => {
  const [title, setTitle] = useState(""); // State for title
  const [content, setContent] = useState(""); // State for content (rich text)
  const [tags, setTags] = useState(""); // State for tags
  const [image, setImage] = useState(null); // State for image file
  const [loading, setLoading] = useState(false); // Loading state for submission

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert HTML content to plain text
    const plainTextContent = stripHtmlTags(content);

    // Prepare form data
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", plainTextContent); // Use plain text content
    formData.append(
      "tags",
      tags.split(",").map((tag) => tag.trim()) // Convert comma-separated tags to array
    );
    formData.append("image", image);

    try {
      setLoading(true); // Set loading to true before making the request
      const response = await axios.post("http://localhost:4000/posts/create", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "multipart/form-data", // Set Content-Type to multipart/form-data
        },
      });

      if (response.status === 201) {
        toast.success("Post created successfully" ,{
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });

        // Reset form fields
        setTitle("");
        setContent("");
        setTags("");
        setImage(null);
      } else {
        toast.error("Unexpected error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      // Handle error response (e.g., network issue or backend error)
      const errorMessage =
        error.response?.data?.message || "Something went wrong while creating the post.";
      toast.error(errorMessage);
    } finally {
      setTimeout(() => {
          setLoading(false); // Stop loading
          window.location.reload(); // Reload the page
        }, 1500); // Set loading to false after request completion
    }
  };

  // Handle image change
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    // setImage(selectedImage);
  };

   // Create an object URL for the selected image to show the preview
   const imagePreviewUrl = image ? URL.createObjectURL(image) : null;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Write a New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-lg font-medium">
            Post Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Enter the title of your post"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="block text-lg font-medium">
            Post Content
          </label>
          <ReactQuill
            value={content}
            onChange={setContent}
            className="w-full border border-gray-300 rounded-md"
            placeholder="Write your post content here"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="tags" className="block text-lg font-medium">
            Tags (comma separated)
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Enter tags separated by commas"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="image" className="block text-lg font-medium">
            Post Image
          </label>
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />

          {/* Show image preview if image is selected */}
          {imagePreviewUrl && (
            <div className="mt-4">
              <img
                src={imagePreviewUrl}
                alt="Selected Preview"
                className="max-w-full h-64 object-cover"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className={`w-full ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          } text-white py-2 rounded-md`}
          disabled={loading}
        >
          {loading ? "Publishing..." : "Publish Post"}
        </button>
      </form>
    </div>
  );
};

export default WritePage;
