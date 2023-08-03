import express from 'express'

import { jwtAuth } from '../controllers/jwt.js'
import { apiAuth } from '../controllers/api.js'

import {
  consentRequest,
  consentApprove,
  consentReject,
  consentGetList,
  consentDelete,
} from '../controllers/consent.js'

const router = express.Router()

router.post('/request', apiAuth, consentRequest)
router.post('/approve', jwtAuth, consentApprove)
router.post('/reject', jwtAuth, consentReject)
router.post('/delete', jwtAuth, consentDelete)
router.get('/get/list', jwtAuth, consentGetList)

export default router
