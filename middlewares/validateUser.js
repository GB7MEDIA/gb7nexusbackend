import { notEmpty, validEmail, validPhonenumber, validPassword } from "../utils/index.js";

export const validateGetAllUsers = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    next();
}

export const validateGetUserById = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { userId } = req.params;
    if (! notEmpty(userId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    next();
}

export const validateCreateUser = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { name, email, phonenumber, password } = req.body;

    if (! notEmpty(name)) {
        return res.status(400).json({ error: "The name can not be left empty!" });
    }

    if (! notEmpty(email)) {
        return res.status(400).json({ error: "The email can not be left empty!" });
    }

    if (! notEmpty(phonenumber)) {
        return res.status(400).json({ error: "The phonenumber can not be left empty!" });
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

export const validateEditUserById = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { name, email, phonenumber, twoFactorAuthType, role = 'user',} = req.body;
    
    if (!notEmpty(name)) {
        return res.status(400).json({ error: "The name can not be left empty!" });  
    }

    if (!notEmpty(email)) {
        return res.status(400).json({ error: "The email can not be left empty!" });  
    }

    if (!notEmpty(phonenumber)) {
        return res.status(400).json({ error: "The phonenumber can not be left empty!" });  
    }

    if (! validEmail(email)) {
        return res.status(400).json({ error: "The email has to be valid!" });
    }
    
    if (! validPhonenumber(phonenumber)) {
        return res.status(400).json({ error: "The phonenumber has to be valid!" });
    }

    if (!notEmpty(twoFactorAuthType)) {
        return res.status(400).json({ error: "The two factor auth type can not be left empty!" });
    }

    if (twoFactorAuthType !== "false" && twoFactorAuthType !== "email" && twoFactorAuthType !== "sms") {
        return res.status(400).json({ error: "The two factor auth type has to be valid!" });
    }

    next();
}

export const validateDeleteUserById = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    next();
}