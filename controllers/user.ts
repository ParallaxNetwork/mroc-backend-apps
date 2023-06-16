import { sendReturn } from '../utils/return.js'
import { nanoid } from 'nanoid'
import { ethers } from 'ethers'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import * as dotenv from 'dotenv'
dotenv.config()

import User from '../models/user.js'

import contractAbi from '../PKPNFT.json' assert { type: 'json' }

const RPC_URL = process.env.LIT_RPC_URL
const PRIVATE_KEY = String(process.env.PRIVATE_KEY)
const ACCOUNT_ADDRESS = String(process.env.ACCOUNT_ADDRESS)
const CONTRACT_ADDRESS = String(process.env.CONTRACT_ADDRESS)

const JWT_SECRET = process.env.JWT_SECRET

export const userLogin = async (req, res) => {
  try {
    const { nik, password } = req.body

    let missingFields = []

    nik ? undefined : missingFields.push('nik')
    password ? undefined : missingFields.push('password')

    if (missingFields.length > 0) {
      return sendReturn(400, `Missing Field ${missingFields.join(', ')}`, res)
    }

    const currUser = await User.findOne({ nik: nik, isActive: true })

    if (currUser == null) {
      return sendReturn(400, `No user with nik ${nik}`, res)
    }

    const validate = await bcrypt.compare(password, currUser.passwordHash)

    if (!validate) {
      return sendReturn(400, "User don't match password", res)
    }

    const data = {
      nik: nik,
      address: currUser.ethAddress,
      time: Date.now(),
    }

    const token = jwt.sign(data, JWT_SECRET, { expiresIn: '5m' })

    return sendReturn(200, token, res)
  } catch (error) {
    return sendReturn(500, error.message, res)
  }
}

export const userRegister = async (req, res) => {
  try {
    const { nik, password } = req.body

    let missingFields = []

    nik ? undefined : missingFields.push('nik')
    password ? undefined : missingFields.push('password')

    if (missingFields.length > 0) {
      return sendReturn(400, `Missing Field ${missingFields.join(', ')}`, res)
    }

    const currUser = await User.findOne({ nik: nik, isActive: true })

    if (currUser) {
      return sendReturn(
        400,
        `User with NIK ${currUser.nik} already existed`,
        res
      )
    }

    const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
    const signer = new ethers.Wallet(PRIVATE_KEY, provider)
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, signer)

    const mintCost = await contract.mintCost()
    const mintNext = await contract.mintNext(2, {
      from: ACCOUNT_ADDRESS,
      value: mintCost,
    })
    const tx = await mintNext.wait()
    const tokenId = String(tx.events[1].args.tokenId)
    const ethAddress = await contract.getEthAddress(tokenId)
    const transferOwnership = await contract.safeTransferFrom(
      ACCOUNT_ADDRESS,
      ethAddress,
      tokenId
    )

    const tx2 = await transferOwnership.wait()

    console.log('tokenId: ' + tokenId)
    console.log('ethAddress: ' + ethAddress)

    const saltRound = 10

    const salt = await bcrypt.genSalt(saltRound)
    const hash = await bcrypt.hash(password, salt)

    await new User({
      _id: nanoid(),
      nik: nik,
      passwordHash: hash,
      ethAddress: ethAddress,
      tokenId: tokenId,
      isActive: true,
    }).save()

    return sendReturn(200, 'OK', res)
  } catch (error) {
    return sendReturn(500, error.message, res)
  }
}
