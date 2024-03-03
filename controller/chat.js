import { userModel, chatModel, chatUserModel, chatMessageModel } from "../models/index.js";
import { getData, getDataById, getDataByValue, createData, deleteDataById } from "./helper.js";
import { notEmpty } from "../utils/index.js";
import { isUser, isAdmin } from "./auth.js";

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
        if (chats.response.length === 0) {
            return res.status(404).json({ error: "There are no chats!" });
        }

        return res.status(200).json({ message: "Successfully retrieved all chats!", data: { chats: chats.response } });
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

        const chatIdsResult = await getDataByValue(chatUserModel, {['userId']: userId});
        if (chatIdsResult.response.length === 0) {
            return res.status(404).json({ error: "There were no chat ids found for this user!" });
        }

        const chatsData = await Promise.all(chatIdsResult.response.map(async (chatUser) => {
            const chatData = await getDataById(chatModel, chatUser.chatId);
            return chatData.response;
        }));

        const validChats = chatsData.filter(chat => chat != null);

        return res.json({ message: "Successfully retrieved all chats!", data: { chats: validChats } });
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
        if (!chat.response) {
            return res.status(404).json({ error: "A chat with this id does not exist!" });
        }

        return res.status(200).json({ message: "Successfully retrieved chat!", data: { chat: chat.response } });
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
        if (!chat.response) {
            return res.status(404).json({ error: "A chat with this id does not exist!" });
        }

        const messages = await getDataByValue(chatMessageModel, {['chatId']: chatId});
        if (messages.response.length === 0) {
            return res.status(404).json({ error: "There are no messages for this chat id!" });
        }

        return  res.status(200).json({ message: "Successfully retrieved all messages!", data: { messages: messages.response } });
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
        if (!message.response) {
            return res.status(404).json({ error: "A channel with this id does not exist!" });
        }

        return  res.status(200).json({ message: "Successfully retrieved message!", data: { message: message.response } });
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
        if (!chat.response) {
            return res.status(404).json({ error: "A chat with this id does not exist!" });
        }

        const userIds = await getDataByValue( chatUserModel, { ['chatId']: chatId } );
        if (userIds.response.length === 0) {
            return res.status(404).json({ error: "There are no users for this chat id!" });
        }

        const users = await Promise.all(
            userIds.response.map(async (user) => {
                const userData = await getDataById(userModel, user.userId);
                return { _id: userData.response._id, name: userData.response.name, isAdmin: user.isAdmin };
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

        const admin = await isAdmin(currentUserId);
        if (!admin) {
            return res.status(403).json({ error: "You are unauthorized for this action!" });
        }

        const { chatname, chatusers, chatrights } = req.body;

        const chat = await getDataByValue(chatModel, { ['chatname']: chatname });
        if (chat.response.length > 0) {
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
                        chatId: createdChat.response._id,
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

        const admin = await isAdmin(currentUserId);
        if (!admin) {
            return res.status(403).json({ error: "You are unauthorized for this action!" });
        }

        const { chatId } = req.params;

        const chat = await getDataById(chatModel, chatId);
        if (!chat.response) {
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

        const admin = await isAdmin(currentUserId);
        if (!admin) {
            return res.status(403).json({ error: "You are unauthorized for this action!" });
        }

        const chatAdmin = await isChatAdmin(currentUserId);
        if (!chatAdmin) {
            return res.status(403).json({ error: "You are unauthorized for this action!" });
        }

        const { chatId } = req.params;

        const chat = await getDataById(chatModel, chatId);
        if (!chat.response) {
            return res.status(404).json({ error: "A chat with this id does not exist!" });
        }

        const { chatname, chatusers, chatrights } = req.body;

        chat.response.chatname = chatname;
        chat.response.chatrights = chatrights;
        const editedChat = await chat.response.save();

        if (editedChat) {
            const existingUsers = await getDataByValue(chatUserModel, {['chatId']: chatId});
            const existingUserIds = existingUsers.response.map(user => user.userId);

            const chatUserIds = chatusers.map(chatUser => chatUser[0]);
        
            const usersToRemove = existingUserIds.filter(existingUserId => !chatUserIds.includes(existingUserId.toString()));
            const usersToAdd = chatusers.filter(chatUser => !existingUserIds.includes(chatUser[0]));

            const removePromises = usersToRemove.map(async user => {
                const toDeletedId = await getDataByValue(chatUserModel, {['userId']: user.toString()});
                await deleteDataById(chatUserModel, toDeletedId.response[0]._id.toString());
            });

            const addPromises = usersToAdd.map(async user => {
                const existingUser = await getDataById(userModel, user[0]);
              
                if (existingUser.response) {
                  const existingInChat = await getDataByValue(chatUserModel, { ['userId']: user[0], ['chatId']: chatId });
              
                  if (!existingInChat.response[0]) {
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

        const admin = await isAdmin(currentUserId);
        if (!admin) {
            return res.status(403).json({ error: "You are unauthorized for this action!" });
        }

        const { messageId } = req.params;

        const message = await getDataById(chatMessageModel, messageId);
        if (!message) {
            return res.status(404).json({ error: "There is no message with this id!" });
        }
        
        const { text } = req.body;

        message.response.text = text;
        await message.response.save();

        return res.status(200).json({ message: "Successfully edited message!" });
    } catch (error) { 
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

        const admin = await isAdmin(currentUserId);
        const chatAdmin = await isChatAdmin(currentUserId);

        const { chatId } = req.params;

        const chat = await getDataById(chatModel, chatId);
        if (!chat.response) {
            return res.status(404).json({ error: "A chat with this id does not exist!" });
        }

        if (!admin || !chatAdmin) {
            const chatUser = await getDataByValue(chatUserModel, { ['chatId']: chatId, ['userId']: currentUserId });
            if(!chatUser.response) {
                return res.status(404).json({ error: "You are no user in this chat!" });
            }

            const userChatMessages = await getDataByValue(chatMessageModel, { ['chatId']: chatId, ['userId']: currentUserId });
            await Promise.all(userChatMessages.response.map(async (message) => {
                await deleteDataById(chatMessageModel, message._id);
            }));

            await deleteDataById(chatUserModel, chatUser.response._id);

            return res.status(200).json({ message: "Successfully left chat and deleted all relevant chat data!" });
        }

        const chatUsers = await getDataByValue(chatUserModel, {['chatId']: chatId});
        await Promise.all(chatUsers.response.map(async (user) => {
            await deleteDataById(chatUserModel, user._id);
        }));

        const chatMessages = await getDataByValue(chatMessageModel, {['chatId']: chatId});
        await Promise.all(chatMessages.response.map(async (message) => {
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

        const admin = await isAdmin(currentUserId);
        if (!admin) {
            return res.status(403).json({ error: "You are unauthorized for this action!" });
        }

        const { messageId } = req.params;

        await deleteDataById(chatMessageModel, messageId);

        return res.status(200).json({ message: "Successfully deleted message!" });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

const isChatAdmin = async (userId) => {
    try {
        if (! notEmpty(userId)) {
            return false;
        }

        const currentUser = await isUser(userId);
        if (!currentUser) {
            return false;
        }

        const chatUser = await getDataByValue(chatUserModel, { ['userId']: userId });
        if (!chatUser.response[0]) {
            return false;
        }

        if (chatUser.response[0].isAdmin === true) {
            return true;
        }

        return false;
    } catch (error) {
        return false;
    }
}