const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

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

    console.log("User found:", user.email, user.hashedPassword);

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
// Reset Password Controller
 const resetPassword = async (req, res, next) => {
  const { id, token, password } = req.body;

  try {
    if (!id || !token || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(400).json({ message: "User not exists!" });
    }

    const secret = process.env.JWT_SECRET + user.password;

    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('❌ Reset Password Error:', error.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Request Password Reset Controller
const requestPasswordReset = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User doesn't exist" });

    const secret = process.env.JWT_SECRET + user.password;
    const token = jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: '1h' });

    const frontendURL = process.env.NODE_ENV === 'production' 
      ? 'https://blood-donation-frontend-cnw5ksfaf-raj675592s-projects.vercel.app' 
      : 'http://localhost:3000';
    const resetURL = `${frontendURL}/resetpassword?id=${user._id}&token=${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      replyTo: 'noreply@blooddonation.com',
      subject: 'Blood Donation Management - Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc143c;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>You are receiving this email because you (or someone else) have requested to reset the password for your account.</p>
          <p>Please click on the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetURL}" style="background-color: #dc143c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="color: #666; word-break: break-all;">${resetURL}</p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">This link will expire in 1 hour.</p>
          <p style="color: #999; font-size: 12px;">If you did not request this, please ignore this email and your password will remain unchanged.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 11px; text-align: center;">This is an automated email. Please do not reply to this message.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log('✅ Password reset email sent successfully to:', user.email);
    res.status(200).json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error('❌ Password Reset Error:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
}; 

// Update Profile Controller
const updateProfile = async (req, res) => {
  try {
    console.log("=== UPDATE PROFILE ROUTE HIT ===");

    const { bloodType, phone, dateOfBirth, gender } = req.body;

    if (!bloodType && !phone && !dateOfBirth && !gender) {
      return res.status(400).json({
        success: false,
        message:
          "At least one field (bloodType, phone, dateOfBirth, or gender) is required to update",
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

    console.log(
      "User update result:",
      updatedUser ? "✅ SUCCESS" : "❌ FAILED"
    );

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
// Auth Check Controller
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
  requestPasswordReset,
  resetPassword,
};
