import { Request, Response } from 'express'
import { generatePKP } from '../lib/litProtocol.js'
import { genLocalWallet } from '../lib/thirdWeb.js'
import { hashPassword, validatePassword } from '../lib/password.js'

import User from '../models/User.js'

export const userLogin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { nik, password } = req.query as { nik: string; password: string }

    const user = await User.findOne({ nik: nik, isActive: true })

    if (user == null) {
      return res.status(200).send(`No user with nik ${nik}`)
    }

    const validate = await validatePassword(password, user.passHash)

    if (!validate) {
      return res.status(200).send("User don't match password")
    }

    req.session['password'] = password
    req.session['encWallet'] = user.encWallet
    req.session['nik'] = user.nik

    return res.status(200).send('OK')
  } catch (error) {
    console.log(error.message)
    return res.status(500).send(error.message)
  }
}

export const userRegister = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { nik, password } = req.body

    const user = await User.findOne({ nik: nik, isActive: true })

    if (user) {
      return res.status(200).send(`user with NIK ${user.nik} already existed`)
    }

    const hash = await hashPassword(password)

    const { wallet, encWallet } = await genLocalWallet(password)
    const { tokenId, ethAddress } = await generatePKP(wallet)

    await User.create({
      nik: nik,
      passHash: hash,
      pkpEth: ethAddress,
      pkpToken: tokenId,
      wallet: wallet,
      encWallet: encWallet,
    })

    return res.status(200).send('OK')
  } catch (error) {
    console.log(error.message)
    return res.status(500).send(error.message)
  }
}
