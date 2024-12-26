const multer = require("multer");
const path = require("path");

// Configure storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,  path.join(__dirname, '../public/images')); // Directory to save uploaded files 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9); // Unique identifier for files
    const extension = path.extname(file.originalname); // Extract file extension
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`); // Final filename
  },
});

// File type validation
const fileFilter = function (req, file, cb) {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed."), false); // Reject the file
  }
};

// Initialize multer instance
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB size limit
  fileFilter: fileFilter,
});

module.exports = upload;
