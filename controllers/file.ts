import { sendReturn } from '../lib/return.js'
import File from '../models/file.js'

export const fileGetList = async (req, res) => {
  try {
    const files = await File.find({ owner: req.user, isActive: true })

    if (files.length == 0) {
      return sendReturn(400, 'No files uploaded yet', res)
    }

    const ids = files.map(x => x._id)

    console.log(ids)

    return sendReturn(200, ids, res)
  } catch (error) {
    return sendReturn(500, error.message, res)
  }
}
