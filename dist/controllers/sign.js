import { sendReturn } from "../utils/return.js";
import { ethers } from "ethers";
import siwe from "siwe";
import * as LitJsSdk from "@lit-protocol/lit-node-client-nodejs";
const litActionCode = `
const go = async () => {
  const url = "https://mroc-backend-apps-6n4eg.ondigitalocean.app/jwt/verify"
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'authorization': jwtAuth
    }
  }).then((response) => response.json())

  if (!resp.success) {
    return
  }

  const response = JSON.stringify({ signed: "true" });
  LitActions.setResponse({ response });
}

go()
`;
export const foo = async (req, res) => {
    try {
        const privKey = "3dfb4f70b15b6fccc786347aaea445f439a7f10fd10c55dd50cafc3d5a0abac1";
        const wallet = new ethers.Wallet(privKey);
        const domain = "localhost";
        const origin = "https://localhost/login";
        const statement = "This is a test statement.  You can put anything you want here.";
        const siweMessage = new siwe.SiweMessage({
            domain,
            address: wallet.address,
            statement,
            uri: origin,
            version: "1",
            chainId: 1,
        });
        const messageToSign = siweMessage.prepareMessage();
        const signature = await wallet.signMessage(messageToSign);
        // console.log("signature", signature);
        const recoveredAddress = ethers.utils.verifyMessage(messageToSign, signature);
        const authSig = {
            sig: signature,
            derivedVia: "web3.eth.personal.sign",
            signedMessage: messageToSign,
            address: recoveredAddress,
        };
        // Try Lit Action
        const litNodeClient = new LitJsSdk.LitNodeClientNodeJs({ litNetwork: "serrano" });
        await litNodeClient.connect();
        const signatures = await litNodeClient.executeJs({
            code: litActionCode,
            authSig,
            jsParams: {
                jwtAuth: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiV2VkIE1heSAyNCAyMDIzIDE1OjMwOjI4IEdNVCswNzAwIChXZXN0ZXJuIEluZG9uZXNpYSBUaW1lKSIsImlhdCI6MTY4NDkxNzAyOH0.TkYsMSCoEGgFoj3_a3rkyxAoE6grk3sJ2SfcSOB9Y8Q"
            }
        });
        console.log("signatures: ", signatures);
        // const foo = await LitJsSdk.encryptToIpfs({
        //   authSig: authSig,
        //   string: "howowhhwh",
        //   chain: "goerli",
        //   infuraId: "d0309116532b4d74bfe4d2cb0eeca7ed",
        //   infuraSecretKey: "3cfcc024af4b4c6f80d3db715f367018",
        //   litNodeClient: litNodeClient,
        //   accessControlConditions: [],
        //   evmContractConditions: [],
        //   solRpcConditions: [],
        //   unifiedAccessControlConditions: []
        // });
        // console.log(foo)
        // console.log("authSig", authSig);
        return sendReturn(200, "OK", res);
    }
    catch (error) {
        return sendReturn(500, error.message, res);
    }
};
export const bar = async (req, res) => {
    try {
        const { jwtAuth } = req.body;
        const url = "https://mroc-backend-apps-6n4eg.ondigitalocean.app/jwt/verify";
        const resp = await fetch(url, {
            method: "POST",
            headers: {
                authorization: jwtAuth,
            },
        }).then((response) => response.json());
        console.log(resp.success);
        return sendReturn(200, "OK", res);
    }
    catch (error) {
        return sendReturn(500, error.message, res);
    }
};
//# sourceMappingURL=sign.js.map