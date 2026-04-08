const { io } = require("socket.io-client");

const socket = io("http://localhost:5000");

const moods = ["happy", "stress", "focus", "randomword", ""];
let moodIndex = 0;

socket.on("connect", () => {
    console.log("Connected to server via WebSocket");
    testNextMood();
});

function testNextMood() {
    if (moodIndex >= moods.length) {
        socket.disconnect();
        process.exit(0);
        return;
    }
    const mood = moods[moodIndex];
    console.log(`Testing mood: "${mood}"`);
    socket.emit("search", mood);
    moodIndex++;
}

socket.on("results", (posts) => {
    const lastMood = moods[moodIndex - 1];
    console.log(`Results for "${lastMood}": ${posts.length} posts`);
    if (posts.length > 0) {
        console.log(`  Sample: ${posts[0].title.substring(0, 50)}...`);
    }
    testNextMood();
});

socket.on("connect_error", (err) => {
    console.error("Connection error:", err.message);
    process.exit(1);
});

setTimeout(() => {
    console.error("Test timed out");
    process.exit(1);
}, 20000);
