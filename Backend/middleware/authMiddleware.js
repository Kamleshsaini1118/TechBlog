// const errorHandler = require("../utils/errorHandler");
// const apiResponse = require("../utils/apiResponse");
// const jwt = require("jsonwebtoken");
// const User = require("../models/userModel");

// const authMiddleware = async (req, res, next) => {
//   try {
//     //1. First, try to get the token from the cookies or the Authorization header
//     const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
//     // console.log("token: ", token)

//     //2. If no token is provided, throw an unauthorized error
//     if (!token) {
//       console.log("No token found in cookies or header");
//       throw new errorHandler(401, "Unauthorized request: No token provided.");
//     }

//     // console.log("Received Token:", token);

//     //3. Verify the JWT token
//     const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

//     // console.log("Decoded Token:", decodedToken);

//     //4. Find the user associated with the token's decoded ID, excluding sensitive fields like password
//     const user = await User.findById(decodedToken?._id).select("-password");

//     //5. If no user is found with the decoded ID, the token is invalid
//     if (!user) {
//       throw new errorHandler(401, "Invalid Access Token");
//     }

//     //6. Attach the user to the request object for access in subsequent route handlers
//     req.user = user;

//     //7. Proceed to the next middleware or route handler
//     next();
//   } catch (error) {
//     //8. If any error occurs (e.g., invalid token or expired token), throw an unauthorized error
//     console.error("Error in authMiddleware:", error);
//     throw new errorHandler(401, error?.message || "Invalid access token");
//   }
// };

// module.exports = authMiddleware;


// const jwt = require("jsonwebtoken");
// const User = require("../models/userModel");
// const errorHandler = require("../utils/errorHandler");

// const authMiddleware = async (req, res, next) => {
//   try {
//     // 1. Get the access token from cookies or Authorization header
//     const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

//     // console.log("Cookies:", req.cookies);
//     // console.log("Authorization Header:", req.header("Authorization"));

//     // console.log("token: ", token)
//     // 2. If no token is found, throw error
//     if (!token) {
//       console.log("No token found in cookies or header");
//       throw new errorHandler(401, "Unauthorized request: No token provided.");
//     }

//     // 3. Verify the access token
//     const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

//     // 4. Find the user associated with the decoded token's ID
//     const user = await User.findById(decodedToken?._id).select("-password");

//     if (!user) {
//       throw new errorHandler(401, "Invalid Access Token");
//     }

//     // 5. Attach the user to the request object
//     req.user = user;

//     // 6. Proceed to the next middleware or route handler
//     next();
//   } catch (error) {
//     console.error("Error in authMiddleware:", error);

//     // If token has expired, try refreshing the token
//     if (error.name === "TokenExpiredError") {
//       console.log("Access token expired, trying to refresh...");

//       // Get refresh token from cookies
//       const refreshToken = req.cookies?.refreshToken;

//       if (!refreshToken) {
//         throw new errorHandler(401, "No refresh token found");
//       }

//       // Verify refresh token
//       try {
//         const decodedRefreshToken = jwt.verify(refreshToken, process.env.JWT_SECRET);

//         // Find the user associated with the refresh token's decoded ID
//         const user = await User.findById(decodedRefreshToken._id);

//         if (!user) {
//           throw new errorHandler(401, "Invalid refresh token");
//         }

//         // Generate new access token
//         const { accessToken, refreshToken: newRefreshToken } = user.generateAuthToken();

//         // Set new access and refresh token in cookies
//         res.cookie("accessToken", accessToken, {
//           httpOnly: true,
//           secure: process.env.NODE_ENV === "production",
//           maxAge: 60 * 60 * 1000, // 1 hour expiration
//         });

//         res.cookie("refreshToken", newRefreshToken, {
//           httpOnly: true,
//           secure: process.env.NODE_ENV === "production",
//           maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiration
//         });

//         // Retry the request with the new access token
//         req.user = user;  // Reattach user to the request object
//         return next();
//       } catch (refreshError) {
//         console.error("Error verifying refresh token:", refreshError);
//         throw new errorHandler(401, "Invalid or expired refresh token");
//       }
//     }

//     throw new errorHandler(401, error?.message || "Invalid access token");
//   }
// };

// module.exports = authMiddleware;


const errorHandler = require("../utils/errorHandler");
const apiResponse = require("../utils/apiResponse");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Get the token from cookies or Authorization header
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      console.log("No token found in cookies or header");
      throw new errorHandler(401, "Unauthorized request: No token provided.");
    }

    // 2. Verify the token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        // Token has expired
        console.error("Error: Token has expired.");
        return res.status(401).json(
          new apiResponse(false, "Access token has expired. Please login again.")
        );
      } else {
        // Other JWT errors
        console.error("JWT Verification Error:", error);
        throw new errorHandler(401, "Invalid access token.");
      }
    }

    // 3. Find the user associated with the token
    const user = await User.findById(decodedToken?._id).select("-password");
    if (!user) {
      throw new errorHandler(401, "Invalid Access Token");
    }

    // 4. Attach the user to the request object
    req.user = user;

    // 5. Proceed to the next middleware
    next();
  } catch (error) {
    // Log and respond to any other errors
    console.error("Error in authMiddleware:", error);
    return res.status(error.statusCode || 500).json(
      new apiResponse(false, error?.message || "Unauthorized request.")
    );
  }
};

module.exports = authMiddleware;
