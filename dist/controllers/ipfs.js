import { sendReturn } from "../utils/return.js";
import { generateAuthSig } from "../utils/sig.js";
import * as LitJsSdk from "@lit-protocol/lit-node-client-nodejs";
import * as dotenv from "dotenv";
dotenv.config();
const JWT_HEADER = process.env.JWT_HEADER;
const JWT_VERIFY_IPFS = process.env.JWT_VERIFY_IPFS;
const INFURA_ID = process.env.INFURA_ID;
const INFURA_SECRET = process.env.INFURA_SECRET;
const litActionCode = `
const go = async () => {
  const url = "https://mroc-backend-apps-6n4eg.ondigitalocean.app/jwt/verify"
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'authorization': jwtAuth
    }
  }).then((response) => response.json())

  LitActions.setResponse({response: JSON.stringify({success: resp.success})})
}

go()
`;
export const ipfsPost = async (req, res) => {
    try {
        // Try Lit Action
        const bearerHeader = req.header(JWT_HEADER);
        const litNodeClient = new LitJsSdk.LitNodeClientNodeJs({
            litNetwork: "serrano",
        });
        await litNodeClient.connect();
        const authSig = await generateAuthSig();
        const signatures = await litNodeClient.executeJs({
            // ipfsId: "QmVfmdTiDU9UGC9aJPPV7UsfVy7soUJFPoy5sgYv1FSQhU",
            code: litActionCode,
            authSig: authSig,
            jsParams: {
                jwtAuth: bearerHeader,
            },
        });
        console.log(signatures.response.success);
        return sendReturn(200, "OK", res);
    }
    catch (error) {
        return sendReturn(500, error.message, res);
    }
};
//# sourceMappingURL=ipfs.js.map