const commentModel = require('../models/comment.model');
const postModel = require('../models/post.model');
const userModel = require('../models/user.model');
const { getReceiverSocketId, io } = require('../socket/socket');
const cloudinary = require("../utils/cloudinary.cjs");
const sharp = require('sharp');

module.exports.addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const userId = req.user.userId;

        if (!image) {
            return res.status(400).json({
                message: "Image is required",
                success: false
            })
        }

        // image upload to cloudinary
        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: 'inside' })
            .toFormat('jpeg', { quality: 80 })
            .toBuffer();

        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        const cloudResponse = await cloudinary.uploader.upload(fileUri);

        const post = await postModel.create({
            caption,
            author: userId,
            image: cloudResponse.secure_url
        })

        const user = await userModel.findById(userId);
        if (user) {
            user.posts.push(post._id);
            await user.save();
        }

        await post.populate({ path: 'author', select: '-password' });

        return res.status(201).json({
            message: "New post added",
            success: true,
            post
        })
    }
    catch (err) {
        console.log(err);
    }
}

module.exports.getAllPosts = async (req, res) => {
    try {
        const posts = await postModel.find().sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username profilePicture' })
            .populate({
                path: 'comments',
                sort: { createdAt: -1 },
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                }
            })

        return res.status(200).json({
            posts,
            success: true
        })
    }
    catch (err) {
        console.log(err);
    }
}

module.exports.getUserPost = async (req, res) => {
    try {
        const authorId = req.user.userId;

        const posts = await postModel.find({ author: authorId })
            .populate({ path: 'author', select: 'username profilePicture' })
            .populate({
                path: 'comments',
                sort: { createdAt: -1 },
                populate: {
                    path: 'author',
                    select: 'username profilePicture',
                    sort: { createdAt: -1 }
                }
        });

        return res.status(200).json({
            posts,
            success: true
        })
    }
    catch (err) {
        console.log(err.message);
    }
}

module.exports.likePost = async (req, res) => {
    try {
        const userId = req.user.userId;
        const postId = req.params.id;

        const post = await postModel.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: 'Post not found',
                success: false
            });
        }

        await post.updateOne({ $addToSet: { likes: userId } });
        await post.save();

        // Implement Socketio for real time notification
        const user = await userModel.findById(userId).select('username profilePicture');
        const postOwnerId = post.author.toString();
        if (postOwnerId != userId) {
            // emit a notification event
            const notification = {
                type: 'like',
                userId: userId,
                userDetails: user,
                postId,
                message: "Your post was liked"
            }
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification', notification);
        }

        return res.status(200).json({
            message: 'Post liked',
            success: true
        })
    }
    catch (err) {
        console.log(err);
    }
}

module.exports.disLikePost = async (req, res) => {
    try {
        const userId = req.user.userId;
        const postId = req.params.id;

        const post = await postModel.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: 'Post not found',
                success: false
            });
        }

        await post.updateOne({ $pull: { likes: userId } });
        await post.save();

        // Implement Socketio for real time notification

        const user = await userModel.findById(userId).select('username profilePicture');
        const postOwnerId = post.author.toString();
        if (postOwnerId != userId) {
            // emit a notification event
            const notification = {
                type: 'dislike',
                userId: userId,
                userDetails: user,
                postId,
                message: "Your post was Disliked"
            }
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification', notification);
        }
        
        return res.status(200).json({
            message: 'Post disLiked',
            success: true
        })
    }
    catch (err) {
        console.log(err);
    }
}

module.exports.addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.userId;

        const { text } = req.body;

        if (!text) {
            return res.status(400).json({
                message: 'Text is required',
                success: false
            })
        }

        const comment = await commentModel.create({
            text,
            author: userId,
            post: postId
        })

        await comment.populate({
            path: 'author',
            select: 'username profilePicture'
        })

        const post = await postModel.findById(postId);
        post.comments.push(comment._id);

        await post.save();

        return res.status(201).json({
            message: 'Comment added',
            success: true,
            comment
        })
    }
    catch (err) {
        console.log(err.message);
    }
}

module.exports.getCommentsOfPost = async (req, res) => {
    try {
        const postId = req.params.id;

        const comments = await commentModel.find({ post: postId })
            .populate('author', 'username profilePicture')

        if (!comments) {
            return res.status(404).json({
                message: 'No Comments found for this post',
                success: false
            });
        }

        return res.status(200).json({
            comments,
            success: true
        })

    }
    catch (err) {
        console.log(err);
    }
}

module.exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.user.userId;
        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false
            });
        }

        // check if the logged in user is the owner of the post
        if (post.author.toString() != authorId) {
            return res.status(403).json({
                message: 'Unauthorized'
            })
        }

        //delete post
        await postModel.findByIdAndDelete(postId);
        const user = await userModel.findById(authorId);

        user.posts = user.posts.filter(id => id.toString() != postId);
        await user.save();

        //delete associated comments
        await commentModel.deleteMany({ post: postId });

        return res.status(200).json({
            success: true,
            message: 'Post Deleted'
        })
    }
    catch (err) {
        console.log(err.message);
    }
}

module.exports.bookMarkPost = async (req, res) => {
    try {
        const authorId = req.user.userId;
        const postId = req.params.id;

        const post = await postModel.findById(postId);
        const user = await userModel.findById(authorId);

        if (!post) {
            return res.status(404).json({
                message: 'Post not found',
                success: false
            })
        }

        if (user.bookmarks.includes(post._id)) {

            // remove from the bookmark
            await user.updateOne({ $pull: { bookmarks: post._id } });

            await user.save();

            return res.status(200).json({
                type: 'unsaved',
                message: 'Post removed from bookmarked',
                success: true
            })
        } else {

            // need to be bookmark
            await user.updateOne({ $push: { bookmarks: post._id } });

            await user.save();

            return res.status(200).json({
                type: 'saved',
                message: 'Post Bookmarked',
                success: true
            })
        }
    }
    catch (err) {
        console.log(err.message);
    }
}
