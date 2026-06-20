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

const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const requestPasswordReset = async (req, res, next) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User doesn't exist" });
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY missing from environment');
      return res.status(500).json({ message: 'Email service is not configured. Please contact admin.' });
    }
    const secret = process.env.JWT_SECRET + user.password;
    const token = jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: '1h' });
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetURL = `${frontendURL}/resetpassword?id=${user._id}&token=${token}`;

    await resend.emails.send({
      from: 'BloodBank <onboarding@resend.dev>', 
      to: user.email,
      subject: 'Reset your BloodBank password',
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0; padding:0; background-color:#f1f5f9; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9; padding:32px 16px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 18px rgba(15,23,42,0.08);">

                  <!-- Header -->
                  <tr>
                    <td style="background:linear-gradient(135deg, #dc143c 0%, #9f1239 100%); padding:36px 24px; text-align:center;">
                      <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto 14px;">
                        <tr>
                          <td width="56" height="56" align="center" valign="middle" style="background-color:#ffffff; border-radius:50%; font-size:26px;">
                            🩸
                          </td>
                        </tr>
                      </table>
                      <div style="color:#ffffff; font-size:22px; font-weight:700; letter-spacing:0.2px;">BloodBank</div>
                      <div style="color:rgba(255,255,255,0.85); font-size:13px; margin-top:4px;">Saving Lives Together</div>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:36px 32px 8px;">
                      <h1 style="margin:0 0 18px; font-size:20px; color:#0f172a; font-weight:700;">Reset your password</h1>
                      <p style="margin:0 0 14px; font-size:15px; line-height:1.7; color:#475569;">
                        We received a request to reset the password on your BloodBank account. Click the button below to choose a new one.
                      </p>
                    </td>
                  </tr>

                  <!-- CTA Button -->
                  <tr>
                    <td align="center" style="padding:10px 32px 28px;">
                      <table role="presentation" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="border-radius:8px; background:linear-gradient(135deg, #dc143c 0%, #9f1239 100%);">
                            <a href="${resetURL}" style="display:inline-block; padding:14px 36px; font-size:15px; font-weight:600; color:#ffffff; text-decoration:none;">
                              Reset My Password
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Alternative link -->
                  <tr>
                    <td style="padding:0 32px 24px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc; border-radius:8px; border-left:4px solid #dc143c;">
                        <tr>
                          <td style="padding:16px 18px;">
                            <div style="font-size:13px; font-weight:600; color:#334155; margin-bottom:6px;">Button not working?</div>
                            <div style="font-size:12.5px; color:#64748b; margin-bottom:10px;">Copy and paste this link into your browser:</div>
                            <div style="font-size:11.5px; color:#dc143c; word-break:break-all; background-color:#ffffff; padding:10px; border-radius:5px; border:1px solid #e2e8f0; font-family:'Courier New', monospace;">
                              ${resetURL}
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Security notice -->
                  <tr>
                    <td style="padding:0 32px 28px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fffbeb; border:1px solid #fbbf24; border-radius:8px;">
                        <tr>
                          <td style="padding:16px 18px;">
                            <div style="font-size:13px; font-weight:600; color:#92400e; margin-bottom:8px;">⚠ Security notice</div>
                            <ul style="margin:0; padding-left:18px; font-size:12.5px; line-height:1.8; color:#92400e;">
                              <li>This link expires in <strong>1 hour</strong></li>
                              <li>Didn't request this? You can safely ignore this email</li>
                              <li>Your password stays unchanged until you click the link above</li>
                              <li>We will never ask for your password by email</li>
                            </ul>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Sign off -->
                  <tr>
                    <td style="padding:0 32px 32px;">
                      <p style="margin:0; font-size:14px; line-height:1.7; color:#475569;">
                        Best regards,<br/>
                        <strong style="color:#0f172a;">The BloodBank Team</strong><br/>
                        <span style="color:#dc143c; font-weight:600;">Saving Lives, One Donation at a Time</span>
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color:#f8fafc; border-top:1px solid #e2e8f0; padding:20px 32px; text-align:center;">
                      <p style="margin:0 0 6px; font-size:11.5px; color:#94a3b8; line-height:1.6;">
                        This is an automated email — please don't reply directly.
                      </p>
                      <p style="margin:0; font-size:11px; color:#94a3b8; line-height:1.6;">
                        © ${new Date().getFullYear()} BloodBank. All rights reserved.<br/>
                        Need help? Contact support@dummy.com
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    res.status(200).json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error('❌ Password Reset Error:', error.message);
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
