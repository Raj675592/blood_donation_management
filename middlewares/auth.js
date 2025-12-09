const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
  try {
   
    
    let token = req.cookies?.token;

    if (!token) {
      token = req.headers.authorization?.split(" ")[1];
    }

    if (!token) {
      
      return res.status(401).json({
        success: false,
        message: "Access denied. Please log in to continue.",
      });
    }

    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
      
        return res.status(401).json({
          success: false,
          message: "Invalid or expired token. Please log in again.",
        });
      }

      
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
