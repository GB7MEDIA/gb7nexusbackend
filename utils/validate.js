export const notEmpty = (string) => {
    return !!string;
}

export const isArray = (input) => {
    return Array.isArray(input);
}

export const validEmail = (email) => {
    if (!notEmpty(email)) {
        return false;
    } else {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
}

export const validPhonenumber = (phoneNumber) => {
    if (!notEmpty(phoneNumber)) {
        return false;
    } else {
        const pattern = /^\+?[0-9]{10,15}$/;
        return pattern.test(phoneNumber);
    }
};

export const validPassword = (password) => {
    if (!notEmpty(password)) {
        return false;
    } else {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return regex.test(password);
    }
}