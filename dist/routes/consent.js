import express from "express";
import { consentAdd } from "../controllers/consent.js";
import { jwtAuth } from "../controllers/jwt.js";
const router = express.Router();
router.post("/add", jwtAuth, consentAdd);
export default router;
//# sourceMappingURL=consent.js.map