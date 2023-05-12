"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pkpMint = void 0;
const return_1 = require("../utils/return");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const PKPNFT_json_1 = __importDefault(require("../PKPNFT.json"));
const web3_1 = __importDefault(require("web3"));
const hdwallet_provider_1 = __importDefault(require("@truffle/hdwallet-provider"));
const rpcUrl = "https://chain-rpc.litprotocol.com/http";
const privateKey = process.env.PRIVATE_KEY;
const scAddress = process.env.CONTRACT_ADDRESS;
const accAddress = process.env.ACCOUNT_ADDRESS;
const provider = new hdwallet_provider_1.default(privateKey, rpcUrl);
const web3 = new web3_1.default(provider);
const myContract = new web3.eth.Contract(PKPNFT_json_1.default, scAddress);
const pkpMint = async (req, res) => {
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
        return (0, return_1.sendReturn)(200, "OK", res);
    }
    catch (error) {
        return (0, return_1.sendReturn)(500, error.message, res);
    }
};
exports.pkpMint = pkpMint;
//# sourceMappingURL=pkp.js.map