import { sendReturn } from "../utils/return";

import * as dotenv from "dotenv";
dotenv.config();

import contractAbi from "../PKPNFT.json";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import Provider from "@truffle/hdwallet-provider";

const rpcUrl = "https://chain-rpc.litprotocol.com/http";
const privateKey = process.env.PRIVATE_KEY;
const scAddress = process.env.CONTRACT_ADDRESS;
const accAddress = process.env.ACCOUNT_ADDRESS;

const provider = new Provider(privateKey, rpcUrl);
const web3 = new Web3(provider);
const myContract = new web3.eth.Contract(contractAbi as AbiItem[], scAddress);

export const pkpMint = async (req, res) => {
  try {
    const mintCost = await myContract.methods.mintCost().call();
    const logs = await myContract.methods
      .mintNext(2)
      .send({ from: accAddress, value: mintCost });

    const { tokenId, pubkey } = logs.events.PKPMinted.returnValues;

    const pkpEthAddress = await myContract.methods
      .getEthAddress(tokenId)
      .call();

    console.log("tokenId: " + tokenId);
    console.log("pubkey: " + pubkey);
    console.log("pkpEthAddress: " + pkpEthAddress);

    const transferLogs = await myContract.methods
      .safeTransferFrom(accAddress, pkpEthAddress, tokenId)
      .send({ from: accAddress });

    return sendReturn(200, "OK", res);
  } catch (error) {
    return sendReturn(500, error.message, res);
  }
};
