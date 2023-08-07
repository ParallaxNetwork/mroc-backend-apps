import { Request, Response } from 'express'

import { accessLocalWallet, genAuthSig } from '../lib/thirdWeb.js'
import { serverAuth } from '../lib/server.js'

import User from '../models/User.js'
import File from '../models/File.js'
import Consent from '../models/Consent.js'
import { LocalWallet } from '@thirdweb-dev/wallets'

export const consentRequest = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { fileId } = req.query
    const user = req.session['user']
    const userPass = req.session['password']

    const file = await File.findOne({ _id: fileId, isActive: true })

    if (!file) {
      return res.status(200).send(`file with id ${fileId} not found`)
    }

    const wallet = await accessLocalWallet(user.encWallet, userPass)

    const currConsent = await Consent.findOne({
      owner: file.owner,
      receiver: await wallet.getAddress(),
      fileId: fileId,
    })

    if (currConsent) {
      return res
        .status(200)
        .send('there is already a consent with corresponding file')
    }

    await Consent.create({
      owner: file.owner,
      receiver: await wallet.getAddress(),
      fileId: fileId,
    })

    return res.status(200).send('OK')
  } catch (error) {
    console.log(error.message)
    return res.status(500).send(error.message)
  }
}

export const consentApprove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { consentId } = req.query
    const wallet: LocalWallet = req['wallet']

    await Consent.updateOne(
      {
        _id: consentId,
        owner: await wallet.getAddress(),
        isApproved: false,
        isActive: true,
      },
      { $set: { isApproved: true, authSig: await genAuthSig(wallet) } }
    )

    return res.status(200).send('OK')
  } catch (error) {
    console.log(error.message)
    return res.status(500).send(error.message)
  }
}

export const consentReject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { consentId } = req.query
    const wallet: LocalWallet = req['wallet']

    await Consent.updateOne(
      {
        _id: consentId,
        owner: await wallet.getAddress(),
        isApproved: false,
        isActive: true,
      },
      { $set: { isActive: false } }
    )

    return res.status(200).send('OK')
  } catch (error) {
    console.log(error.message)
    return res.status(500).send(error.message)
  }
}

export const consentAuth = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { fileId, walletAddress } = req.body
    const apiKey = req.header('x-api-key')

    if (!(await serverAuth(apiKey))) {
      return res.status(200).send('unauthorized')
    }

    const consent = await Consent.findOne({
      fileId: fileId,
      receiver: walletAddress,
      isApproved: true,
      isActive: true,
    })

    return res.status(200).send(consent)
  } catch (error) {
    console.log(error.message)
    return res.status(500).send(error.message)
  }
}

export const consentUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const walletAddress = await req['wallet'].getAddress()

    const consents = await Consent.find({
      owner: walletAddress,
      isActive: true,
    })

    return res.status(200).send(consents)
  } catch (error) {
    console.log(error.message)
    return res.status(500).send(error.message)
  }
}

// export const consentDelete = async (req, res) => {
//   try {
//     const { consentId } = req.body

//     if (typeof consentId != 'string') {
//       return sendReturn(400, 'Invalid ConsentId', res)
//     }

//     const currConsent = await Consent.findOne({
//       _id: consentId,
//       status: 'approved',
//       isActive: true,
//     })

//     if (!currConsent) {
//       return sendReturn(400, `No consent with ${consentId} id`, res)
//     }

//     currConsent.status = 'deleted'
//     currConsent.isActive = false
//     await currConsent.save()

//     return sendReturn(200, 'OK', res)
//   } catch (error) {
//     return sendReturn(500, error.message, res)
//   }
// }

// export const consentGetList = async (req, res) => {
//   try {
//     const consents = await Consent.find(
//       { owner: req.user, isActive: true },
//       { _id: 1, ownerId: 1, receiverId: 1, fileId: 1 }
//     )

//     if (consents.length < 1) {
//       return sendReturn(400, 'Does not yet have consent', res)
//     }

//     return sendReturn(200, consents, res)
//   } catch (error) {
//     return sendReturn(500, error.message, res)
//   }
// }
