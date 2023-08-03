import { Sepolia } from '@thirdweb-dev/chains';
import { LocalWallet } from '@thirdweb-dev/wallets';
import siwe from 'siwe';
export const genLocalWallet = async (password) => {
    try {
        const localWallet = new LocalWallet({ chain: Sepolia });
        await localWallet.generate();
        const wallet = await localWallet.getAddress();
        const encWallet = await localWallet.export({
            strategy: 'encryptedJson',
            password,
        });
        return { wallet, encWallet };
    }
    catch (error) {
        console.error(error.message);
        return { wallet: null, encWallet: null };
    }
};
export const accessLocalWallet = async (encWallet, password) => {
    try {
        const localWallet = new LocalWallet();
        await localWallet.import({
            encryptedJson: encWallet,
            password,
        });
        return localWallet;
    }
    catch (error) {
        console.error(error.message);
        return error.message;
    }
};
export const genAuthSig = async (wallet) => {
    try {
        const domain = 'localhost';
        const origin = 'https://localhost/login';
        const address = await wallet.getAddress();
        const statement = 'This is a test statement.  You can put anything you want here.';
        const siweMessage = new siwe.SiweMessage({
            domain,
            address: address,
            statement,
            uri: origin,
            version: '1',
            chainId: 1,
        });
        const messageToSign = siweMessage.prepareMessage();
        const signature = await wallet.signMessage(messageToSign);
        const authSig = {
            sig: signature,
            derivedVia: 'web3.eth.personal.sign',
            signedMessage: messageToSign,
            address: address,
        };
        return authSig;
    }
    catch (error) {
        console.log(error.message);
        return error.message;
    }
};
//# sourceMappingURL=thirdWeb.js.map