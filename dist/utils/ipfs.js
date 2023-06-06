import { ThirdwebStorage } from '@thirdweb-dev/storage';
const storage = new ThirdwebStorage();
export const ipfsStorageUpload = async (data) => {
    const uri = await storage.upload(data);
    const url = await storage.resolveScheme(uri);
    const cid = uri.replace('ipfs://', '');
    const res = {
        cid: cid,
        url: url,
    };
    return res;
};
export const ipfsStorageDownload = async (cid) => {
    try {
        const uri = await storage.resolveScheme(`ipfs://${cid}`);
        const data = await storage.downloadJSON(uri);
        return data;
    }
    catch (error) {
        return error;
    }
};
//# sourceMappingURL=ipfs.js.map