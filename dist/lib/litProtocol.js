import { ethers } from 'ethers';
import * as LitJsSdk from '@lit-protocol/lit-node-client-nodejs';
import contractAbi from '../PKPNFT.json' assert { type: 'json' };
import * as dotenv from 'dotenv';
dotenv.config();
const RPC_URL = process.env.LIT_RPC_URL;
const PRIVATE_KEY = String(process.env.PRIVATE_KEY);
const ACCOUNT_ADDRESS = String(process.env.ACCOUNT_ADDRESS);
const CONTRACT_ADDRESS = String(process.env.CONTRACT_ADDRESS);
export const generatePKP = async (wallet) => {
    try {
        const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
        const signer = new ethers.Wallet(PRIVATE_KEY, provider);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, signer);
        const mintCost = await contract.mintCost();
        const mintNext = await contract.mintNext(2, {
            from: ACCOUNT_ADDRESS,
            value: mintCost,
        });
        const tx = await mintNext.wait();
        const tokenId = String(tx.events[1].args.tokenId);
        const ethAddress = await contract.getEthAddress(tokenId);
        const transferOwnership = await contract.safeTransferFrom(ACCOUNT_ADDRESS, wallet, tokenId);
        await transferOwnership.wait();
        return { tokenId, ethAddress };
    }
    catch (error) {
        console.log(error.message);
        return error.message;
    }
};
export const litIpfsEncrypt = async (file, authSig) => {
    try {
        const chain = 'ethereum';
        const accessControlConditions = [
            {
                contractAddress: '',
                standardContractType: '',
                chain,
                method: '',
                parameters: [':userAddress'],
                returnValueTest: {
                    comparator: '=',
                    value: authSig.address,
                },
            },
        ];
        const litNodeClient = new LitJsSdk.LitNodeClientNodeJs('ethereum');
        await litNodeClient.connect();
        const ipfsCid = await LitJsSdk.encryptToIpfs({
            authSig,
            accessControlConditions,
            chain,
            file,
            litNodeClient,
            infuraId: process.env.INFURA_ID,
            infuraSecretKey: process.env.INFURA_SECRET,
        });
        return ipfsCid;
    }
    catch (error) {
        return error.message;
    }
};
export const litIpfsDecrypt = async (cid, authSig) => {
    const client = new LitJsSdk.LitNodeClientNodeJs('ethereum');
    await client.connect();
    const decryptedFile = await LitJsSdk.decryptFromIpfs({
        authSig,
        ipfsCid: cid,
        litNodeClient: client,
    });
    return decryptedFile;
};
//* Lit Encrypt and Decrypt functions but not IPFS and Access Control Conditions.
//* Below are functions that are no longer used but it's a shame to throw them away.
// export const litEncryptFile = async (
//   file: Buffer
// ): Promise<{ fileBase64: string; symKey: string }> => {
//   try {
//     const result = await LitJsSdk.encryptFile({
//       file: new Blob([file]),
//     })
//     const fileBase64 = await LitJsSdk.blobToBase64String(result.encryptedFile)
//     const symKey = String(result.symmetricKey)
//     return { fileBase64, symKey }
//   } catch (error) {
//     console.log(error.message)
//     return error.message
//   }
// }
// export const litDecryptFile = async (
//   fileBase64: string,
//   symKey: string
// ): Promise<Buffer> => {
//   try {
//     const encryptedBlob = LitJsSdk.base64StringToBlob(fileBase64)
//     const arrayKey = symKey.split(',').map(Number)
//     const symmetricKey = new Uint8Array(arrayKey)
//     const decryptedFile = await LitJsSdk.decryptFile({
//       file: encryptedBlob,
//       symmetricKey: symmetricKey,
//     })
//     const decryptedFileBuffer = Buffer.from(decryptedFile)
//     return decryptedFileBuffer
//   } catch (error) {
//     console.log(error.message)
//     return error.message
//   }
// }
//# sourceMappingURL=litProtocol.js.map