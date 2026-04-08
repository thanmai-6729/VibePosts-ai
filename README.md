# 🧠 VibePosts AI — Mood-Based Real-Time Post Explorer

VibePosts AI is a premium, state-of-the-art full-stack platform that intelligently maps your emotional state to a world of real-time content. Using a proprietary "Natural Resonance" engine, it filters and themes the user experience based on your current vibe.

![VibePosts AI Preview](https://via.placeholder.com/1200x600.png?text=VibePosts+AI+Premium+SaaS+Platform)

## ✨ Key Features
- **📊 Global Mood Pulse**: A real-time trending widget that syncs your experience with popular global vibes (Happy, Focus, Stress, Calm).
- **🌊 Adaptive Backgrounds**: Dynamic, animated UI elements that shift colors and pulse patterns based on detected sentiment.
- **⚡ Real-Time WebSocket Search**: Instant, zero-latency filtering powered by Socket.io.
- **📝 Experience Creator**: Share your own vibes with a professional content creation modal.
- **📖 Premium Readability**: An immersive "Read Full Story" mode for distraction-free content consumption.
- **🎨 Elite SaaS Design**: A bright, professional aesthetic with high-end typography and smooth animations.

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Tailwind CSS v4, Lucide Icons, Socket.io Client.
- **Backend**: Node.js, Express.js, MongoDB Atlas (Mongoose).
- **Real-Time**: Socket.io (WebSocket).
- **Data Source**: DummyJSON (English Content).

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Connection String

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/thanmai-6729/VibePosts-ai.git

# Install Backend dependencies
cd backend
npm install

# Install Frontend dependencies
cd ../frontend
npm install
```

### 2. Configuration
Create a `.env` file in the `backend` directory:
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

### 3. Run Locally
```bash
# Start Backend (from /backend)
npm run dev

# Start Frontend (from /frontend)
npm run dev
```

## 🌐 Deployment
This project is configured for easy deployment on **Vercel** or **Render**.
- **Backend**: Deploy the `/backend` folder. Set `MONGO_URI` in environment variables.
- **Frontend**: Deploy the `/frontend` folder. Set `VITE_API_URL` to your backend's URL.

---
Built with ❤️ by the Artificial Resonance Laboratory.
