import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const createToken = (payload) => {
    return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '365d' });
}

export const verifyTokenMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(403).send('A token is required for authentication');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(403).send('A token is required for authentication');
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).send('Invalid Token');
    }
};