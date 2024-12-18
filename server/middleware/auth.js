const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization') && req.header('Authorization').split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ err: 'Access denied, no token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token using the secret key
        req.user = decoded; // Attach the decoded user data to the request object
        next(); // Continue to the next middleware or route handler
    } catch (error) {
        return res.status(400).json({ err: 'Invalid token' });
    }
};

module.exports = verifyToken;