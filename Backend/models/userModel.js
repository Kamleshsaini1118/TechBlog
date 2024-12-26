const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema( 
    {
        username: {
            type: String,
            required: true,
            unique: true,
            minLength: [5, 'Username must be atleast 5 characters']
        },
        email: {
            type: String,
            required: true,
            unique: true,
            minLength: [5, 'Email must be atleast 5 characters long']
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
        }
    },
     {
    timestamps: true
} )

// Password hashing before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password") && !this.isNew) return next(); // Only hash password if it's modified or new
  
    try {
      this.password = await bcrypt.hash(this.password, 10); // Adjust salt rounds as needed
      next();
    } catch (error) {
      next(error); // Proper error handling
    }
  });
  
  // Method: Check if password is correct
  userSchema.methods.isValidPassword = async function (enteredPassword) {
    try {
      return await bcrypt.compare(enteredPassword, this.password);
    } catch (error) {
      throw new Error("Error while comparing passwords");
    }
  };
  
  // Method: Generate Auth Token (JWT)
  
  // userSchema.methods.generateAuthToken = function () {
  //   try {
  //     const token = jwt.sign(
  //       { _id: this._id, username: this.username, role: this.role },
  //       process.env.JWT_SECRET,
  //       { expiresIn: "1h" } // Expiry time for the token
  //     );
  //     return token;
  //   } catch (error) {
  //     throw new Error("Error generating authentication token");
  //   }
  // };

  userSchema.methods.generateAuthToken = function () {
    try {
      // Generate access token with short expiration time (1 hour)
      const accessToken = jwt.sign(
        { _id: this._id, username: this.username, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" } // Expiry time for the access token
      );
  
      // Generate refresh token with longer expiration time (e.g., 7 days)
      const refreshToken = jwt.sign(
        { _id: this._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" } // Expiry time for the refresh token
      );
      
      return { accessToken, refreshToken };
    } catch (error) {
      throw new Error("Error generating authentication token");
    }
  };
  

const userModel = mongoose.model("User", userSchema)

module.exports = userModel;