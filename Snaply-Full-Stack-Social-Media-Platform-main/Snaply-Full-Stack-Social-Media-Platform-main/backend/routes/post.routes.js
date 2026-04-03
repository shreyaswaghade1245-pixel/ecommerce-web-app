const express = require('express');
const isAuthenticated = require('../middlewares/isauthenticated');
const upload = require('../middlewares/multer');
const { addNewPost, getAllPosts, getUserPost, likePost, disLikePost, addComment, getCommentsOfPost, deletePost, bookMarkPost } = require('../controllers/post.controller');

const route = express.Router();

route.post('/addpost', isAuthenticated, upload.single('image'), addNewPost);
route.get('/all', isAuthenticated, getAllPosts);
route.get('/userpost/all', isAuthenticated, getUserPost);
route.get('/:id/like', isAuthenticated, likePost);
route.get('/:id/dislike', isAuthenticated, disLikePost);
route.post('/:id/comment', isAuthenticated, addComment);
route.get('/:id/comment/all', isAuthenticated, getCommentsOfPost);
route.delete('/delete/:id', isAuthenticated, deletePost);
route.get('/:id/bookmark', isAuthenticated, bookMarkPost);

module.exports = route;


