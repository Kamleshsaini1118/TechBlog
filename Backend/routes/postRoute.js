const express = require("express");
const router = express.Router();
const Post = require("../models/postModel");
const authMiddleware = require("../middleware/authMiddleware")
const upload = require("../middleware/multerMiddleware"); // Import multer middleware

// IMPORT CONTROLLER
const { createPost, getAllPosts, updatePost, deletePost } = require("../controllers/postController")

// create the endpoints for curd operation on post
router.post("/create", authMiddleware, upload.single("image"),  createPost);
router.get("/get", authMiddleware, getAllPosts);
router.put("/update/:id", authMiddleware, upload.single("image"), updatePost)
router.delete("/delete/:id", authMiddleware, deletePost)

router.get("/get/:id", authMiddleware, async (req, res) => {
    try {
      const postId = req.params.id;
      const userId = req.user.id; // Authenticated user's ID
      const post = await Post.findById(postId);

      console.log("post:", post)
  
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      // Increment view count if user hasn't visited before
      const hasViewed = post.viewedBy.includes(userId);
      if (!hasViewed) {
        post.views += 1;
        post.viewedBy.push(userId); // Assuming post model has a `viewedBy` array
        await post.save();
      }
  
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ message: "Error fetching post", error });
    }
  });
  
router.post("/comments/:id", authMiddleware, async (req, res) => {
  try {
    const postId = req.params.id;
    const { text } = req.body;
    const userId = req.user._id;  // Assuming user is authenticated and `req.user` contains user data

    // Find the post by ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Create a new comment object with userId
    const comment = {
      userId,    // Storing the user who added the comment
      content: text,      // The comment text
      createdAt: new Date(),  // Timestamp of comment creation
    };

    // Push the new comment into the post's comments array
    post.comments.push(comment);

    // Save the post with the new comment
    await post.save();

    // Return the newly created comment
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error });
  }
});

// Delete Comment Route
router.delete("/comments/:postId/:commentId", authMiddleware, async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user._id; // Extracted from authMiddleware

    // Find the post containing the comment
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found." });

    // Find the comment within the post
    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found." });

    // Check if the logged-in user is the owner of the comment
    if (comment.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You are not authorized to delete this comment." });
    }

    // Remove the comment
    comment.remove();
    await post.save();

    res.status(200).json({ message: "Comment deleted successfully." });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Failed to delete comment.", error: error.message });
  }
});

// Like a post
router.post('/like/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send("Post not found");

    // Increment like count
    post.likes += 1;

    await post.save();
    res.status(200).json({ likes: post.likes });  // Return updated like count
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Dislike a post
router.post('/dislike/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send("Post not found");

    // Increment dislike count
    post.dislikes += 1;

    await post.save();
    res.status(200).json({ dislikes: post.dislikes });  // Return updated dislike count
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;