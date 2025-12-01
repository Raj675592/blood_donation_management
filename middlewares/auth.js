const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
  try {
   
    
    let token = req.cookies?.token;

    if (!token) {
      token = req.headers.authorization?.split(" ")[1];
    }

    if (!token) {
      console.log("No token provided in request");
      return res.status(401).json({
        success: false,
        message: "Access denied. Please log in to continue.",
      });
    }

    console.log("Token found, verifying...");
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log("Token verification failed:", err.message);
        return res.status(401).json({
          success: false,
          message: "Invalid or expired token. Please log in again.",
        });
      }

      console.log(
        "Token verified successfully for user:",
        decoded.name,
        "Role:",
        decoded.role
      );
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication error occurred",
    });
  }
};



const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required role: ${allowedRoles.join(" or ")}`,
        });
      }

      next();
    } catch (error) {
      console.error("Role check error:", error);
      return res.status(500).json({
        success: false,
        message: "Authorization error occurred",
      });
    }
  };
};




const adminOnly = checkRole("admin");
const userOnly = checkRole("user");


const userOrAdmin = checkRole("user", "admin");


module.exports = {
  checkAuth,
  checkRole,
  adminOnly,
  userOrAdmin,
  userOnly
};
