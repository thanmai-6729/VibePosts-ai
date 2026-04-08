const Post = require('../models/Post');

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("Client connected");

        socket.on("search", async (query) => {
            console.log("Search query received:", query);
            
            try {
                let posts;
                if (!query || query.trim() === "") {
                    // If empty, return all posts
                    posts = await Post.find().sort({ createdAt: -1 });
                } else {
                    const moodMap = {
                        happy: ["love", "great", "good", "amazing"],
                        stress: ["error", "fail", "problem", "issue"],
                        focus: ["task", "work", "goal", "plan"]
                    };

                    const mood = query.toLowerCase().trim();
                    let keywords = moodMap[mood] || [query];

                    posts = await Post.find({
                        $or: [
                            { title: { $regex: keywords.join("|"), $options: "i" } },
                            { body: { $regex: keywords.join("|"), $options: "i" } }
                        ]
                    }).sort({ createdAt: -1 });
                }
                
                console.log(`Sending ${posts.length} results for query: "${query}"`);
                socket.emit("results", posts);
            } catch (error) {
                console.error("Socket search error:", error.message);
                socket.emit("results", []); // Return empty array on error
            }
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
    });
};
