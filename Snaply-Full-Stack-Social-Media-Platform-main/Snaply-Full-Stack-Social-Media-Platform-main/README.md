# Snaply-Full-Stack-Social-Media-Platform
Snaply is a full-featured Instagram clone built with the MERN stack (MongoDB, Express, React, Node.js) with real-time features using Socket.IO. It allows users to post, like, comment, follow/unfollow, chat in real-time, and manage their profiles, while ensuring secure route protection.

🌟 Features

User Authentication & Route Protection

Signup, login, and secure route protection using JWT.

Users cannot access protected routes without authentication.

Post Management

Create posts with text and images.

Delete posts (only author can delete).

Real-time likes and dislikes on posts.

Follow & Unfollow System

Follow/unfollow other users.

Authors cannot unfollow themselves.

Real-time updates on follow status.

Comments

Add comments to posts.

Comment dialog pops up on tapping comment icon.

Real-time updates of comments.

Notifications

Real-time notifications for likes in the heart icon sidebar.

View which user liked your post by clicking the heart icon.

Chat

Real-time messaging with Socket.IO.

Chat interface similar to Instagram.

Profile Management

Edit profile information (bio, gender, profile photo).

View own and other users’ profiles.

Security & Permissions

Only post authors can delete their posts.

Route protection to prevent unauthorized access.

🛠 Tech Stack

Frontend: React.js, Tailwind CSS

Backend: Node.js, Express.js

Database: MongoDB

Real-time Features: Socket.IO

Authentication: JWT (JSON Web Tokens)

File Storage: Local/Cloud (images for posts/profile photos)

📁 Folder Structure
snaply/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── socket/
│   └── index.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── redux/
│   │   └── App.jsx
└── README.md

🚀 Installation

Prerequisites: Node.js, npm, MongoDB

Clone the repository

git clone https://github.com/<your-username>/snaply.git
cd snaply


Backend Setup

cd backend
npm install


Create a .env file in backend/ with the following:

PORT=5000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-secret-key>


Start backend server:

npm run dev


Frontend Setup

cd ../frontend
npm install
npm start


Frontend will run on http://localhost:3000 and connect to backend API.

🔗 Usage

Signup and login to your account.

Create new posts and upload images.

Like/dislike posts and comment.

Follow/unfollow users.

Click the heart icon to see who liked your posts.

Chat in real-time with other users.

Edit your profile or profile photo anytime.

📸 Screenshots

(Add screenshots of your app here for better presentation)

💡 Features in Development / Optional Enhancements

Infinite scrolling of posts

Reels / Stories feature

Push notifications for mobile

Dark mode UI
