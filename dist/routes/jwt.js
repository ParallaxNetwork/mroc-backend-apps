import express from "express";
import { jwtGenerate, jwtVerify } from "../controllers/jwt.js";
const router = express.Router();
router.post("/generate", jwtGenerate);
router.post("/verify", jwtVerify);
export default router;
//# sourceMappingURL=jwt.js.map