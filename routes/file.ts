import express from 'express'

import { filePost, fileGet, fileUser } from '../controllers/file.js'
import { userAuth } from '../controllers/user.js'

const router = express.Router()

router.post('/', userAuth, filePost)
router.get('/', userAuth, fileGet)
router.get('/user', userAuth, fileUser)

export default router
