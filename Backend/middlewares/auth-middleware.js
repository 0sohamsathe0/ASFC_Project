import jwt from "jsonwebtoken";

 const verifyPlayer = (req, res, next) => {

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

const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized access you need to login first",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== "admin") {
      return res.status(403).json({
        message: "Forbidden access",
      });
    }  } catch {
    return res.status(401).json({
      message: "Invalid token",
    });
  }

  next();
}

export{ verifyPlayer, verifyAdmin }