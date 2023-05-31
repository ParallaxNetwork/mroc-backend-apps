import { sendReturn } from "../utils/return.js";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
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
export const jwtVerify = async (req, res) => {
    try {
        const bearerHeader = req.header(JWT_HEADER);
        const bearer = bearerHeader.split(" ");
        const token = bearer[1];
        if (typeof token == "undefined") {
            return sendReturn(400, "No tokens provided", res);
        }
        const verify = jwt.verify(token, JWT_SECRET);
        const nik = verify.nik;
        const ethAddress = verify.address;
        const currUser = await User.findOne({ nik: nik, isActive: true });
        if (currUser != null && verify && currUser.ethAddress == ethAddress) {
            return sendReturn(200, "OK", res);
        }
        else {
            return sendReturn(400, "Invalid", res);
        }
    }
    catch (error) {
        return sendReturn(500, error.message, res);
    }
};
//# sourceMappingURL=jwt.js.map