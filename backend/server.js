require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const postRoutes = require('./routes/postRoutes');
const socketHandler = require('./socket/socket');
const { seedEnglishPosts } = require('./controllers/postController');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api', postRoutes);

const server = http.createServer(app);

// Socket.io
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

socketHandler(io);

// Connect DB and Start Server
connectDB().then(() => {
    seedEnglishPosts();
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
