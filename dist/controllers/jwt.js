import { sendReturn } from "../utils/return.js";
import { generateAuthSig } from "../utils/sig.js";
import * as LitJsSdk from "@lit-protocol/lit-node-client-nodejs";
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
            return sendReturn(200, currUser._id, res);
        }
        else {
            return sendReturn(400, "Invalid", res);
        }
    }
    catch (error) {
        return sendReturn(500, error.message, res);
    }
};
export const jwtAuth = async (req, res, next) => {
    try {
        // JWT Checking
        const bearerHeader = req.header(JWT_HEADER);
        const litNodeClient = new LitJsSdk.LitNodeClientNodeJs({
            litNetwork: "serrano",
        });
        await litNodeClient.connect();
        const authSig = await generateAuthSig();
        const signatures = await litNodeClient.executeJs({
            ipfsId: "QmXUJXZaZ2bLsrnNfLb48th3jgWBLbPB6aS1wXK9LPbKTt",
            // code: litActionCode,
            authSig: authSig,
            jsParams: {
                jwtAuth: bearerHeader,
            },
        });
        if (!signatures.response.success) {
            return sendReturn(400, "Invalid JWT", res);
        }
        next();
    }
    catch (error) {
        return sendReturn(500, error.message, res);
    }
};
//# sourceMappingURL=jwt.js.map