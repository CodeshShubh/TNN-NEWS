import '../config/config.loadENV.js';
import jwt from 'jsonwebtoken';
// this will work proprly without 
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
export const VerifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer "))
        return res.status(401).json({ Success: false, Message: "Unauthorized" });
    const token = authHeader.split(' ')[1];
    try {
        const decode = jwt.verify(token, JWT_SECRET);
        req.user = decode;
        next();
    }
    catch (error) {
        return res.status(401).json({ Success: false, message: 'Invalid token', Error: error.message });
    }
};
