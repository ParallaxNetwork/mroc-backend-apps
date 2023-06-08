import { sendReturn } from "../utils/return.js";
import User from "../models/user.js";
import File from "../models/file.js";
import Consent from "../models/consent.js";
import { nanoid } from "nanoid";
import { isValidTimestamp } from "../utils/validator.js";
export const consentAdd = async (req, res) => {
    try {
        const { receiverId, fileId, expiryDate } = req.body;
        let missingFields = [];
        receiverId ? undefined : missingFields.push("receiverId");
        fileId ? undefined : missingFields.push("fileId");
        expiryDate ? undefined : missingFields.push("expiryDate");
        if (missingFields.length > 0) {
            return sendReturn(400, `Missing Field ${missingFields.join(", ")}`, res);
        }
        const receiver = await User.findOne({ _id: receiverId, isActive: true });
        if (!receiver) {
            return sendReturn(400, `User with id ${receiverId} not found`, res);
        }
        const file = await File.findOne({ _id: fileId, isActive: true });
        if (!file) {
            return sendReturn(400, `File with id ${fileId} not found`, res);
        }
        const currUnixTime = Math.floor(Date.now() / 1000);
        if (!isValidTimestamp(expiryDate) || expiryDate > currUnixTime) {
            return sendReturn(400, "Not valid date for expiryDate", res);
        }
        await new Consent({
            _id: nanoid(),
            ownerId: req.user,
            receiverId: receiverId,
            fileId: fileId,
            expiryDate: expiryDate,
            isActive: true
        }).save();
        return sendReturn(200, "OK", res);
    }
    catch (error) {
        return sendReturn(500, error.message, res);
    }
};
//# sourceMappingURL=consent.js.map