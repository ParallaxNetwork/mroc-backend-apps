import express from 'express';
import { ipfsPost } from '../controllers/ipfs.js';
import { jwtAuth } from '../controllers/jwt.js';
const router = express.Router();
router.post("/post", jwtAuth, ipfsPost);
export default router;
//# sourceMappingURL=ipfs.js.map