import { sendReturn } from '../lib/return.js'
import User from '../models/user.js'
import File from '../models/file.js'
import Consent from '../models/consent.js'
import { nanoid } from 'nanoid'

export const consentRequest = async (req, res) => {
  try {
    if (!req.facility) {
      return sendReturn(400, 'Not Authorized', res)
    }

    const { fileId } = req.body

    if (typeof fileId == 'undefined') {
      return sendReturn(400, 'Invalid File Id', res)
    }

    const file = await File.findOne({ _id: fileId, isActive: true })

    if (!file) {
      return sendReturn(400, `File with id ${fileId} not found`, res)
    }

    const currConsent = await Consent.findOne({
      owner: req.user,
      receiver: req.apiKey,
      fileId: fileId,
      isActive: true,
    })

    if (currConsent) {
      return sendReturn(
        400,
        'There is already a consent with corresponding file',
        res
      )
    }

    await new Consent({
      _id: nanoid(),
      owner: file.owner,
      receiver: req.facilityKey,
      fileId: fileId,
      status: 'requested',
      isActive: true,
    }).save()

    return sendReturn(200, 'OK', res)
  } catch (error) {
    return sendReturn(500, error.message, res)
  }
}

export const consentReject = async (req, res) => {
  try {
    const { consentId } = req.body

    if (typeof consentId != 'string') {
      return sendReturn(400, 'Invalid ConsentId', res)
    }

    const currConsent = await Consent.findOne({
      _id: consentId,
      status: 'requested',
      isActive: true,
    })

    if (!currConsent) {
      return sendReturn(400, `No consent with ${consentId} id`, res)
    }

    currConsent.isActive = false
    currConsent.status = 'rejected'
    await currConsent.save()

    return sendReturn(200, 'OK', res)
  } catch (error) {
    return sendReturn(500, error.message, res)
  }
}

export const consentApprove = async (req, res) => {
  try {
    const { consentId } = req.body

    if (typeof consentId != 'string') {
      return sendReturn(400, 'Invalid ConsentId', res)
    }

    const currConsent = await Consent.findOne({
      _id: consentId,
      status: 'requested',
      isActive: true,
    })

    if (!currConsent) {
      return sendReturn(400, `No consent with ${consentId} id`, res)
    }

    currConsent.status = 'approved'
    await currConsent.save()

    return sendReturn(200, 'OK', res)
  } catch (error) {
    return sendReturn(500, error.message, res)
  }
}

export const consentDelete = async (req, res) => {
  try {
    const { consentId } = req.body

    if (typeof consentId != 'string') {
      return sendReturn(400, 'Invalid ConsentId', res)
    }

    const currConsent = await Consent.findOne({
      _id: consentId,
      status: 'approved',
      isActive: true,
    })

    if (!currConsent) {
      return sendReturn(400, `No consent with ${consentId} id`, res)
    }

    currConsent.status = 'deleted'
    currConsent.isActive = false
    await currConsent.save()

    return sendReturn(200, 'OK', res)
  } catch (error) {
    return sendReturn(500, error.message, res)
  }
}

export const consentGetList = async (req, res) => {
  try {
    const consents = await Consent.find(
      { owner: req.user, isActive: true },
      { _id: 1, ownerId: 1, receiverId: 1, fileId: 1 }
    )

    if (consents.length < 1) {
      return sendReturn(400, 'Does not yet have consent', res)
    }

    return sendReturn(200, consents, res)
  } catch (error) {
    return sendReturn(500, error.message, res)
  }
}
