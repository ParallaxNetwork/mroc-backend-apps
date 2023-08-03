import express from 'express';
import { filePost, fileGet } from '../controllers/file.js';
const router = express.Router();
router.post('/', filePost);
router.get('/:id', fileGet);
export default router;
//# sourceMappingURL=ipfs.js.map