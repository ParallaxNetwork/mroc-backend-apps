import { ethers } from 'ethers';
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
//# sourceMappingURL=litProtocol.js.map