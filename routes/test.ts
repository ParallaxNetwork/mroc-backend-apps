import express from 'express'

import { test } from '../controllers/test.js'

const router = express.Router()

router.post('/', test)

export default router
