import { notEmpty, isArray } from "../utils/index.js";

export const validateGetAllChannels = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    next();
}

export const validateGetAllChannelsByUserId = (req, res, next) => {
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

export const validateGetChannelById = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { channelId } = req.params;
    if (! notEmpty(channelId)) {
        return res.status(400).json({ error: "The channel id can not be left empty!" });
    }

    next();
}

export const validateGetChannelMessagesByChannelId = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { channelId } = req.params;
    if (! notEmpty(channelId)) {
        return res.status(400).json({ error: "The channel id can not be left empty!" });
    }

    next();
}

export const validateGetChannelMessageByMessageId = (req, res, next) => {
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

export const validateGetChannelUsersByChannelId = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { channelId } = req.params;
    if (! notEmpty(channelId)) {
        return res.status(400).json({ error: "The channel id can not be left empty!" });
    }

    next();
}

export const validateCreateChannel = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { channelname, channelusers, channelrights } = req.body;
    if (! notEmpty(channelname)) {
        return res.status(400).json({ error: "The channel name can not be left empty!" });
    }

    if (!isArray(channelusers) || !channelusers.every(user => isArray(user) && user.length === 2 &&  typeof user[0] === 'string' && typeof user[1] === 'boolean')) {
        return res.status(400).json({ error: "The channelusers array is not valid!" });
    }
    if (! notEmpty(channelrights)) {
        return res.status(400).json({ error: "The channel rights can not be left empty!" });
    }

    next();
}


export const validateCreateChannelMessageByChannelId = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { channelId } = req.params;
    if (! notEmpty(channelId)) {
        return res.status(400).json({ error: "The channel id can not be left empty!" });
    }

    const { title, text } = req.body;
    if (! notEmpty(title)) {
        return res.status(400).json({ error: "The title can not be left empty!" });
    }
    if (! notEmpty(text)) {
        return res.status(400).json({ error: "The text can not be left empty!" });
    }

    next();
}

export const validateEditChannelById = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { channelId } = req.params;
    if (! notEmpty(channelId)) {
        return res.status(400).json({ error: "The channel id can not be left empty!" });
    }

    const { channelname, channelusers, channelrights } = req.body;
    if (! notEmpty(channelname)) {
        return res.status(400).json({ error: "The channel name can not be left empty!" });
    }
    if (!isArray(channelusers) || !channelusers.every(user => isArray(user) && user.length === 2 && typeof user[0] === 'string' && typeof user[1] === 'boolean')) {
        return res.status(400).json({ error: "The channelusers array is not valid!" });
    }
    if (! notEmpty(channelrights)) {
        return res.status(400).json({ error: "The channel rights can not be left empty!" });
    }

    next();
}

export const validateEditChannelMessageByMessageId = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { messageId } = req.params;
    if (! notEmpty(messageId)) {
        return res.status(400).json({ error: "The message id can not be left empty!" });
    }

    const { title, text } = req.body;
    if (! notEmpty(title)) {
        return res.status(400).json({ error: "The title can not be left empty!" });
    }
    if (! notEmpty(text)) {
        return res.status(400).json({ error: "The text can not be left empty!" });
    }

    next();
}

export const validateDeleteChannelById = (req, res, next) => {
    const currentUserId = req.userId;
    if (! notEmpty(currentUserId)) {
        return res.status(400).json({ error: "The user id can not be left empty!" });
    }

    const { channelId } = req.params;
    if (!notEmpty(channelId)) {
        return res.status(400).json({ error: "The channel id cannot be left empty!" });
    }

    next();
}

export const validateDeleteChannelMessageByMessageId = (req, res, next) => {
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