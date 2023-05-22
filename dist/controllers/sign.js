import { sendReturn } from "../utils/return.js";
import { ethers } from "ethers";
import siwe from "siwe";
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
        console.log("signature", signature);
        const recoveredAddress = ethers.verifyMessage(messageToSign, signature);
        const authSig = {
            sig: signature,
            derivedVia: "web3.eth.personal.sign",
            signedMessage: messageToSign,
            address: recoveredAddress,
        };
        // Try Lit Action
        // const litNodeClient = new LitJsSdk.LitNodeClientNodeJs({ litNetwork: "serrano" });
        // await litNodeClient.connect();
        // const foo = await LitJsSdk.encryptToIpfs({
        //   authSig: authSig,
        //   chain: "",
        //   infuraId: "",
        //   infuraSecretKey: "",
        //   litNodeClient: litNodeClient
        // });
        console.log("authSig", authSig);
        return sendReturn(200, "OK", res);
    }
    catch (error) {
        return sendReturn(500, error.message, res);
    }
};
//# sourceMappingURL=sign.js.map