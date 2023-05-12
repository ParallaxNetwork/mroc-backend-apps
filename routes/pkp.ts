import express from "express";
import { pkpMint } from "../controllers/pkp";

const router = express.Router();

router.post("/mint", pkpMint);

export default router;
