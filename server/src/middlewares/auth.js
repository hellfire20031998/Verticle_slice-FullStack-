import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "supersecret";

export function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    SECRET,
    { expiresIn: "7d" }
  );
}

export function decodeToken(token) {
  try {
    const decoded = jwt.verify(token, SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
}

export function getUserNameFromToken(token) {

  try {  
    const newtoken = token.split(" ")[1];
    const decoded = jwt.verify(newtoken, SECRET);
    return decoded.email;
  } catch {
    return null;
  }
}


export function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "Missing token" });

  const token = auth.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}
