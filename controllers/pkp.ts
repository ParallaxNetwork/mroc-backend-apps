import { sendReturn } from "../utils/return.js";

import * as dotenv from "dotenv";
dotenv.config();

import contractAbi from "../PKPNFT.json" assert {type: 'json'};

import { ethers } from 'ethers'

const RPC_URL = process.env.LIT_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ACCOUNT_ADDRESS = process.env.ACCOUNT_ADDRESS
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS

export const pkpMint = async (req, res) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
    const signer = new ethers.Wallet(PRIVATE_KEY, provider)
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, signer)

    const mintCost = await contract.mintCost()
    const mintNext = await contract.mintNext(2, {from: ACCOUNT_ADDRESS, value: mintCost})
    const tx = await mintNext.wait()

    const tokenId = String(tx.logs[1].args.tokenId)
    const ethAddress = await contract.getEthAddress(tokenId)
    const transferOwnership = await contract.safeTransferFrom(ACCOUNT_ADDRESS, ethAddress, tokenId)

    console.log("tokenId: " + tokenId)
    console.log("ethAddress: " + ethAddress)

    return sendReturn(200, "OK", res);
  } catch (error) {
    return sendReturn(500, error.message, res);
  }
};
