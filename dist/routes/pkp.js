"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pkp_1 = require("../controllers/pkp");
const router = express_1.default.Router();
router.post("/mint", pkp_1.pkpMint);
exports.default = router;
//# sourceMappingURL=pkp.js.map