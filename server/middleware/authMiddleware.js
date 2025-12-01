import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    try {
        const token = req.header("Authorization");
        if (!token) return res.status(403).json({ message: "Access Denied" });

        if (token.startsWith("Bearer ")) {
            const tokenSlice = token.slice(7, token.length).trimLeft();
            const verified = jwt.verify(tokenSlice, process.env.JWT_SECRET);
            req.user = verified;
            next();
        } else {
            return res.status(403).json({ message: "Invalid Token Format" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
