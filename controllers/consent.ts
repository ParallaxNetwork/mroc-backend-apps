import { sendReturn } from "../utils/return.js";
import User from "../models/user.js";
import File from "../models/file.js";
import Consent from "../models/consent.js";
import { nanoid } from "nanoid";
import { isValidTimestamp } from "../utils/validator.js";

export const consentAdd = async (req, res) => {
  try {
    const { receiverId, fileId } = req.body;

    let missingFields = [];

    receiverId ? undefined : missingFields.push("receiverId");
    fileId ? undefined : missingFields.push("fileId");

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

    const currConsent = await Consent.findOne({
      ownerId: req.user,
      receiverId: receiverId,
      fileId: fileId,
      isActive: true,
    });

    if (currConsent) {
      return sendReturn(
        400,
        "There is already active consent with current input",
        res
      );
    }

    await new Consent({
      _id: nanoid(),
      ownerId: req.user,
      receiverId: receiverId,
      fileId: fileId,
      isActive: true,
    }).save();

    return sendReturn(200, "OK", res);
  } catch (error) {
    return sendReturn(500, error.message, res);
  }
};

export const consentDelete = async (req, res) => {
  try {
    const { consentId } = req.body;

    if (typeof consentId != "string") {
      return sendReturn(400, "Invalid ConsentId", res);
    }

    const currConsent = await Consent.findOne({
      _id: consentId,
      isActive: true,
    });

    if (!currConsent) {
      return sendReturn(400, `No consent with ${consentId} id`, res);
    }

    currConsent.isActive = false;
    await currConsent.save();

    return sendReturn(200, "OK", res);
  } catch (error) {
    return sendReturn(500, error.message, res);
  }
};

export const consentGetList = async (req, res) => {
  try {
    const consents = await Consent.find(
      { ownerId: req.user, isActive: true },
      {_id:1, ownerId:1, receiverId:1, fileId:1}
    );

    if (consents.length < 1) {
      return sendReturn(400, "Does not yet have consent", res);
    }

    return sendReturn(200, consents, res);
  } catch (error) {
    return sendReturn(500, error.message, res);
  }
};
