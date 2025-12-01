const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (userId, email, role, name) => {
  return jwt.sign(
    {
      id: userId,
      email,
      role,
      name,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "1d" }
  );
};


const signup = async (req, res) => {
  try {
    console.log("=== SIGNUP ROUTE HIT ===");
    console.log("Request body:", req.body);
    const { name, email, password, phone, bloodType, dateOfBirth, gender } =
      req.body;

    if (
      !name ||
      !email ||
      !password ||
      !phone ||
      !bloodType ||
      !dateOfBirth ||
      !gender
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      bloodType,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      role: "user",
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully! Please login.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        password: newUser.hashedPassword,
        phone: newUser.phone,
        bloodType: newUser.bloodType,
        dateOfBirth: newUser.dateOfBirth,
        gender: newUser.gender,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    console.log("User found:", user.email);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id, user.email, user.role, user.name);

    // Set cookie with development-friendly settings
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
    });

    console.log("Token generated and cookie set");
    console.log("User logged in:", user.email);
    res.status(200).json({
      success: true,
      message: "Login successful",
      token: token, // Include token in response for easier testing
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bloodType: user.bloodType,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token");

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


const updateProfile = async (req, res) => {
  try {
    console.log("=== UPDATE PROFILE ROUTE HIT ===");

    
    const { bloodType, phone, dateOfBirth, gender, } = req.body;

    if (!bloodType && !phone && !dateOfBirth && !gender) {
      return res.status(400).json({
        success: false,
        message: "At least one field (bloodType, phone, dateOfBirth, or gender) is required to update",
      });
    }

    

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        ...(bloodType && { bloodType }),
        ...(phone && { phone }),
        ...(dateOfBirth && { dateOfBirth }),
        ...(gender && { gender }),

      },
      { new: true, select: "-password" }
    );

    console.log("User update result:", updatedUser ? "✅ SUCCESS" : "❌ FAILED");

    if (!updatedUser) {
      console.log("❌ User not found in database for ID:", req.user.id);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

   
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
    console.log("✅ Profile update response sent");
  } catch (error) {
    console.error("❌ Update profile error:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const authCheck = async (req, res) => {
  try {
    // If middleware passes, user is authenticated
    res.status(200).json({
      success: true,
      authenticated: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        name: req.user.name,
      },
    });
  } catch (error) {
    console.error("Auth check error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  login,
  signup,
  logout,
  updateProfile,
  authCheck,
  generateToken,
 

};
