import express from "express";

import { foo } from "../controllers/sign.js";

const router = express.Router();

router.post("/foo", foo);

export default router;
