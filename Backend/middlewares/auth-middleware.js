import jwt from "jsonwebtoken";

export const verifyPlayer = (req, res, next) => {

  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized access you need to login first",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.playerId = decoded.id;
    next();
  } catch {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};