import { sendReturn } from "../utils/return.js";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_HEADER = process.env.JWT_HEADER;
export const jwtGenerate = async (req, res) => {
    try {
        const data = {
            time: Date(),
        };
        const token = jwt.sign(data, JWT_SECRET);
        return sendReturn(200, token, res);
    }
    catch (error) {
        return sendReturn(500, error.message, res);
    }
};
export const jwtVerify = async (req, res, next) => {
    try {
        const bearerHeader = req.header(JWT_HEADER);
        const bearer = bearerHeader.split(' ');
        const token = bearer[1];
        console.log(token);
        if (typeof token == "undefined") {
            return sendReturn(400, "No tokens provided", res);
        }
        const verified = jwt.verify(token, JWT_SECRET);
        if (verified) {
            next();
        }
        else {
            return sendReturn(400, "Invalid Token", res);
        }
    }
    catch (error) {
        return sendReturn(500, error.message, res);
    }
};
//# sourceMappingURL=jwt.js.map