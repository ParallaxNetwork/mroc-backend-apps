import { sendReturn } from '../utils/return.js'
import { generateAuthSig } from '../utils/sig.js'
import * as LitJsSdk from '@lit-protocol/lit-node-client-nodejs'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'

import * as dotenv from 'dotenv'
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET
const JWT_HEADER = process.env.JWT_HEADER

export const jwtGenerate = async (req, res) => {
  try {
    const data = {
      time: Date(),
    }

    const token = jwt.sign(data, JWT_SECRET, { expiresIn: '1m' })

    return sendReturn(200, token, res)
  } catch (error) {
    return sendReturn(500, error.message, res)
  }
}

export const jwtVerify = async (req, res) => {
  try {
    const bearerHeader = req.header(JWT_HEADER)

    const bearer = bearerHeader.split(' ')
    const token = bearer[1]

    if (typeof token == 'undefined') {
      return sendReturn(400, 'No tokens provided', res)
    }

    const verify = jwt.verify(token, JWT_SECRET)

    const nik = verify.nik
    const ethAddress = verify.address

    const currUser = await User.findOne({ nik: nik, isActive: true })

    if (currUser != null && verify && currUser.ethAddress == ethAddress) {
      return sendReturn(200, currUser.nik, res)
    } else {
      return sendReturn(400, 'Invalid', res)
    }
  } catch (error) {
    return sendReturn(500, error.message, res)
  }
}

const litActionCode = `
const go = async () => {
  const url = "https://mroc-backend-apps-6n4eg.ondigitalocean.app/jwt/verify"
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'authorization': jwtAuth
    }
  }).then((response) => response.json())

  LitActions.setResponse({response: JSON.stringify({success: resp.success, user: resp.message})})
}

go()
`

export const jwtAuth = async (req, res, next) => {
  try {
    // JWT Checking
    const bearerHeader = req.header(JWT_HEADER)

    if (typeof bearerHeader != 'string') {
      return sendReturn(400, 'Invalid Token', res)
    }

    const litNodeClient = new LitJsSdk.LitNodeClientNodeJs({
      litNetwork: 'serrano',
    })
    await litNodeClient.connect()

    const authSig = await generateAuthSig()

    const signatures: any = await litNodeClient.executeJs({
      ipfsId: 'QmSQjcxnq7SLNUCY2wCGR7QmnLS8ghoyYqoqRnLyRnM3y2',
      // code: litActionCode,
      authSig: authSig,
      jsParams: {
        jwtAuth: bearerHeader,
      },
    })

    if (!signatures.response.success) {
      return sendReturn(400, 'Invalid JWT', res)
    }

    req.user = signatures.response.user
    return next()
  } catch (error) {
    return sendReturn(500, error.message, res)
  }
}
