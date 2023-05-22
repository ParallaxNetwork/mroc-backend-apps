import express from "express";
import { jwtGenerate } from "../controllers/jwt.js";
const router = express.Router();
router.post("/generate", jwtGenerate);
export default router;
//# sourceMappingURL=jwt.js.map