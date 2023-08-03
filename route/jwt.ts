import express from "express";

import { jwtVerify } from "../controllers/jwt.js";

const router = express.Router();

router.post("/verify", jwtVerify);

export default router;
