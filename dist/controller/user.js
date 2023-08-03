import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();
import User from '../models/User.js';
import { generatePKP } from '../lib/litProtocol.js';
import { genLocalWallet } from '../lib/thirdWeb.js';
import { hashPassword, validatePassword } from '../lib/password.js';
const JWT_SECRET = process.env.JWT_SECRET;
export const userLogin = async (req, res) => {
    try {
        const { nik, password } = req.body;
        const user = await User.findOne({ nik: nik, isActive: true });
        if (user == null) {
            return res.status(200).send(`No user with nik ${nik}`);
        }
        const validate = await validatePassword(password, user.passHash);
        if (!validate) {
            return res.status(200).send("User don't match password");
        }
        const data = {
            nik: nik,
            time: Date.now(),
        };
        const token = jwt.sign(data, JWT_SECRET, { expiresIn: '6h' });
        return res.status(200).send(token);
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).send(error.message);
    }
};
export const userRegister = async (req, res) => {
    try {
        const { nik, password } = req.body;
        const user = await User.findOne({ nik: nik, isActive: true });
        if (user) {
            return res.status(200).send(`user with NIK ${user.nik} already existed`);
        }
        const hash = await hashPassword(password);
        const { wallet, encWallet } = await genLocalWallet(password);
        const { tokenId, ethAddress } = await generatePKP(wallet);
        await User.create({
            nik: nik,
            passHash: hash,
            pkpEth: ethAddress,
            pkpToken: tokenId,
            wallet: wallet,
            encWallet: encWallet,
        });
        return res.status(200).send('OK');
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).send(error.message);
    }
};
//# sourceMappingURL=user.js.map