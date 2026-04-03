const userModel = require("../models/user.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const getDataUri = require("../utils/datauri");
const cloudinary = require("../utils/cloudinary.cjs");
const postModel = require("../models/post.model");
const { getReceiverSocketId, io } = require("../socket/socket");

module.exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(401).json({
                message: "All Fields are Required",
                success: false
            });
        }

        const user = await userModel.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: "User Already Registered",
            })
        };

        const hashedPassword = await bcrypt.hash(password, 10);

        await userModel.create({
            username,
            email,
            password: hashedPassword
        })

        return res.status(201).json({
            message: "Account created successfully",
            success: true
        })
    }
    catch (err) {
        console.log(err.message)
    }
}

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).jsoon({
                message: "All Fields are Required",
                success: false
            })
        }

        let user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Incorrect Email or Password",
                success: false
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Incorrect Email or Password",
                success: false
            });
        }

        const token = await jwt.sign({
            userId: user._id,
            email: user.email
        }, process.env.JWT_SECRET, { expiresIn: '1d' })

        const populatedPost = await Promise.all([
            user.posts?.map(async (postId)=>{
                const post = await postModel.findById(postId);
                if(post?.author?.equals(user._id)){
                    return post;
                }
                return null;
            })
        ])

        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            picture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: populatedPost
        }

        return res.status(201).cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
            message: `Welcome back ${user.username}`,
            success: true,
            user
        })
    }
    catch (err) {
        console.log(err.message);
    }
}

module.exports.logout = async (_, res) => {
    try {
        return res.cookie('token', '', { maxAge: 0 }).json({
            message: "Logged out successfully",
            success: true
        })
    }
    catch (err) {
        console.log(err.message)
    }
}

module.exports.getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userModel.findOne({ _id: userId }).populate({path:'posts',createdAt:-1}).populate('bookmarks');
        
        return res.status(200).json({
            user,
            success: true
        })
    }
    catch (err) {
        console.log(err.message)
    }
}

module.exports.editProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const { bio, gender } = req.body;
        const profilePicture = req.file;
        let cloudResponse;

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await userModel.findOne({ _id: userId }).select('-password');
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            })
        }

        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({
            message: 'Profile Updated',
            success: true,
            user
        })
    }
    catch (err) {
        console.log(err.message);
    }
}

module.exports.getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user.userId;
        const suggestedUsers = await userModel.find({ _id: { $ne: userId } }).select('-password');
        if (!suggestedUsers) {
            return res.status(400).json({
                message: "Currently do not have any users",
            })
        };
        return res.status(200).json({
            users: suggestedUsers,
            success: true
        })
    }
    catch (err) {
        console.log(err.message);
    }
}

module.exports.followOrUnfollow = async (req, res) => {
    try {
        const userId = req.user.userId;
        const followerId = req.params.id;

        if (userId == followerId) {
            return res.status(400).json({
                message: 'You can not follow or unfollow yourself',
                success: false
            });
        }

        const user = await userModel.findOne({ _id: userId });
        const targetUser = await userModel.findOne({ _id: followerId });

        if (!user || !targetUser) {
            return res.status(400).json({
                message: 'User not found',
                success: false
            });
        }

        const isFollowing = user.following.includes(followerId);

        
        const ownerSocketId = getReceiverSocketId(userId);
        const ReceiverSocketId = getReceiverSocketId(followerId);
        
        if (isFollowing) {
            // unfollow logic
            await Promise.all([
                userModel.updateOne({ _id: userId }, { $pull: { following: followerId } }),
                userModel.updateOne({ _id: followerId }, { $pull: { followers: userId } })
            ])

            const follownotification = {
                type:'unfollow',
                userId : userId,
                followerId : followerId
            }

            io.to(ownerSocketId).emit('follownotification',follownotification)

            return res.status(200).json({
                message: 'Unfollow successfully',
                success: true,
            })
        } else {
            // follow logic
            await Promise.all([
                userModel.updateOne({ _id: userId }, { $push: { following: followerId } }),
                userModel.updateOne({ _id: followerId }, { $push: { followers: userId } })
            ])


            const follownotification = {
                type:'follow',
                userId : userId,
                followerId : followerId
            }

            io.to(ownerSocketId).emit('follownotification',follownotification)

            return res.status(200).json({
                message: 'Follow successfully',
                success: true,
            })
        }
    }
    catch (err) {
        console.log(err.message)
    }
}
