import { sendReturn } from "../utils/return.js";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import ApiKey from "../models/api.js";

export const apiKeyAdd = async (req, res) => {
  try {
    const { password } = req.body;
    const saltRound = 10;

    const salt = await bcrypt.genSalt(saltRound);
    const hash = await bcrypt.hash(password, salt);

    const apiKey = await new ApiKey({
      _id: nanoid(),
      apiKey: nanoid(),
      hashKey: hash,
      isActive: true,
    }).save();

    return sendReturn(200, apiKey.apiKey, res);
  } catch (error) {
    return sendReturn(500, error.message, res);
  }
};
