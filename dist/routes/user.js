import express from 'express';
import { userLogin, userRegister } from '../controllers/user.js';
const router = express.Router();
router.get('/', userLogin);
router.post('/', userRegister);
export default router;
//# sourceMappingURL=user.js.map