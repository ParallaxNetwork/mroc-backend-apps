export const sendReturn = (status, message, res) => {
    res.status(status).send({
        success: status == 200 ? true : false,
        message: message,
    });
};
//# sourceMappingURL=return.js.map