import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const createToken = (payload) => {
    return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '365d' });
}