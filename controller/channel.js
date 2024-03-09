import {
    userModel,
    channelModel,
    channelUserModel,
    channelMessageModel
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

export const getAllChannelsController = async (req, res) => {
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

        const channels = await getData(channelModel);
        if (channels.length === 0) {
            return res.status(404).json({ error: "There are no channels!" });
        }

        const channelsWithCreatedByUserName = await Promise.all(channels.map(async (channel) => {
            const user = await getDataById(userModel, channel.createdBy);
            return {
                id: channel._id,
                channelname: channel.channelname,
                channelrights: channel.channelrights,
                createdBy: {
                    id: user._id,
                    name: user.name
                },
                createdAt: channel.createdAt,
                updatedAt: channel.updatedAt
            };
        }));

        return res.status(200).json({ message: "Successfully retrieved all channels!", data: { channels: channelsWithCreatedByUserName } });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const getAllChannelsByUserIdController = async (req, res) => {
    try {
        const currentUserId = req.userId;
        const currentUser = await isUser(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ error: "The user id you are logged in with does not exist!" });
        }

        const { userId } = req.params;

        const channelIdsResult = await getData(channelUserModel, { ['userId']: userId });
        if (channelIdsResult.length === 0) {
            return res.status(404).json({ error: "There were no channel ids found for this user!" });
        }

        const channelsData = await Promise.all(channelIdsResult.map(async (channelUser) => {
            const channelData = await getDataById(channelModel, channelUser.channelId);
            return channelData;
        }));

        const channelsWithCreatedByUserName = await Promise.all(channelsData.map(async (channel) => {
            const user = await getDataById(userModel, channel.createdBy);
            return {
                id: channel._id,
                channelname: channel.channelname,
                channelrights: channel.channelrights,
                createdBy: {
                    id: user._id,
                    name: user.name
                },
                createdAt: channel.createdAt,
                updatedAt: channel.updatedAt
            };
        }));

        return res.json({ message: "Successfully retrieved all channels!", data: { channels: channelsWithCreatedByUserName } });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
};


export const getChannelByIdController = async (req, res) => {
    try {
        const currentUserId = req.userId;
        const currentUser = await isUser(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ error: "The user id you are logged in with does not exist!" });
        }

        const { channelId } = req.params;
        const channel = await getDataById(channelModel, channelId);
        if (!channel) {
            return res.status(404).json({ error: "A channel with this id does not exist!" });
        }

        const user = await getDataById(userModel, channel.createdBy);

        const channelWithCreatedByUserName = {
            id: channel._id,
            channelname: channel.channelname,
            channelrights: channel.channelrights,
            createdBy: {
                id: user._id,
                name: user.name
            },
            createdAt: channel.createdAt,
            updatedAt: channel.updatedAt
        };

        return res.status(200).json({ message: "Successfully retrieved channel!", data: { channel: channelWithCreatedByUserName } });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const getChannelMessagesByChannelIdController = async (req, res) => {
    try {
        const currentUserId = req.userId;
        const currentUser = await isUser(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ error: "The user id you are logged in with does not exist!" });
        }

        const { channelId } = req.params;
        const channel = await getDataById(channelModel, channelId);
        if (!channel) {
            return res.status(404).json({ error: "A channel with this id does not exist!" });
        }

        const messages = await getData( channelMessageModel, { ['channelId']: channelId } );
        if (messages.length === 0) {
            return res.status(404).json({ error: "There are no messages for this channel id!" });
        }

        const messagesWithUserNames = await Promise.all(messages.map(async (message) => {
            const user = await getDataById(userModel, message.userId);
            return { id: message._id, channelId: message.channelId, user: { id: user._id, name: user.name }, title: message.title, text: message.text, createdAt: message.createdAt, updatedAt: message.updatedAt };
        }));

        return  res.status(200).json({ message: "Successfully retrieved all messages!", data: { messages: messagesWithUserNames } });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const getChannelMessageByMessageIdController = async (req, res) => {
    try {
        const currentUserId = req.userId;
        const currentUser = await isUser(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ error: "The user id you are logged in with does not exist!" });
        }

        const { messageId } = req.params;

        const message = await getDataById( channelMessageModel, messageId );
        if (!message) {
            return res.status(404).json({ error: "A channel with this id does not exist!" });
        }

        return  res.status(200).json({ message: "Successfully retrieved message!", data: { message: message } });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const getChannelUsersByChannelIdController = async (req, res) => {
    try {
        const currentUserId = req.userId;
        const currentUser = await isUser(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ error: "The user id you are logged in with does not exist!" });
        }

        const { channelId } = req.params;
        const channel = await getDataById(channelModel, channelId);
        if (!channel) {
            return res.status(404).json({ error: "A channel with this id does not exist!" });
        }

        const usersIds = await getData( channelUserModel, { ['channelId']: channelId } );
        if (usersIds.length === 0) {
            return res.status(404).json({ error: "There are no users for this channel id!" });
        }

        const users = await Promise.all(
            usersIds.map(async (user) => {
                const userData = await getDataById(userModel, user.userId);
                return { _id: userData._id, name: userData.name, isAdmin: user.isAdmin };
            })
        );

        return  res.status(200).json({ message: "Successfully retrieved all users!", data: { users } });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const createChannelController = async (req, res) => {
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

        const { channelname, channelusers, channelrights } = req.body;

        const channel = await getDataByValue( channelModel, { ['channelname']: channelname } );
        if (channel) {
            return res.status(404).json({ error: "A channel with this name already exists!" });
        }

        let newChannel = {
            channelname,
            channelrights,
            createdBy: currentUserId
        };

        const createdChannel = await createData(channelModel, newChannel);
        
        if (createdChannel) {
            await Promise.all(channelusers.map(async (user) => {

                const existingUser = await getDataById(userModel, user[0]);

                if (existingUser) {
                    let newChannelUser = {
                        channelId: createdChannel._id,
                        userId: user[0],
                        isAdmin: user[1]
                    };
                    
                    await createData(channelUserModel, newChannelUser);
                }
            }));
        }

        return res.status(200).json({ message: "Successfully created this channel!" });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const createChannelMessageByChannelIdController = async (req, res) => {
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

        const { channelId } = req.params;
        const channel = await getDataById(channelModel, channelId);
        if (!channel) {
            return res.status(404).json({ error: "A channel with this id does not exist!" });
        }

        const { title, text } = req.body;

        let newChannelMessage = {
            channelId,
            userId: currentUserId,
            title,
            text
        }

        await createData(channelMessageModel, newChannelMessage);

        return res.status(200).json({ message: "Successfully send message!" });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const editChannelByIdController = async (req, res) => {
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

        const { channelId } = req.params;

        const channelAdmin = await isChannelAdmin(currentUserId, channelId);
        if (!channelAdmin) {
            return res.status(403).json({ error: "You are unauthorized for this action!" });
        }

        const channel = await getDataById(channelModel, channelId);
        if (!channel) {
            return res.status(404).json({ error: "A channel with this id does not exist!" });
        }

        const { channelname, channelusers, channelrights } = req.body;

        const editedChannel = await editDataById(channelModel, channelId, { channelname: channelname, channelrights: channelrights });
        if (editedChannel) {
            const existingUsers = await getData(channelUserModel, { ['channelId']: channelId });
            const existingUserIds = existingUsers.map(user => user.userId);

            const channelUserIds = channelusers.map(channelUser => channelUser[0]);
            const usersToRemove = existingUserIds.filter(existingUserId => !channelUserIds.includes(existingUserId.toString()));
            const usersToAdd = channelusers.filter(channelUser => !existingUserIds.includes(channelUser[0]));

            const removePromises = usersToRemove.map(async user => {
                await deleteDataByValue(channelUserModel, {['userId']: user.toString(), ['channelId']: channelId});
            });

            const addPromises = usersToAdd.map(async user => {
                const existingUser = await getDataById(userModel, user[0]);
              
                if (existingUser) {
                  const existingInChannel = await getDataByValue(channelUserModel, { ['userId']: user[0], ['channelId']: channelId });
              
                  if (!existingInChannel) {
                    let newChannelUser = {
                      channelId,
                      userId: user[0],
                      isAdmin: user[1]
                    };
              
                    await createData(channelUserModel, newChannelUser);
                  }
                }
            });
        
            await Promise.all([
                ...removePromises,
                ...addPromises
            ]);
        }

        return res.status(200).json({ message: "Successfully edited channel!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const editChannelMessageByIdController = async (req, res) => {
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

        const message = await getDataById(channelMessageModel, messageId);
        if (!message) {
            return res.status(404).json({ error: "There is no message with this id!" });
        }
        
        const { title, text } = req.body;

        const editChannelMessage = await editDataById(channelMessageModel, messageId, { title, text });
        if (!editChannelMessage) {
            return;
        }

        return res.status(200).json({ message: "Successfully edited message!" });
    } catch (error) {
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

export const deleteChannelByIdController = async (req, res) => {
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

        const { channelId } = req.params;

        const channelAdmin = await isChannelAdmin(currentUserId, channelId);
        if (!channelAdmin) {
            return res.status(403).json({ error: "You are unauthorized for this action!" });
        }


        const channel = await getDataById(channelModel, channelId);
        if (!channel) {
            return res.status(404).json({ error: "A channel with this id does not exist!" });
        }

        const channelUsers = await getData(channelUserModel, { ['channelId']: channelId });
        await Promise.all(channelUsers.map(async (user) => {
            await deleteDataById(channelUserModel, user._id);
        }));

        const channelMessages = await getData(channelMessageModel, { ['channelId']: channelId });
        await Promise.all(channelMessages.map(async (message) => {
            await deleteDataById(channelMessageModel, message._id);
        }));

        await deleteDataById(channelModel, channelId);

        return res.status(200).json({ message: "Channel and all associated data successfully deleted." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}


export const deleteChannelMessageByIdController = async (req, res) => {
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

        await deleteDataById(channelMessageModel, messageId);

        return res.status(200).json({ message: "Successfully deleted message!" });
    } catch (error) { 
        return res.status(500).json({ error: "There was a server error please try again later!" });
    }
}

const isChannelAdmin = async (userId, channelId) => {
    try {
        if (! notEmpty(userId)) {
            return false;
        }

        const currentUser = await isUser(userId);
        if (!currentUser) {
            return false;
        }

        const channelUser = await getDataByValue(channelUserModel, { ['userId']: userId, ['channelId']: channelId });
        if (!channelUser) {
            return false;
        }

        if (channelUser.isAdmin === true) {
            return true;
        }

        return false;
    } catch (error) {
        return false;
    }
}