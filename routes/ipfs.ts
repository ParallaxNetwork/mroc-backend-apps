import express from 'express'

import { ipfsPost, ipfsGet } from '../controllers/ipfs.js'

const router = express.Router()

router.post('/', ipfsPost)
// router.get('/get/all', ipfsGetAll)
router.get('/:id', ipfsGet)

export default router
