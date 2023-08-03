import bcrypt from 'bcrypt';
export const validatePassword = async (pass, hash) => {
    try {
        const valid = await bcrypt.compare(pass, hash);
        return valid;
    }
    catch (error) {
        return error.message;
    }
};
export const hashPassword = async (pass) => {
    try {
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const hash = await bcrypt.hash(pass, salt);
        return hash;
    }
    catch (error) {
        return error.message;
    }
};
//# sourceMappingURL=password.js.map