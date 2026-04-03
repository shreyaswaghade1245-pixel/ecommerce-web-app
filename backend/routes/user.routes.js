const express = require('express');
const isAuthenticated = require('../middlewares/isauthenticated');
const { register, login, logout, getProfile, editProfile, getSuggestedUsers, followOrUnfollow } = require('../controllers/user.controller');
const upload = require('../middlewares/multer');
const route = express.Router();

route.post('/register', register);
route.post('/login', login);
route.get('/logout', logout);
route.get('/:id/profile', isAuthenticated, getProfile);
route.post('/:id/profile/edit', isAuthenticated, upload.single('profilePhoto'), editProfile);
route.get('/suggested', isAuthenticated, getSuggestedUsers);
route.get('/followOrUnfollow/:id', isAuthenticated, followOrUnfollow);

module.exports = route;


