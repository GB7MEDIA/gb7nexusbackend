import { v5 as uuidv5 } from 'uuid';

export const generateCode = (string) => {
    try {
        const validString = typeof string == 'string';
        const name = validString + String(Date.now());

        return uuidv5(name, process.env.NAMESPACE);
    } catch (error) {
        throw error;
    }
}