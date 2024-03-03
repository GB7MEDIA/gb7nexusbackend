import { v5 as uuidv5 } from 'uuid';

const NAMESPACE = "1b671a64-40d5-491e-99b0-da01ff1f3341";

export const generateCode = (string) => {
    const validString = String(string);
    const name = validString + String(Date.now());

    try {
        return uuidv5(name, NAMESPACE);
    } catch (error) {
        console.error("Error generating UUID:", error);
        throw error;
    }
}