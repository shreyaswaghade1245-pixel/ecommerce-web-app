const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    receiverId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    message: {
        type: 'String',
        required: true
    }
})

const messageModel = mongoose.model('message', messageSchema);
module.exports = messageModel;