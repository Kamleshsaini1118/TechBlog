const User = require("../models/userModel")
const errorHandler = require("../utils/errorHandler");
const apiResponse = require("../utils/apiResponse");

const generateAccessandRefreshToken = async (userId) => {
    try {
      // First, find the user by ID
      const user = await User.findById(userId);
      if (!user) throw new apiError(404, "User not found");
  
      // Generate access token and refresh token using the generateAuthToken method
      const { accessToken, refreshToken } = user.generateAuthToken();
  
      console.log("Access Token: ", accessToken);
      console.log("Refresh Token: ", refreshToken);
  
      // Store the refresh token in the user's record (usually for future use)
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false }); // No validation to avoid circular validation with refresh token
  
      // Return both access and refresh tokens
      return { accessToken, refreshToken };
    } catch (error) {
      throw new apiError(500, "Something went wrong while generating access and refresh tokens");
    }
  };
  
// REGISTER THE USER 
const registerUser = async (req, res) => {
    // 1. Find the user (get detail form frontend)
    // 2. Check user valid or not by email
    // 3. Check user already exits or not !
    // 4. Create the object or entry in DB
    // 5. Check user created or not 
    // 6. Send the response

    // step - 1.
    const { username, email, password, role } = req.body;
    console.log("email: ", email);

    // step - 2.
    if(
        [username, email, password, role].some((field) => (field)?.trim() === "")
    ){
        throw new errorHandler(400, "All fields are required.")
    }

    // step - 3.
    const existedUSer = await User.findOne({
        $or: [{ username }, { email }] // $OR OPERATOR USE FOR MONGODB AGER MYSQL USE KRNA H TO SEQUELIZE KA USE KAREEN
    })
    if(existedUSer){
        throw new errorHandler(409, "User with email or username already exists")
    }

    // step - 4.
    const user = await User.create({
        username,
        email,
        password,
        role
    })

    // step - 5.
    const createdUser = await User.findById(user._id).select( " -password " )

    if(!createdUser){
        throw new errorHandler(500, "Something went wrong while registering the user")
    }

    // step - 6.
    return res.status(200).json(
        new apiResponse(200, createdUser, "User registered successfully")
    )
}

// LOGIN USER
const loginUser = async (req, res) => {
    // 1. GETING THE USER DETAIL
    // 2. LOGIN WITH USERNAME OR EMAIL
    // 3. FIND USER BY USERNAME OR EMAIL (CHECK USER EXISTS OR NOT, IF NOT THEN THROW A ERROR)
    // 4. PASSWORD CHECK 
    // 5. ASSIGN THE TOKEN 
    // 6. SEND COOKIES
    // 7. RETURN RESPONSE       

    // step - 1
    const { username, email, password } = req.body;
    console.log("username: " ,username);
    console.log("email:", email);

    // step - 2
    if(!(username || email)){
        throw new errorHandler(400, "usernmae or email is required.")
    }
    console.log("username: " ,username);
    console.log("email:", email);

    // step - 3
    const user = await User.findOne({
        $or : [ {username}, {email} ]
    })

    console.log("user found: ", user);

    if (!user) {
        throw new errorHandler(404, "User does not exists.")
    }

    // step - 4
    const passCorrect = await user.isValidPassword(password);

    if(!passCorrect){
        throw new errorHandler(400, "Invalid user credentials.")
    }
    
    // step - 5 
    // const token = user.generateAuthToken();

    const {accessToken, refreshToken} = await generateAccessandRefreshToken(user._id);

    const loggedInUser =await User.findById(user._id).select("-password  -refreshToken");

    // step - 6
    const options = {
        httpOnly: true,
        // secure: true
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + 3600000)
    }

    // step - 7
    res.cookie("accessToken", accessToken, options)
    res.cookie("refreshToken", refreshToken, options)
    return res.status(200).send({ loggedInUser, accessToken, refreshToken, username: user.username, role: user.role });


    // return res
    //     .status(200)
    //     .cookie("accessToken", accessToken, options)
    //     .cookie("refreshToken", refreshToken, options)   
    //     .json(
    //         new apiResponse(
    //             200,
    //             {
    //                 user: loggedInUser, accessToken, refreshToken , 
    //                 username: user.username, role: user.role
    //             },
    //             "User logged in Successfully"  
    //         )
    //     )
}    

// LOGOUT THE USER
const logoutUser = async (req, res) => {
    // 1. FIRST WRAP IN TRY-CATCH BLOCK
    // 2. CLEAR THE COOKIES FIRST
    // 3. SEND THE SUCCESSFULLY RESPONSE 

    // try {
    //     // Clear the authentication token cookie
    //     res.clearCookie("authToken", {
    //         httpOnly: true, // Ensure the cookie cannot be accessed by JavaScript
    //         secure: process.env.NODE_ENV === "production" // Use secure cookies in production
    //     });

    //     return res.status(200).json(
    //         new apiResponse(200, null, "User logged out successfully")
    //     );
    // } catch (error) {
    //     return res.status(error.statusCode || 500).json(
    //         new apiResponse(error.statusCode || 500, null, error.message || "Internal Server Error")
    //     );
    // }

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "User logged out"))
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser
}