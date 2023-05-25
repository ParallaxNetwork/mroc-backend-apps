import express from "express";
import { foo, bar } from "../controllers/sign.js";
const router = express.Router();
router.post("/foo", foo);
router.post("/bar", bar);
export default router;
//# sourceMappingURL=sign.js.map