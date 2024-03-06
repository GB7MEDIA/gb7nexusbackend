import { notEmpty, validEmail, validPhonenumber, validPassword } from "../utils/index.js";

export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!validEmail(email)) {
        return res.status(400).json({ error: "The email has to be valid!" });
    }

    if (!validPassword(password)) {
        return res.status(400).json({ error: "The password has to be valid!" });
    }

    next();
};

export const validateRegister = (req, res, next) => {
    const { name, email, phonenumber, password } = req.body;

    if (! notEmpty(name)) {
        return res.status(400).json({ error: "The name can not be left empty!" });
    }

    if (! validEmail(email)) {
        return res.status(400).json({ error: "The email has to be valid!" });
    }

    if (! validPhonenumber(phonenumber)) {
        return res.status(400).json({ error: "The phonenumber has to be valid!" });
    }

    if (! validPassword(password)) {
        return res.status(400).json({ error: "The password has to be valid!" });
    }

    next();
}

export const validateForgotPassword = (req, res, next) => {
    const { email } = req.body;
    
    if (! validEmail(email)) {
        return res.status(400).json({ error: "The email has to be valid!" });
    }

    next();
}

export const validateNewPassword = (req, res, next) => {
    const { userId, newPasswordCode, newPassword } = req.body;

    if (! notEmpty(userId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    if (! notEmpty(newPasswordCode)) {
        return res.status(400).json({ error: "The new password code can not be left empty!" });
    }

    if (! validPassword(newPassword)) {
        return res.status(400).json({ error: "The password has to be valid!" });
    }

    next();
}

export const validateActivateAccount = (req, res, next) => {
    const { userId, activationCode } = req.body;

    if (! notEmpty(userId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    if (! notEmpty(activationCode)) {
        return res.status(400).json({ error: "The activate account code can not be left empty!" });
    }

    next();
}

export const validateTwoFactorAuthentication = (req, res, next) => {
    const { userId, tfaCode } = req.body;

    if (! notEmpty(userId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    if (! notEmpty(tfaCode)) {
        return res.status(400).json({ error: "The two factor auth code can not be left empty!" });
    }

    next();
}

export const validateIsLoggedIn = (req, res, next) => {
    const currentUserId = req.userId;

    if (! notEmpty(currentUserId)) {
        return { loggedIn: false, admin: false }
    }

    next();
}