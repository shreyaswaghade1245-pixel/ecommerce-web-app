const express = require('express');
const isAuthenticated = require('../middlewares/isauthenticated');
const { sendMessage, getMessages } = require('../controllers/message.controller');
const route = express.Router();

route.post('/send/:id', isAuthenticated, sendMessage);
route.get('/all/:id', isAuthenticated, getMessages);

module.exports = route;