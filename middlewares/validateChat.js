import { notEmpty, isArray } from "../utils/index.js";

export const validateGetAllChats = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    next();
}

export const validateGetAllChatsByUserId = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { userId } = req.params;
    if (! notEmpty(userId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    if (userId !== currentUserId) {
        return res.status(403).json({ error: "You are unauthorized for this action!" });
    }

    next();
}

export const validateGetChatById = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { chatId } = req.params;
    if (! notEmpty(chatId)) {
        return res.status(400).json({ error: "The chat id can not be left empty!" });
    }

    next();
}

export const validateGetChatMessagesByChatId = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { chatId } = req.params;
    if (! notEmpty(chatId)) {
        return res.status(400).json({ error: "The chat id can not be left empty!" });
    }

    next();
}

export const validateGetChatMessageByMessageId = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { messageId } = req.params;
    if (! notEmpty(messageId)) {
        return res.status(400).json({ error: "The message id can not be left empty!" });
    }

    next();
}

export const validateGetChatUsersByChatId = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { chatId } = req.params;
    if (! notEmpty(chatId)) {
        return res.status(400).json({ error: "The chat id can not be left empty!" });
    }

    next();
}

export const validateCreateChat = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { chatname, chatusers, chatrights } = req.body;
    if (! notEmpty(chatname)) {
        return res.status(400).json({ error: "The chatname can not be left empty!" });
    }
    if (!isArray(chatusers) || !chatusers.every(user => isArray(user) && user.length === 2 &&  typeof user[0] === 'string' && typeof user[1] === 'boolean')) {
        return res.status(400).json({ error: "The chatusers array is not valid!" });
    }
    if (! notEmpty(chatrights)) {
        return res.status(400).json({ error: "The chatrights can not be left empty!" });
    }

    next();
}


export const validateCreateChatMessageByChatId = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { chatId } = req.params;
    if (! notEmpty(chatId)) {
        return res.status(400).json({ error: "The chat id can not be left empty!" });
    }

    const { text } = req.body;
    if (! notEmpty(text)) {
        return res.status(400).json({ error: "The text can not be left empty!" });
    }

    next();
}

export const validateEditChatById = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { chatId } = req.params;
    if (! notEmpty(chatId)) {
        return res.status(400).json({ error: "The chat id can not be left empty!" });
    }

    const { chatname, chatusers, chatrights } = req.body;
    if (! notEmpty(chatname)) {
        return res.status(400).json({ error: "The chat name can not be left empty!" });
    }
    if (!isArray(chatusers) || !chatusers.every(user => isArray(user) && user.length === 2 && typeof user[0] === 'string' && typeof user[1] === 'boolean')) {
        return res.status(400).json({ error: "The chatusers array is not valid!" });
    }
    if (! notEmpty(chatrights)) {
        return res.status(400).json({ error: "The chatrights can not be left empty!" });
    }

    next();
}

export const validateEditChatMessageByMessageId = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { messageId } = req.params;
    if (! notEmpty(messageId)) {
        return res.status(400).json({ error: "The message id can not be left empty!" });
    }

    const { text } = req.body;
    if (! notEmpty(text)) {
        return res.status(400).json({ error: "The text can not be left empty!" });
    }

    next();
}

export const validateDeleteChatById = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { chatId } = req.params;
    if (!notEmpty(chatId)) {
        return res.status(400).json({ error: "The chat id cannot be left empty!" });
    }

    next();
}

export const validateDeleteChatMessageByMessageId = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { messageId } = req.params;
    if (! notEmpty(messageId)) {
        return res.status(400).json({ error: "The message id can not be left empty!" });
    }

    next();
}