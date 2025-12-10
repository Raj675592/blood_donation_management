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
    
   
    const { name, email, password, phone, bloodType, dateOfBirth, gender, address  } =
      req.body;

    if (
      !name ||
      !email ||
      !password ||
      !phone ||
      !bloodType ||
      !dateOfBirth ||
      !gender || !address
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
      address,
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
        address: newUser.address,
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
    const token = req.headers.authorization?.split(' ')[1];
    
    // Add token to blacklist
    await TokenBlacklist.create({
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    });
    
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Logout failed'
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

    // Only allow password reset in development
    if (process.env.NODE_ENV === 'production') {
      return res.status(503).json({ 
        message: 'Password reset is only available in development mode. Please contact admin for assistance.' 
      });
    }

    const frontendURL = 'http://localhost:3000';
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
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          
          <!-- Header Section -->
          <div style="background: linear-gradient(135deg, #dc143c 0%, #b91230 100%); padding: 30px 20px; text-align: center;">
            <div style="background-color: white; width: 60px; height: 60px; margin: 0 auto 15px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">
              <span style="font-size: 32px;">🩸</span>
            </div>
            <h1 style="color: white; margin: 0; font-size: 26px; font-weight: 600; letter-spacing: 0.5px;">Blood Donation Management System</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">Saving Lives Together</p>
          </div>

          <!-- Main Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #333; font-size: 22px; margin: 0 0 20px 0; font-weight: 600;">Password Reset Request</h2>
            
            <p style="color: #555; line-height: 1.8; font-size: 15px; margin: 0 0 15px 0;">Dear Valued Member,</p>
            
            <p style="color: #555; line-height: 1.8; font-size: 15px; margin: 0 0 15px 0;">
              We received a request to reset the password for your Blood Donation Management System account. We understand that security is important to you, and we're here to help you regain access to your account quickly and safely.
            </p>

            <p style="color: #555; line-height: 1.8; font-size: 15px; margin: 0 0 25px 0;">
              To proceed with resetting your password, please click the button below. This secure link will take you to a page where you can create a new password for your account.
            </p>

            <!-- Reset Button -->
            <div style="text-align: center; margin: 35px 0;">
              <a href="${resetURL}" style="background: linear-gradient(135deg, #dc143c 0%, #b91230 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(220, 20, 60, 0.3); transition: all 0.3s;">
                🔐 Reset My Password
              </a>
            </div>

            <!-- Alternative Link -->
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 25px 0; border-left: 4px solid #dc143c;">
              <p style="color: #666; margin: 0 0 10px 0; font-size: 14px; font-weight: 600;">Alternative Method:</p>
              <p style="color: #666; margin: 0 0 8px 0; font-size: 13px;">If the button above doesn't work, copy and paste the following link into your web browser:</p>
              <p style="color: #dc143c; word-break: break-all; font-size: 12px; margin: 0; font-family: 'Courier New', monospace; background-color: white; padding: 10px; border-radius: 4px; border: 1px solid #e0e0e0;">${resetURL}</p>
            </div>

            <!-- Important Information -->
            <div style="background-color: #fff3cd; border: 1px solid #ffc107; border-radius: 6px; padding: 18px; margin: 25px 0;">
              <p style="color: #856404; margin: 0 0 10px 0; font-weight: 600; font-size: 14px;">⚠️ Important Security Information:</p>
              <ul style="color: #856404; margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.8;">
                <li>This password reset link will <strong>expire in 1 hour</strong> for security reasons</li>
                <li>If you didn't request this password reset, please ignore this email</li>
                <li>Your password will remain unchanged if you don't click the link</li>
                <li>Never share your password reset link with anyone</li>
                <li>Our team will never ask for your password via email</li>
              </ul>
            </div>

            <p style="color: #555; line-height: 1.8; font-size: 15px; margin: 25px 0 15px 0;">
              If you continue to experience issues or if you did not initiate this request, please contact our support team immediately for assistance. We take the security of your account very seriously.
            </p>

            <p style="color: #555; line-height: 1.8; font-size: 15px; margin: 0 0 10px 0;">
              Thank you for being a part of our life-saving community.
            </p>

            <p style="color: #555; line-height: 1.8; font-size: 15px; margin: 0;">
              <strong>Best regards,</strong><br>
              Blood Donation Management Team<br>
              <span style="color: #dc143c; font-weight: 600;">Saving Lives, One Donation at a Time 💉</span>
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f8f9fa; padding: 25px 30px; border-top: 1px solid #e0e0e0;">
            <p style="color: #999; font-size: 12px; margin: 0 0 8px 0; text-align: center; line-height: 1.6;">
              This is an automated email from Blood Donation Management System. Please do not reply to this message.
            </p>
            <p style="color: #999; font-size: 11px; margin: 0; text-align: center; line-height: 1.6;">
              © ${new Date().getFullYear()} Blood Donation Management System. All rights reserved.<br>
              Need help? Contact us at support@dummy.com
            </p>
          </div>

        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    
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

   

    if (!updatedUser) {
      
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
