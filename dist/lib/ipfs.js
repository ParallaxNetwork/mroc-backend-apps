import { ThirdwebStorage } from '@thirdweb-dev/storage';
const storage = new ThirdwebStorage();
export const ipfsStorageUpload = async (data) => {
    const uri = await storage.upload(data);
    const url = storage.resolveScheme(uri);
    const cid = uri.replace('ipfs://', '');
    return {
        cid: cid,
        url: url,
    };
};
export const ipfsStorageDownload = async (cid) => {
    try {
        const uri = storage.resolveScheme(`ipfs://${cid}`);
        const data = await storage.downloadJSON(uri);
        return data;
    }
    catch (error) {
        return error;
    }
};
//# sourceMappingURL=ipfs.js.map