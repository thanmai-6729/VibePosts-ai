import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { socket } from './socket';
import { 
  Search, Zap, MessageSquare, Info, Home, Compass, Plus, X, 
  Send, Award, Activity, MousePointer2, ExternalLink, Calendar, 
  User, TrendingUp, Sparkles, Heart, Target, AlertCircle
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [mood, setMood] = useState('default');
  const [isSearching, setIsSearching] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newPost, setNewPost] = useState({ title: '', body: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const exploreRef = useRef(null);
  const searchRef = useRef(null);
  const aboutRef = useRef(null);

  const trendingMoods = [
    { name: 'Happy', icon: <Heart size={16}/>, color: 'bg-green-100 text-green-600 border-green-200' },
    { name: 'Focus', icon: <Target size={16}/>, color: 'bg-blue-100 text-blue-600 border-blue-200' },
    { name: 'Stress', icon: <AlertCircle size={16}/>, color: 'bg-red-100 text-red-600 border-red-200' },
    { name: 'Calm', icon: <Sparkles size={16}/>, color: 'bg-purple-100 text-purple-600 border-purple-200' },
  ];

  useEffect(() => {
    // Initial fetch of posts
    const fetchInitialPosts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/posts`);
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching initial posts:', error);
      }
    };
    fetchInitialPosts();

    // Socket listener
    socket.on('results', (results) => {
      setPosts(results);
      setIsSearching(false);
    });

    return () => {
      socket.off('results');
    };
  }, []);

  const handleSearch = (e) => {
    const value = typeof e === 'string' ? e : e.target.value;
    setSearch(value);
    setIsSearching(true);
    
    // Determine mood
    const moods = ['happy', 'stress', 'focus', 'calm'];
    const currentMood = moods.find(m => value.toLowerCase().includes(m)) || 'default';
    setMood(currentMood);

    // Emit search
    socket.emit('search', value);
  };

  const scrollToSearch = () => {
    searchRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToExplore = () => {
    exploreRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(`${API_BASE_URL}/api/posts`, {
        ...newPost,
        userId: 1
      });
      setIsModalOpen(false);
      setNewPost({ title: '', body: '' });
      // Refresh posts via socket if searching, or refetch
      const response = await axios.get(`${API_BASE_URL}/api/posts`);
      setPosts(response.data);
      alert('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAccentColor = () => {
    switch (mood) {
      case 'happy': return 'border-mood-happy text-mood-happy ring-mood-happy/20';
      case 'stress': return 'border-mood-stress text-mood-stress ring-mood-stress/20';
      case 'focus': return 'border-mood-focus text-mood-focus ring-mood-focus/20';
      case 'calm': return 'border-purple-500 text-purple-600 ring-purple-500/20';
      default: return 'border-primary text-primary ring-primary/20';
    }
  };

  const getTextColor = () => {
    switch (mood) {
      case 'happy': return 'text-mood-happy';
      case 'stress': return 'text-mood-stress';
      case 'focus': return 'text-mood-focus';
      case 'calm': return 'text-purple-600';
      default: return 'text-primary';
    }
  };

  const getBgColor = () => {
    switch (mood) {
      case 'happy': return 'bg-mood-happy';
      case 'stress': return 'bg-mood-stress';
      case 'focus': return 'bg-mood-focus';
      case 'calm': return 'bg-purple-600';
      default: return 'bg-primary';
    }
  };

  return (
    <div className="min-h-screen font-sans bg-gray-50 scroll-smooth relative transition-colors duration-1000">
      
      {/* Dynamic Animated Background */}
      <div className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000 ${mood !== 'default' ? 'opacity-30' : 'opacity-0'}`}>
          <div className={`absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] mix-blend-multiply opacity-20 animate-pulse-slow ${getBgColor()}`}></div>
          <div className={`absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] mix-blend-multiply opacity-20 animate-pulse-slow-delayed ${getBgColor()}`}></div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <Zap className={`w-8 h-8 ${getTextColor()} group-hover:scale-110 transition-transform`} fill="currentColor" />
              <span className="text-xl font-black text-gray-900 tracking-tight">VibePosts <span className={getTextColor()}>AI</span></span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="text-gray-600 hover:text-primary transition-colors flex items-center gap-2 font-bold text-sm uppercase tracking-wide"><Home size={16}/> Home</button>
              <button onClick={scrollToExplore} className="text-gray-600 hover:text-primary transition-colors flex items-center gap-2 font-bold text-sm uppercase tracking-wide"><Compass size={16}/> Explore</button>
              <button onClick={scrollToAbout} className="text-gray-600 hover:text-primary transition-colors flex items-center gap-2 font-bold text-sm uppercase tracking-wide"><Info size={16}/> About</button>
              <button 
                onClick={scrollToSearch}
                className={`px-6 py-2.5 rounded-full font-bold text-sm text-white transition-all transform hover:scale-105 shadow-lg active:scale-95 ${getBgColor()}`}>
                Start Exploring
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-28 overflow-hidden bg-white z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-20 items-center">
            <div className="text-center lg:text-left">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest ${getBgColor()} bg-opacity-10 ${getTextColor()} mb-10 shadow-sm border ${getAccentColor()} border-opacity-20`}>
                 <TrendingUp size={14}/> Trending: {mood === 'default' ? 'Everything' : mood}
              </div>
              <h1 className="text-6xl lg:text-8xl font-black text-gray-900 leading-[0.9] mb-10 tracking-tighter">
                Feeling <br />
                <span className={`${getTextColor()} italic font-serif`}>{mood === 'default' ? 'Curious' : mood}</span>?
              </h1>
              <p className="text-xl text-gray-500 mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                VibePosts AI intelligently maps your emotional state to a world of real-time content. Discover what resonates with your soul today.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                <button 
                  onClick={scrollToSearch}
                  className={`group px-12 py-5 rounded-2xl font-black text-xl text-white shadow-2xl transition-all transform hover:scale-105 hover:shadow-${mood}-500/30 ${getBgColor()} flex items-center gap-3`}>
                  Explore Now <Compass className="group-hover:rotate-45 transition-transform" size={24}/>
                </button>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className={`px-10 py-5 rounded-2xl font-black text-lg border-2 transition-all transform hover:scale-105 flex items-center justify-center gap-3 shadow-md bg-white ${getAccentColor()}`}>
                  <Plus size={24}/> Create Post
                </button>
              </div>
            </div>
            
            <div className="mt-20 lg:mt-0 relative flex justify-center">
              {/* Premium Visual Composition */}
              <div className="w-full max-w-lg aspect-square bg-gray-50 rounded-[4rem] relative overflow-hidden shadow-2xl border border-gray-100 flex items-center justify-center group/hero">
                <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-100"></div>
                
                {/* Mood-Adaptive SVG Blob */}
                <div className={`absolute w-full h-full opacity-10 scale-150 transition-all duration-1000 ${mood !== 'default' ? 'animate-spin-slow' : ''}`}>
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <path fill="currentColor" className={getTextColor()} d="M43.7,-76.3C55.5,-70.7,63.1,-56.9,69.5,-42.9C75.8,-28.9,80.9,-14.4,81.4,0.3C81.9,15,77.8,30,70.9,43.5C64,57,54.3,69,42.1,75.1C29.9,81.3,15,81.5,0.4,80.8C-14.1,80.1,-28.3,78.5,-40.5,72.4C-52.7,66.4,-63,55.9,-71,43.9C-79,31.9,-84.7,18.4,-84.3,5.1C-84,-8.1,-77.6,-21,-69.1,-32.1C-60.6,-43.3,-50.1,-52.7,-38.5,-58.5C-27,-64.3,-13.5,-66.4,0.4,-67C14.3,-67.6,28.6,-66.7,40.3,-68.1Z" transform="translate(100 100)" />
                    </svg>
                </div>

                <div className="relative z-10 transition-transform duration-500 group-hover/hero:scale-110">
                    <Zap className={`w-40 h-40 ${getTextColor()}`} fill="currentColor" />
                    <Sparkles className={`absolute -top-4 -right-4 w-12 h-12 text-yellow-400 animate-pulse`} />
                </div>
                
                {/* Floating Metrics */}
                <div className="absolute top-12 left-12 p-6 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100 animate-float">
                    <Activity className={getTextColor()} size={40}/>
                    <div className="mt-2 text-[10px] font-black uppercase text-gray-400">Live Pulse</div>
                </div>
                <div className="absolute bottom-12 right-12 p-6 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100 animate-float-delayed">
                   <Award className={getTextColor()} size={40}/>
                   <div className="mt-2 text-[10px] font-black uppercase text-gray-400">Vibe Auth</div>
                </div>

                {/* Dashboard Elements */}
                <div className="absolute bottom-24 left-16 bg-white p-5 rounded-2xl shadow-xl border border-gray-100 transform -rotate-3 hover:rotate-0 transition-transform">
                  <div className="flex gap-1 mb-2">
                        {[1,2,3,4,5].map(i => <div key={i} className={`w-1.5 h-6 rounded-full ${i <= 3 ? getBgColor() : 'bg-gray-100'}`}></div>)}
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Resonance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Mood Pulse (The New Widget) */}
      <section className="py-12 bg-white border-y border-gray-100 overflow-hidden relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${getBgColor()} text-white shadow-lg`}>
                    <Activity size={24}/>
                </div>
                <div>
                    <h3 className="text-xl font-black text-gray-900 leading-none mb-1">Global Mood Pulse</h3>
                    <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">Most searched vibes right now</p>
                </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
                {trendingMoods.map((t) => (
                    <button 
                        key={t.name}
                        onClick={() => handleSearch(t.name.toLowerCase())}
                        className={`group px-6 py-3 rounded-2xl border-2 flex items-center gap-3 transition-all transform hover:scale-105 active:scale-95 shadow-sm bg-white ${t.color} font-black hover:shadow-md`}
                    >
                        <span className="group-hover:animate-bounce">{t.icon}</span>
                        {t.name}
                    </button>
                ))}
            </div>
        </div>
      </section>

      {/* Search Section */}
      <section ref={searchRef} className="py-28 bg-transparent relative z-10">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-black text-gray-900 mb-16 tracking-tight">How are you feeling <span className="italic font-serif">exactly</span>?</h2>
          <div className="relative group max-w-3xl mx-auto">
            <div className={`absolute -inset-2 bg-gradient-to-r ${mood === 'default' ? 'from-orange-400 to-orange-600' : mood === 'happy' ? 'from-green-400 to-green-600' : mood === 'stress' ? 'from-red-400 to-red-600' : mood === 'calm' ? 'from-purple-400 to-purple-600' : 'from-blue-400 to-blue-600'} rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-50 transition duration-1000`}></div>
            <div className={`relative flex items-center bg-white rounded-[2.5rem] shadow-2xl border-4 ${mood !== 'default' ? getAccentColor() : 'border-gray-50'} p-4 overflow-hidden transition-all duration-500`}>
              <Search className={`ml-6 ${getTextColor()}`} size={40} />
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Talk to us... (happy, calm, focus...)"
                className="w-full py-6 px-10 text-3xl focus:outline-none text-gray-800 bg-transparent font-black placeholder:text-gray-300"
              />
            </div>
          </div>
          
          <div className="mt-12 flex flex-col items-center gap-4">
             {isSearching ? (
               <div className="flex items-center gap-4 bg-gray-900 text-white px-8 py-3 rounded-full shadow-2xl animate-pulse">
                 <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                 <span className="text-sm font-black uppercase tracking-widest">Neural Filtering Active</span>
               </div>
             ) : (
               <div className="flex items-center gap-3 bg-white px-8 py-3 rounded-full shadow-lg border border-gray-100 font-black text-gray-500 uppercase tracking-widest text-xs">
                 <Sparkles className={getTextColor()} size={18}/> {posts.length} Intelligent matches
               </div>
             )}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section ref={exploreRef} className="py-28 bg-white/50 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {posts.map((post) => (
                <div key={post._id} className="group p-12 rounded-[3.5rem] bg-white border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-3 relative overflow-hidden flex flex-col justify-between">
                  <div className={`absolute top-0 left-0 w-full h-2 ${getBgColor()} opacity-20 group-hover:opacity-100 transition-opacity`}></div>
                  <div>
                    <div className="flex gap-3 mb-10">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${getBgColor()} bg-opacity-10 ${getTextColor()} border ${getAccentColor()} border-opacity-20`}>
                            {mood === 'default' ? 'GLOBAL' : mood}
                        </span>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 mb-8 group-hover:text-primary transition-colors leading-[1.2] italic font-serif tracking-tight">{post.title}</h3>
                    <p className="text-gray-500 leading-relaxed mb-10 line-clamp-4 font-bold text-lg opacity-80">{post.body}</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-50 pt-8">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl ${getBgColor()} bg-opacity-10 flex items-center justify-center ${getTextColor()}`}>
                            <User size={24}/>
                        </div>
                        <span className="text-xs font-black text-gray-400 tracking-widest uppercase">ID:{post.userId}</span>
                    </div>
                    <button 
                        onClick={() => setSelectedPost(post)}
                        className={`py-3 px-6 rounded-2xl ${getTextColor()} bg-gray-50 group-hover:bg-gray-100 transition-colors font-black text-xs uppercase tracking-tighter flex items-center gap-3 overflow-hidden`}>
                        View <ExternalLink size={16}/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-40 bg-white shadow-2xl rounded-[5rem] border-2 border-dashed border-gray-100">
              <div className={`inline-flex items-center justify-center w-32 h-32 rounded-[2.5rem] ${getBgColor()} bg-opacity-10 mb-10 ${getTextColor()}`}>
                <MessageSquare size={56} />
              </div>
              <h3 className="text-4xl font-black text-gray-900 mb-6 tracking-tighter italic font-serif">The vibe is silent.</h3>
              <p className="text-gray-500 text-xl font-bold max-w-md mx-auto leading-relaxed">We couldn't find any resonance with your current mood. Try a different expression.</p>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="py-28 bg-gray-900 text-white relative z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary rounded-full blur-[200px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500 rounded-full blur-[200px]"></div>
        </div>
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-5xl font-black mb-20 italic font-serif tracking-tighter">The Science of Selection</h2>
            <div className="grid md:grid-cols-3 gap-16 text-left">
                <div className="group space-y-6 p-10 rounded-[3rem] border border-white/5 hover:border-white/20 transition-all hover:bg-white/5">
                    <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                        <Activity size={32}/>
                    </div>
                    <h4 className="text-2xl font-black">Neural Filter v2</h4>
                    <p className="text-gray-400 font-bold leading-loose opacity-70">Proprietary keyword mapping that goes beyond simple text match to capture the emotional spirit of your query.</p>
                </div>
                <div className="group space-y-6 p-10 rounded-[3rem] border border-white/5 hover:border-white/20 transition-all hover:bg-white/5">
                    <div className="w-16 h-16 bg-green-500 rounded-3xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                        <Zap size={32}/>
                    </div>
                    <h4 className="text-2xl font-black">Velocity Sync</h4>
                    <p className="text-gray-400 font-bold leading-loose opacity-70">Real-time WebSocket implementation ensuring zero latency between feeling something and seeing it reflected.</p>
                </div>
                <div className="group space-y-6 p-10 rounded-[3rem] border border-white/5 hover:border-white/20 transition-all hover:bg-white/5">
                    <div className="w-16 h-16 bg-blue-500 rounded-3xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                        <Award size={32}/>
                    </div>
                    <h4 className="text-2xl font-black">Vibe Provenance</h4>
                    <p className="text-gray-400 font-bold leading-loose opacity-70">Every post is verified and curated to ensure only high-quality resonance makes it to your dashboard.</p>
                </div>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 bg-black text-white relative z-10">
         <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
            <div className="flex items-center gap-4 mb-12 cursor-pointer group" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <Zap className="w-10 h-10 text-primary group-hover:scale-125 transition-all duration-500" fill="currentColor" />
              <span className="text-3xl font-black tracking-tighter italic">VibePosts AI</span>
            </div>
            <nav className="flex flex-wrap justify-center gap-12 mb-16 text-gray-500 font-black uppercase text-sm tracking-[0.3em]">
                 <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-white transition-colors">Start</button>
                 <button onClick={scrollToExplore} className="hover:text-white transition-colors">Vibe</button>
                 <button onClick={scrollToAbout} className="hover:text-white transition-colors">Lab</button>
                 <button className="hover:text-white transition-colors opacity-30">Legal</button>
            </nav>
            <div className="w-full h-px bg-white/5 mb-12"></div>
            <p className="text-white/20 text-xs font-black uppercase tracking-[0.5em]">2026 Artificial Resonance Laboratory • No compromise.</p>
         </div>
      </footer>

      {/* Post Details Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl animate-fade-in">
           <div className="bg-white w-full max-w-3xl rounded-[4rem] shadow-full overflow-hidden relative animate-scale-up border border-gray-100">
              <button 
                onClick={() => setSelectedPost(null)}
                className="absolute top-10 right-10 p-5 bg-gray-100 rounded-full hover:bg-gray-200 transition-all hover:rotate-90 z-10"
              >
                <X size={28}/>
              </button>
              <div className={`h-6 ${getBgColor()} animate-pulse`}></div>
              <div className="p-16">
                   <div className="flex items-center gap-6 text-gray-400 mb-12 font-black text-xs uppercase tracking-[0.3em]">
                       <span className="flex items-center gap-2 text-primary"><Calendar size={18}/> Captured 2026</span>
                       <span className="w-2 h-2 rounded-full bg-gray-200"></span>
                       <span className="flex items-center gap-2"><User size={18}/> Author: {selectedPost.userId}</span>
                   </div>
                   <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-12 italic font-serif leading-[1.1] tracking-tighter underline decoration-primary decoration-8 underline-offset-8 decoration-opacity-20">{selectedPost.title}</h2>
                   <div className="prose prose-2xl text-gray-600 font-bold leading-[1.8] mb-16 opacity-90 first-letter:text-6xl first-letter:font-black first-letter:mr-4 first-letter:float-left first-letter:text-primary first-letter:font-serif">
                       {selectedPost.body}
                       <br /><br />
                       This data reflects a high-resonance state matched specifically to your query. The Artificial Resonance Laboratory ensures every word choice aligns with the emotional intent of our users.
                   </div>
                   <button 
                    onClick={() => {
                        setSelectedPost(null);
                        setTimeout(scrollToExplore, 300);
                    }}
                    className={`w-full py-6 rounded-[2rem] bg-gray-900 text-white font-black text-xl shadow-2xl hover:scale-[1.02] transition-all transform active:scale-95 flex items-center justify-center gap-4 group`}
                   >
                     Back to Exploration <MousePointer2 className="group-hover:translate-x-2 transition-transform" size={24}/>
                   </button>
              </div>
           </div>
        </div>
      )}

      {/* Create Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-[4rem] shadow-full overflow-hidden animate-scale-up border border-gray-100">
            <div className={`p-10 flex justify-between items-center text-white ${getBgColor()} relative overflow-hidden transition-colors duration-1000`}>
              <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full translate-x-12 -translate-y-12 animate-pulse"></div>
              <h3 className="text-3xl font-black flex items-center gap-4 relative z-10 italic"><Plus size={36}/> New Experience</h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:rotate-90 transition-transform relative z-10 p-2">
                <X size={36} />
              </button>
            </div>
            <form onSubmit={handleCreatePost} className="p-12 space-y-10">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4">Experience Label</label>
                <input
                  type="text"
                  required
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  className="w-full px-8 py-5 rounded-[2rem] border-4 border-gray-50 focus:outline-none focus:border-primary transition-all text-2xl font-black placeholder:text-gray-100 italic font-serif"
                  placeholder="The focus of my day..."
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4">Core Resonance Content</label>
                <textarea
                  required
                  rows="5"
                  value={newPost.body}
                  onChange={(e) => setNewPost({...newPost, body: e.target.value})}
                  className="w-full px-8 py-5 rounded-[2rem] border-4 border-gray-50 focus:outline-none focus:border-primary transition-all resize-none text-xl font-bold leading-relaxed placeholder:text-gray-100"
                  placeholder="Express yourself. Mention keywords like happy, calm, or focus for laboratory sync."
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-6 rounded-[2.5rem] font-black text-2xl text-white shadow-full transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4 ${getBgColor()} ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Syncing...' : <><Send size={28}/> Publish Live</>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Global CSS for Premium Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:italic,wght@900&display=swap');
        
        body {
          -webkit-font-smoothing: antialiased;
        }

        .shadow-full {
          box-shadow: 0 50px 100px -20px rgba(0,0,0,0.25), 0 30px 60px -30px rgba(0,0,0,0.3);
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        .animate-pulse-slow-delayed {
          animation: pulse-slow 10s ease-in-out infinite;
          animation-delay: 3s;
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(10deg); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(-10deg); }
        }
        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite;
          animation-delay: 2.5s;
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }

        .animate-scale-up {
          animation: scaleUp 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        }
        @keyframes scaleUp {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default App;
