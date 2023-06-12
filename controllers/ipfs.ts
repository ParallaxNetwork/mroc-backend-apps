import { sendReturn } from "../utils/return.js";
import { ipfsStorageDownload, ipfsStorageUpload } from "../utils/ipfs.js";
import { isValidTimestamp } from "../utils/validator.js";
import File from "../models/file.js";
import Consent from "../models/consent.js"
import sharp from "sharp";
import dcmjsimaging from "dcmjs-imaging";
import { PNG } from "pngjs";
import { nanoid } from "nanoid";
import archiver from "archiver";
import * as LitJsSdk from "@lit-protocol/lit-node-client-nodejs";

import * as dotenv from "dotenv";
dotenv.config();

const { DicomImage, NativePixelDecoder } = dcmjsimaging;

function toArrayBuffer(buffer) {
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  );
}

export const ipfsPost = async (req, res) => {
  try {
    let file;

    try {
      file = req.files.file;
    } catch (error) {
      return sendReturn(400, "No file uploaded", res);
    }

    // Png Processing
    const arrayBuffer = toArrayBuffer(file.data);
    await NativePixelDecoder.initializeAsync();
    const image = new DicomImage(arrayBuffer);
    const renderingResult = image.render();
    const renderedPixels = renderingResult.pixels;
    const width = renderingResult.width;
    const height = renderingResult.height;
    const png = new PNG({ width, height });
    png.data = Buffer.from(renderedPixels);
    const pngBuffer = PNG.sync.write(png);

    // Webp Processing
    const webpFile = await sharp(pngBuffer).webp().toBuffer();

    // Encryption
    const result = await LitJsSdk.encryptFile({ file: new Blob([webpFile]) });
    const fileBase64 = await LitJsSdk.blobToBase64String(result.encryptedFile);

    // Convert to string
    const symmetricKey = String(result.symmetricKey);

    // Upload to IPFS
    const { cid, url } = await ipfsStorageUpload(JSON.stringify(fileBase64));

    // Save to DB
    await new File({
      _id: nanoid(),
      cid: cid,
      url: url,
      symmetricKey: symmetricKey,
      ownerId: req.user,
      isActive: true,
    }).save();

    return sendReturn(200, "OK", res);
  } catch (error) {
    return sendReturn(500, error.message, res);
  }
};

export const ipfsGetAll = async (req, res) => {
  try {
    const files = await File.find({ ownerId: req.user, isActive: true });
    let buffers = [];

    if (files.length == 0) {
      return sendReturn(400, "No files uploaded yet", res);
    }

    for (const item of files) {
      const fileBase64 = await ipfsStorageDownload(item.cid);
      const encryptedBlob = LitJsSdk.base64StringToBlob(fileBase64);
      const arrayKey = item.symmetricKey.split(",").map(Number);
      const symmetricKey = new Uint8Array(arrayKey);

      const decryptedFile = await LitJsSdk.decryptFile({
        file: encryptedBlob,
        symmetricKey: symmetricKey,
      });

      const decryptedFileBuffer = Buffer.from(decryptedFile);

      buffers.push({
        buffer: decryptedFileBuffer,
        name: nanoid() + ".webp",
      });
    }

    const archive = archiver("zip");
    res.attachment("decrypted.zip");
    archive.pipe(res);

    buffers.forEach(({ buffer, name }) => {
      archive.append(buffer, { name });
    });

    archive.finalize();
  } catch (error) {
    return sendReturn(500, error.message, res);
  }
};

export const ipfsGet = async (req, res) => {
  try {
    const { fileId } = req.body;

    if (typeof fileId != "string") {
      return sendReturn(400, "Invalid fileId", res);
    }

    const currFile = await File.findOne({ _id: fileId, isActive: true });

    if (!currFile) {
      return sendReturn(400, `File with id ${fileId} not found`, res);
    }

    if (currFile.ownerId != req.user) {
      const consent = await Consent.findOne({ fileId: fileId, receiverId: req.user, isActive: true })
      
      if (!consent) {
        return sendReturn(400, "You don't have a consent with the owner of the file", res)
      }
    }

    const fileBase64 = await ipfsStorageDownload(currFile.cid);
    const encryptedBlob = LitJsSdk.base64StringToBlob(fileBase64);
    const arrayKey = currFile.symmetricKey.split(",").map(Number);
    const symmetricKey = new Uint8Array(arrayKey);

    const decryptedFile = await LitJsSdk.decryptFile({
      file: encryptedBlob,
      symmetricKey: symmetricKey,
    });

    const decryptedFileBuffer = Buffer.from(decryptedFile);

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${nanoid()}.webp`
    );
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Length", decryptedFileBuffer.length);
    res.write(decryptedFileBuffer);
    res.end();
  } catch (error) {
    return sendReturn(500, error.message, res);
  }
};
