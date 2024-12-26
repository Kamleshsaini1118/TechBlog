const { default: mongoose } = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true
        },

        slug: {
            type: String,
            required: false,
        },

        content: {
            type: String,
            required: true
        },

        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to User model
            required: true
        },

        category: {
            type: [String], // Example: "Tech", "Lifestyle"
            default: []
        },

        tags: {
            type: [String], // Example: "React", "Next.js"
            default: []
        },

        likes: {
            type: Number,
            default: 0
        },
        
        dislikes: {
            type: Number,
            default: 0
        },

        views: {
            type: Number,
            default: 0
        },

        imageUrl: {
            type: String,
            default: "" // Optional field for post image
        },

        comments: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },
                content: {
                    type: String,
                    required: true
                },
                createdAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],

        isDeleted: {
            type: Boolean,
            default: false
        },

        viewedBy: {
            type: [mongoose.Schema.Types.ObjectId], // Array to store user IDs
            ref: "User",
            default: []
        }
    },
    
    {
        timestamps: true 
    }
);

const PostModel = mongoose.model("Post", postSchema);

module.exports = PostModel;
