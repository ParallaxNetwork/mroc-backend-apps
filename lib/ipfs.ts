import { ThirdwebStorage } from '@thirdweb-dev/storage'

const storage = new ThirdwebStorage()

export const ipfsStorageUpload = async (
  data: any
): Promise<{ cid: string; url: string }> => {
  const uri: string = await storage.upload(data)
  const url: string = storage.resolveScheme(uri)

  const cid: string = uri.replace('ipfs://', '')

  return {
    cid: cid,
    url: url,
  }
}

export const ipfsStorageDownload = async (cid: string): Promise<any> => {
  try {
    const uri: string = storage.resolveScheme(`ipfs://${cid}`)
    const data: any = await storage.downloadJSON(uri)

    return data
  } catch (error) {
    return error
  }
}
