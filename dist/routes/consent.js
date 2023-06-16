import express from 'express';
import { consentAdd, consentDelete, consentGetList, } from '../controllers/consent.js';
import { jwtAuth } from '../controllers/jwt.js';
const router = express.Router();
router.post('/add', jwtAuth, consentAdd);
router.post('/delete', jwtAuth, consentDelete);
router.get('/get/list', jwtAuth, consentGetList);
export default router;
//# sourceMappingURL=consent.js.map