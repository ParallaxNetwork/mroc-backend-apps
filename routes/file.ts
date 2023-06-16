import express from 'express'
import { fileGetList } from '../controllers/file.js'
import { jwtAuth } from '../controllers/jwt.js'
import { apiAuth } from '../controllers/api.js'

const router = express.Router()

router.get('/get/list', jwtAuth, fileGetList)

export default router
