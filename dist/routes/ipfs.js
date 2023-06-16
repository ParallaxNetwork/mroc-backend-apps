import express from 'express';
import { ipfsPost, ipfsGetAll, ipfsGet } from '../controllers/ipfs.js';
import { jwtAuth } from '../controllers/jwt.js';
import { apiAuth } from '../controllers/api.js';
const router = express.Router();
router.post('/post', apiAuth, ipfsPost);
router.get('/get/all', jwtAuth, ipfsGetAll);
router.post('/get', jwtAuth, ipfsGet);
export default router;
//# sourceMappingURL=ipfs.js.map