import { sendReturn } from '../utils/return.js'
import { nanoid } from 'nanoid'
import bcrypt from 'bcrypt'
import ApiKey from '../models/api.js'

export const apiKeyAdd = async (req, res) => {
  try {
    const { password } = req.body
    const saltRound = 10

    const salt = await bcrypt.genSalt(saltRound)
    const hash = await bcrypt.hash(password, salt)

    const apiKey = await new ApiKey({
      _id: nanoid(),
      apiKey: nanoid(),
      hashKey: hash,
      isActive: true,
    }).save()

    return sendReturn(200, apiKey.apiKey, res)
  } catch (error) {
    return sendReturn(500, error.message, res)
  }
}

export const apiAuth = async (req, res, next) => {
  try {
    const apiKey = req.header('x-api-key')
    const password = req.header('password')

    if (typeof apiKey == 'undefined') {
      console.log('test')
      req.facility = false
      return next()
    }

    const apiVerify = await ApiKey.findOne({ apiKey: apiKey, isActive: true })

    if (!apiVerify) {
      return sendReturn(400, 'Invalid Api Key', res)
    }

    const validate = await bcrypt.compare(password, apiVerify.hashKey)

    if (!validate) {
      return sendReturn(400, "Api key don't match password", res)
    }

    req.facility = true
    return next()
  } catch (error) {
    return sendReturn(500, error.message, res)
  }
}
