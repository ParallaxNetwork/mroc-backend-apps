import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
export const jwtSign = async (data) => {
    try {
        const token = jwt.sign(data, JWT_SECRET, { expiresIn: '6h' });
        return token;
    }
    catch (error) {
        return error.message;
    }
};
//# sourceMappingURL=jwt.js.map