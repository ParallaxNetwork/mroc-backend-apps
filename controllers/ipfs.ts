import { sendReturn } from "../utils/return.js";
import { generateAuthSig } from "../utils/sig.js";
import { ipfsStorageDownload, ipfsStorageUpload } from "../utils/ipfs.js";
import File from "../models/file.js";
import sharp from "sharp";
import dcmjsimaging from "dcmjs-imaging";
import { PNG } from "pngjs";
import { nanoid } from "nanoid";
import * as LitJsSdk from "@lit-protocol/lit-node-client-nodejs";

import * as dotenv from "dotenv";
dotenv.config();

const { DicomImage, NativePixelDecoder } = dcmjsimaging;

const JWT_HEADER = process.env.JWT_HEADER;

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

export const ipfsGet = async (req, res) => {
  try {
    return sendReturn(200, "OK", res);
  } catch (error) {
    return sendReturn(500, error.message, res);
  }
};
