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
      const post = await Post.findById(postId);
  
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      const comment = { text, createdAt: new Date() };
      post.comments.push(comment);
      await post.save();
  
      res.status(200).json(comment);
    } catch (error) {
      res.status(500).json({ message: "Error adding comment", error });
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