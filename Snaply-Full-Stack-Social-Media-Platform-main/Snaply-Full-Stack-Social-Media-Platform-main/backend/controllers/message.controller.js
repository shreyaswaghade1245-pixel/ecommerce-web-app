const conversationModel = require("../models/conversation.model");
const messageModel = require("../models/message.model");
const { getReceiverSocketId, io } = require("../socket/socket");


module.exports.sendMessage = async (req, res) => {
    try {
        const senderId = req.user.userId;
        const receiverId = req.params.id;

        const { textMessage : text } = req.body;

        const conversation = await conversationModel.findOne({ participants: { $all: [senderId, receiverId] } });

        if (!conversation) {
            conversation = await conversationModel.create({
                participants: [senderId, receiverId]
            })
        }

        const newMessage = await messageModel.create({
            senderId,
            receiverId,
            message: text
        })

        if (newMessage) conversation.messages.push(newMessage._id);

        await Promise.all([conversation.save(), newMessage.save()])

        // Implement socket io for real time data transfer
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage);
        }

        return res.status(201).json({
            success: true,
            newMessage
        })
    }
    catch (err) {
        console.log(err);
    }
}

module.exports.getMessages = async (req, res) => {
    try {
        const senderId = req.user.userId;
        const receiverId = req.params.id;

        const conversation = await conversationModel.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate('messages')

        if (!conversation) {
            return res.status(200).json({
                success: true,
                messages: []
            })
        }

        return res.status(200).json({
            success: true,
            messages: conversation?.messages
        })
    }
    catch (err) {
        console.log(err.message)
    }
}

