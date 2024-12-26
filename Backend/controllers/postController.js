const Post = require("../models/postModel");
const errorHandler = require("../utils/errorHandler")
const apiResponse = require("../utils/apiResponse");
const mongoose = require("mongoose")
const { uploadOnCloudinary } = require("../utils/cloudinary.js");
const fs = require('fs');
const path = require('path');
const upload = require('../middleware/multerMiddleware');

// POST CONTROLLER MEIN POST CREATE KRNE HAIN, UPDATE KARNE HAIN, READ KARNE HAIN, OR DELETE KARNE HAIN OR FR UNKE ROUTES LHIKNE HAIN IN POSTROUTES.

// CREATE POSTS
const createPost = async (req, res) => { 
  try {
    const { title, content, category, tags, publishDate } = req.body;
    const authorId = req.user._id;

    if (!title || !content || !authorId) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Handle image upload
    let imageURL = null;
    if (req.file) {
      const uploadResponse = await uploadOnCloudinary(req.file.path); // Pass the local file path
      console.log(uploadResponse)
      if (uploadResponse) {
        imageURL = uploadResponse.secure_url; // Use the URL provided by Cloudinary
      }
    }

    const newPost = new Post({
      title,
      content,
      authorId,
      imageURL, // Save the uploaded image URL
      category: category || [],
      tags: tags || [],
      slug: title.toLowerCase().replace(/\s+/g, "-"),
      likes: 0,
      dislikes: 0,
      views: 0,
      publishDate: publishDate || new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedPost = await newPost.save();

    return res.status(201).json({ success: true, message: "Post created successfully", savedPost });
  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json({ success: false, message: "Failed to create post." });
  }
};

// READ THE ALL POSTS
const getAllPosts = async (req, res) => {
    // WRAP IN TRY CATCH BLOCK FOR ASYNCRONIZE CODE
    // 1. FETCH THE ALL DATA FROM THE DATABASE
    // 2. CHECK POST AVAIBLE OR NOT ! [badme]
    // 3. SEND THE RESPONSE

    try {
        const posts = await Post.find({ isDeleted: false }).populate('authorId', 'username');
        if (!posts || posts.length === 0) {
          return res.status(404).json({ message: 'No posts found' }); // Return 404 if no posts
        }
        return res.status(200).json(posts)
    } catch (error) {
        return res.status(500).json({ message: 'Failed to retrieve posts' });
    }
}

// UPDATED POST 
const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;  // Authenticated user ID
    const { title, content, tags } = req.body;  // Title, content, and tags from request body
    // let imageUrl = req.file ? `images/${req.file.filename}` : null;  // Handle image URL if uploaded

    let imageUrl = req.file ? `http://localhost:4000/images/${req.file.filename}`: null ;
    console.log("Constructed Image URL:", imageUrl);


    // Validate post ID format
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    // Find the post by ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the logged-in user owns the post
    // if (post.user.toString() !== userId) {
    //   return res.status(403).json({ message: "You do not have permission to update this post" });
    // }

    // Update post fields (title, content, image, tags)
    post.title = title || post.title;
    post.content = content || post.content;
    post.imageUrl = imageUrl || post.imageUrl;  // Update image if uploaded
    post.tags = tags ? tags.split(",").map(tag => tag.trim()) : post.tags;  // Update tags if provided

    // Save the updated post
    const updatedPost = await post.save();

    // console.log("Updated Post:", updatedPost);

    // Send success response
    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating post",
      error: error.message,
    });
  }
};

// DELETE POST
// const deletePost = async (req, res) => {
//   const postId = req.params.id;
//   const userId = req.user.id;

//   if(!mongoose.Types.ObjectId.isValid(postId)){
//     return res.status(400).json({ message: "Invalid post ID." })
//   }

//   const post = await Post.findById(postId);

//   if (!post) {
//     return res.status(404).json(new apiResponse(false, "Post not found."));
//   }

//   if (post.user && post.user.toString() !== userId) {
//     return res
//       .status(403)
//       .json(
//         new apiResponse(false, "You do not have permission to update this post")
//       );
//   }  

//   // await post.remove();
//   await Post.findByIdAndDelete(postId);

//   return res.status(200).json(
//     new apiResponse(true, "Post deleted successfully.")
//   )
// }


const deletePost = async (req, res) => {
  try {
    const postId = req.params.id; // Post ID from the route parameter
    const userId = req.user.id;  // User ID from the authenticated user

    // Validate if postId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res
        .status(400)
        .json(new apiResponse(false, "Invalid post ID."));
    }

    // Find the post by ID
    const post = await Post.findById(postId);

    // If post does not exist, return 404
    if (!post) {
      return res
        .status(404)
        .json(new apiResponse(false, "Post not found."));
    }

    // Check if the user has permissions to delete the post
    if (post.user && post.user.toString() !== userId) {
      return res
        .status(403)
        .json(
          new apiResponse(false, "You do not have permission to delete this post.")
        );
    }

        // Delete the associated image if exists (assuming it's stored locally)
        if (post.imageUrl) {
          const imagePath = path.join(__dirname, 'uploads', post.imageUrl); // Adjust the path as per your image storage location
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath); // Delete the image file
          }
        }

    // Delete the post
    await Post.findByIdAndDelete(postId);

    // Send success response
    return res
      .status(200)
      .json(new apiResponse(true, "Post deleted successfully."));
  } catch (error) {
    console.error("Error deleting post:", error);

    // Handle unexpected errors
    return res
      .status(500)
      .json(new apiResponse(false, "An error occurred while deleting the post."));
  }
};

module.exports = {
    createPost,
    getAllPosts,
    updatePost,
    deletePost
}

