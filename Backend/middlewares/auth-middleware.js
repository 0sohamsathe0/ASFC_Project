import jwt from "jsonwebtoken";

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access. Please login first.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Make the decoded token available throughout the request
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

export default verifyJWT;