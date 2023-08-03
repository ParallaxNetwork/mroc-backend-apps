import express from 'express';
import { userLogin, userRegister } from '../controller/user.js';
const router = express.Router();
router.post('/login', userLogin);
router.post('/', userRegister);
export default router;
//# sourceMappingURL=user.js.map