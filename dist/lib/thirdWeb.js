import { Sepolia } from '@thirdweb-dev/chains';
import { LocalWallet } from '@thirdweb-dev/wallets';
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
//# sourceMappingURL=thirdWeb.js.map