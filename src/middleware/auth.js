import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Authentication failed: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
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