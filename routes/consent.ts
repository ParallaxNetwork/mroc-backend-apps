import express from 'express'

import {
  consentRequest,
  consentApprove,
  consentReject,
  consentAuth,
  consentUser,
  // consentGetList,
  // consentDelete,
} from '../controllers/consent.js'

import { userAuth } from '../controllers/user.js'

const router = express.Router()

router.post('/', userAuth, consentRequest)
router.post('/approve', userAuth, consentApprove)
router.post('/reject', userAuth, consentReject)
router.post('/auth', consentAuth)
router.get('/user', userAuth, consentUser)
// router.post('/delete', jwtAuth, consentDelete)
// router.get('/get/list', jwtAuth, consentGetList)

export default router
