"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendReturn = void 0;
const sendReturn = (status, message, res) => {
    res.status(status).send({
        success: status == 200 ? true : false,
        message: message,
    });
};
exports.sendReturn = sendReturn;
//# sourceMappingURL=return.js.map