import express from 'express'
import { apiKeyAdd } from '../controllers/api.js'

const router = express.Router()

router.post("/add", apiKeyAdd)

export default router