import jwt from 'jsonwebtoken';

const getJwtSecret = () => process.env.JWT_SECRET || process.env.JWT_KEY;

export const auth = (req, res, next) => {

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Authentication failed: No token provided" });
    }

    const secret = getJwtSecret();
    if (!secret) {
        return res.status(500).json({ message: "Server misconfiguration: JWT secret missing" });
    }

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Authentication failed: Invalid token" });
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: "Authorization failed: Admins only" });
    }
    next();
};