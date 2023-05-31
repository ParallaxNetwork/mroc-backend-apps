import express from 'express';
import { ipfsPost } from '../controllers/ipfs.js';
const router = express.Router();
router.post("/post", ipfsPost);
export default router;
//# sourceMappingURL=ipfs.js.map