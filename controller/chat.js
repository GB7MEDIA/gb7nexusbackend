import {
    userModel,
    chatModel,
    chatUserModel,
    chatMessageModel
} from "../models/index.js";

import {
    getData,
    getDataById,
    getDataByValue,
    createData,
    editDataById,
    deleteDataById,
    deleteDataByValue
} from "./helper.js";

import {
    notEmpty
} from "../utils/index.js";

import {
    isUser,
    isAdmin
} from "./auth.js";

export const getAllChatsController = async (req, res) => {
    try {
        const currentUserId = req.userId;

        const currentUser = await isUser(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ error: "The user id you are logged in with does not exist!" });
        }

        const admin = await isAdmin(currentUserId);
        if (!admin) {
            return res.status(403).json({ error: "You are unauthorized for this action!" });
        }

        const chats = await getData(chatModel);
        if (chats.length === 0) {
            return res.status(404).json({ error: "There are no chats!" });
        }

        const chatsWithCreatedByUserName = await Promise.all(chats.map(async (chat) => {
            const user = await getDataById(userModel, chat.createdBy);
            return {
                id: chat._id,
                chatname: chat.chatname,
                chatrights: chat.chatrights,
                createdBy: {
                    id: user._id,
                    name: user.name
                },
                createdAt: chat.createdAt,
                updatedAt: chat.updatedAt
            };
        }));

        return res.status(200).json({ message: "Successfully retrieved all chats!", data: { chats: chatsWithCreatedByUserName } });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const getAllChatsByUserIdController = async (req, res) => {
    try {
        const currentUserId = req.userId;
        const currentUser = await isUser(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ error: "The user id you are logged in with does not exist!" });
        }

        const { userId } = req.params;

        const chatIdsResult = await getData(chatUserModel, { ['userId']: userId });
        if (chatIdsResult.length === 0) {
            return res.status(404).json({ error: "There were no chat ids found for this user!" });
        }

        const chatsData = await Promise.all(chatIdsResult.map(async (chatUser) => {
            const chatData = await getDataById(chatModel, chatUser.chatId);
            return chatData;
        }));

        const chatsWithCreatedByUserName = await Promise.all(chatsData.map(async (chat) => {
            const user = await getDataById(userModel, chat.createdBy);
            return {
                id: chat._id,
                chatname: chat.chatname,
                chatrights: chat.chatrights,
                createdBy: {
                    id: user._id,
                    name: user.name
                },
                createdAt: chat.createdAt,
                updatedAt: chat.updatedAt
            };
        }));

        return res.json({ message: "Successfully retrieved all chats!", data: { chats: chatsWithCreatedByUserName } });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
};


export const getChatByIdController = async (req, res) => {
    try {
        const currentUserId = req.userId;

        const currentUser = await isUser(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ error: "The user id you are logged in with does not exist!" });
        }

        const { chatId } = req.params;

        const chat = await getDataById(chatModel, chatId);
        if (!chat) {
            return res.status(404).json({ error: "A chat with this id does not exist!" });
        }

        const user = await getDataById(userModel, chat.createdBy);

        const chatWithCreatedByUserName = {
            id: chat._id,
            chatname: chat.chatname,
            chatrights: chat.chatrights,
            createdBy: {
                id: user._id,
                name: user.name
            },
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt
        };

        return res.status(200).json({ message: "Successfully retrieved chat!", data: { chat: chatWithCreatedByUserName } });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const getChatMessagesByChatIdController = async (req, res) => {
    try {
        const currentUserId = req.userId;

        const currentUser = await isUser(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ error: "The user id you are logged in with does not exist!" });
        }

        const { chatId } = req.params;

        const chat = await getDataById(chatModel, chatId);
        if (!chat) {
            return res.status(404).json({ error: "A chat with this id does not exist!" });
        }

        const messages = await getData(chatMessageModel, { ['chatId']: chatId });
        if (messages.length === 0) {
            return res.status(404).json({ error: "There are no messages for this chat id!" });
        }

        const messagesWithUserNames = await Promise.all(messages.map(async (message) => {
            const user = await getDataById(userModel, message.userId);
            return { id: message._id, chatId: message.chatId, user: { id: user._id, name: user.name }, text: message.text, createdAt: message.createdAt, updatedAt: message.updatedAt };
        }));

        return  res.status(200).json({ message: "Successfully retrieved all messages!", data: { messages: messagesWithUserNames } });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const getChatMessageByMessageIdController = async (req, res) => {
    try {
        const currentUserId = req.userId;

        const currentUser = await isUser(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ error: "The user id you are logged in with does not exist!" });
        }

        const { messageId } = req.params;

        const message = await getDataById(chatMessageModel, messageId);
        if (!message) {
            return res.status(404).json({ error: "A channel with this id does not exist!" });
        }

        return  res.status(200).json({ message: "Successfully retrieved message!", data: { message: message } });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const getChatUsersByChatIdController = async (req, res) => {
    try {
        const currentUserId = req.userId;

        const currentUser = await isUser(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ error: "The user id you are logged in with does not exist!" });
        }

        const { chatId } = req.params;

        const chat = await getDataById(chatModel, chatId);
        if (!chat) {
            return res.status(404).json({ error: "A chat with this id does not exist!" });
        }

        const userIds = await getData( chatUserModel, { ['chatId']: chatId } );
        if (userIds.length === 0) {
            return res.status(404).json({ error: "There are no users for this chat id!" });
        }

        const users = await Promise.all(
            userIds.map(async (user) => {
                const userData = await getDataById(userModel, user.userId);
                return { _id: userData._id, name: userData.name, isAdmin: user.isAdmin };
            })
        );

        return  res.status(200).json({ message: "Successfully retrieved all users!", data: { users } });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const createChatController = async (req, res) => {
    try {
        const currentUserId = req.userId;

        const currentUser = await isUser(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ error: "The user id you are logged in with does not exist!" });
        }

        const { chatname, chatusers, chatrights } = req.body;

        const chat = await getDataByValue(chatModel, { ['chatname']: chatname });
        if (chat) {
            return res.status(404).json({ error: "A chat with this name already exists!" });
        }

        let newChat = {
            chatname,
            chatrights,
            createdBy: currentUserId
        };

        const createdChat = await createData(chatModel, newChat);
        
        if (createdChat) {
            await Promise.all(chatusers.map(async (user) => {
                const existingUser = await getDataById(userModel, user[0]);

                if (existingUser) {
                    let newChatUser = {
                        chatId: createdChat._id,
                        userId: user[0],
                        isAdmin: user[1]
                    };
                    
                    await createData(chatUserModel, newChatUser);
                }
            }));
        }

        return res.status(200).json({ message: "Successfully created this chat!" });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const createChatMessageByChatIdController = async (req, res) => {
    try {
        const currentUserId = req.userId;
        

        const currentUser = await isUser(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ error: "The user id you are logged in with does not exist!" });
        }

        const { chatId } = req.params;

        const chat = await getDataById(chatModel, chatId);
        if (!chat) {
            return res.status(404).json({ error: "A chat with this id does not exist!" });
        }

        const { text } = req.body;

        let newChatMessage = {
            chatId,
            userId: currentUserId,
            text
        }

        await createData(chatMessageModel, newChatMessage);

        return res.status(200).json({ message: "Successfully send message!" });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const editChatByIdController = async (req, res) => {
    try {
        const currentUserId = req.userId;

        const currentUser = await isUser(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ error: "The user id you are logged in with does not exist!" });
        }

        const { chatId } = req.params;

        const chatAdmin = await isChatAdmin(currentUserId, chatId);
        if (!chatAdmin) {
            return res.status(403).json({ error: "You are unauthorized for this action!" });
        }

        const chat = await getDataById(chatModel, chatId);
        if (!chat) {
            return res.status(404).json({ error: "A chat with this id does not exist!" });
        }

        const { chatname, chatusers, chatrights } = req.body;

        const editedChat = await editDataById(chatModel, chatId, { chatname, chatrights });
        if (editedChat) {
            const existingUsers = await getData(chatUserModel, { ['chatId']: chatId });
            const existingUserIds = existingUsers.map(user => user.userId);

            const chatUserIds = chatusers.map(chatUser => chatUser[0]);
        
            const usersToRemove = existingUserIds.filter(existingUserId => !chatUserIds.includes(existingUserId.toString()));
            const usersToAdd = chatusers.filter(chatUser => !existingUserIds.includes(chatUser[0]));

            const removePromises = usersToRemove.map(async user => {
                await deleteDataByValue(chatUserModel, { ['userId']: user.toString(), ['chatId']: chatId });
            });

            const addPromises = usersToAdd.map(async user => {
                const existingUser = await getDataById(userModel, user[0]);
              
                if (existingUser) {
                  const existingInChat = await getDataByValue(chatUserModel, { ['userId']: user[0], ['chatId']: chatId });
              
                  if (!existingInChat) {
                    let newChatUser = {
                      chatId,
                      userId: user[0],
                      isAdmin: user[1]
                    };
              
                    await createData(chatUserModel, newChatUser);
                  }
                }
            });
        
            await Promise.all([
                ...removePromises,
                ...addPromises
            ]);
        }

        return res.status(200).json({ message: "Successfully edited chat!" });
    } catch (error) {
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const editChatMessageByIdController = async (req, res) => {
    try {
        const currentUserId = req.userId;

        const currentUser = await isUser(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ error: "The user id you are logged in with does not exist!" });
        }

        const { messageId } = req.params;

        const message = await getDataById(chatMessageModel, messageId);
        if (!message) {
            return res.status(404).json({ error: "There is no message with this id!" });
        }
        
        const { text } = req.body;

        const editedMessage = await editDataById(chatMessageModel, messageId, { text });
        if (!editedMessage) {
            return;
        }

        return res.status(200).json({ message: "Successfully edited message!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const deleteChatByIdController = async (req, res) => {
    try {
        const currentUserId = req.userId;

        const currentUser = await isUser(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ error: "The user id you are logged in with does not exist!" });
        }

        const { chatId } = req.params;

        const admin = await isAdmin(currentUserId);
        const chatAdmin = await isChatAdmin(currentUserId, chatId);

        const chat = await getDataById(chatModel, chatId);
        if (!chat) {
            return res.status(404).json({ error: "A chat with this id does not exist!" });
        }

        if (!admin || !chatAdmin) {
            const chatUser = await getDataByValue(chatUserModel, { ['chatId']: chatId, ['userId']: currentUserId });
            if(!chatUser) {
                return res.status(404).json({ error: "You are no user in this chat!" });
            }

            const userChatMessages = await getData(chatMessageModel, { ['chatId']: chatId, ['userId']: currentUserId });
            await Promise.all(userChatMessages.map(async (message) => {
                await deleteDataById(chatMessageModel, message._id);
            }));

            await deleteDataById(chatUserModel, chatUser._id);

            return res.status(200).json({ message: "Successfully left chat and deleted all relevant chat data!" });
        }

        const chatUsers = await getData(chatUserModel, { ['chatId']: chatId });
        await Promise.all(chatUsers.map(async (user) => {
            await deleteDataById(chatUserModel, user._id);
        }));

        const chatMessages = await getData(chatMessageModel, { ['chatId']: chatId });
        await Promise.all(chatMessages.map(async (message) => {
            await deleteDataById(chatMessageModel, message._id);
        }));

        await deleteDataById(chatModel, chatId);

        return res.status(200).json({ message: "Chat and all associated data successfully deleted." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}


export const deleteChatMessageByIdController = async (req, res) => {
    try {
        const currentUserId = req.userId;

        const currentUser = await isUser(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ error: "The user id you are logged in with does not exist!" });
        }

        const { messageId } = req.params;

        await deleteDataById(chatMessageModel, messageId);

        return res.status(200).json({ message: "Successfully deleted message!" });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

const isChatAdmin = async (userId, chatId) => {
    try {
        if (! notEmpty(userId)) {
            return false;
        }

        const currentUser = await isUser(userId);
        if (!currentUser) {
            return false;
        }

        const chatUser = await getDataByValue(chatUserModel, { ['userId']: userId, ['chatId']: chatId });
        if (!chatUser) {
            return false;
        }

        if (chatUser.isAdmin === true) {
            return true;
        }

        return false;
    } catch (error) {
        return false;
    }
}