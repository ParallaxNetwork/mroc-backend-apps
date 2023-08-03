import * as dotenv from 'dotenv'
dotenv.config()

export const serverAuth = async (apikey: string): Promise<Boolean> => {
  try {
    const serverKey = process.env.SERVER_API_KEY
    return apikey === serverKey
  } catch (error) {
    return false
  }
}
