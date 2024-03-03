import bcrypt from 'bcrypt';

const SaltRounds = 10;

export const hashPassword = async (password) => {
    try {
        return await bcrypt.hash(password, SaltRounds);
    } catch (error) {
        console.error("There was a server error!", error);
        return res.status(500).json({ error: "There was a server error! Please try again later." });
    }
}

export const comparePasswords = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
}