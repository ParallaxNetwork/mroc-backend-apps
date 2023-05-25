import express from "express";
import { pkpMint } from "../controllers/pkp.js";

const router = express.Router();

router.post("/mint", pkpMint);

export default router;
