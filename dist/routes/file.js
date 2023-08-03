import express from 'express';
import { filePost, fileGet } from '../controllers/file.js';
import { userAuth } from '../controllers/user.js';
const router = express.Router();
router.post('/', userAuth, filePost);
router.get('/:id', userAuth, fileGet);
export default router;
//# sourceMappingURL=file.js.map