import React, { useState, useEffect, useRef } from 'react';
import { Search, Menu, Video, Bell, User, Mic, Shield, LogIn, Send, Radio, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useUser } from '../context/UserContext';
import { useSidebar } from '../context/SidebarContext';
import ProfileMenu from './ProfileMenu';
import CreateChannelModal from './CreateChannelModal';
import UploadModal from './UploadModal';
import CreatePostModal from './CreatePostModal';

const Header = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const suggestionsRef = React.useRef(null);
    const { toggleSidebar } = useSidebar();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [authError, setAuthError] = useState('');
    const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);

    const navigate = useNavigate();
    const { user, loginWithCredentials, register, setUser } = useUser();
    const [isCCModalOpen, setIsCCModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);

    const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.trim()) {
                const res = await api.getSearchSuggestions(searchQuery);
                setSuggestions(res.suggestions);
            } else {
                setSuggestions([]);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSearch = (e) => {
        e?.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/?q=${encodeURIComponent(searchQuery)}`);
            setShowSuggestions(false);
        }
    };

    const handleVoiceSearch = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Voice search is not supported in this browser.');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setSearchQuery(transcript);
            navigate(`/?q=${encodeURIComponent(transcript)}`);
        };

        recognition.start();
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion);
        navigate(`/?q=${encodeURIComponent(suggestion)}`);
        setShowSuggestions(false);
    };

    const handleKeyDown = (e) => {
        if (!showSuggestions) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            handleSuggestionClick(suggestions[selectedIndex]);
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    const handleAuthAction = async (e) => {
        e.preventDefault();
        setAuthError('');
        try {
            if (authMode === 'signup') {
                if (!formData.name || !formData.email || !formData.password) {
                    throw new Error('Please fill in all fields');
                }
                await register(formData.name, formData.email, formData.password);
            } else {
                await loginWithCredentials(formData.email, formData.password);
            }
            setIsLoginModalOpen(false);
            setFormData({ name: '', email: '', password: '' });
        } catch (err) {
            setAuthError(err.message);
        }
    };

    return (
        <header className="flex justify-between items-center px-4 py-2 bg-yt-bg sticky top-0 z-50 h-14">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="p-2 hover:bg-yt-bg-hover rounded-full text-yt-text"
                >
                    <Menu size={24} />
                </button>
                <Link to="/" className="flex items-center gap-1 group">
                    <div className="bg-yt-red p-1 rounded-md group-hover:bg-red-600 transition-colors">
                        <Video size={18} fill="white" color="white" />
                    </div>
                    <span className="text-xl font-bold tracking-custom text-yt-text">OPFFARMY</span>
                </Link>
            </div>

            <div className="flex flex-1 max-w-[700px] ml-10 items-center gap-4 px-4 relative" ref={suggestionsRef}>
                <form
                    onSubmit={handleSearch}
                    className="flex flex-1 items-center"
                >
                    <div className="flex w-full">
                        <div className="flex flex-1 items-center bg-yt-bg-secondary border border-yt-border rounded-l-full px-4 focus-within:border-yt-blue focus-within:ring-1 focus-within:ring-yt-blue">
                            <input
                                type="text"
                                placeholder="Search"
                                className="bg-transparent text-yt-text w-full py-2 outline-none"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowSuggestions(true);
                                    setSelectedIndex(-1);
                                }}
                                onFocus={() => setShowSuggestions(true)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        <button className="bg-yt-bg-hover border border-l-0 border-yt-border px-5 rounded-r-full hover:bg-yt-bg-secondary transition-colors">
                            <Search size={18} className="text-yt-text" />
                        </button>
                    </div>
                </form>

                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-4 right-14 mt-1 bg-yt-bg-elevated border border-yt-border rounded-xl shadow-2xl py-2 overflow-hidden animate-scale-in z-[60]">
                        {suggestions.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => handleSuggestionClick(item)}
                                className={`flex items-center gap-3 px-4 py-2 cursor-default transition-colors ${index === selectedIndex ? 'bg-white bg-opacity-10' : 'hover:bg-white hover:bg-opacity-5'}`}
                            >
                                <Search size={16} className="text-yt-text-secondary" />
                                <span className="text-[15px] font-medium text-yt-text truncate">{item}</span>
                            </div>
                        ))}
                    </div>
                )}

                <button
                    type="button"
                    onClick={handleVoiceSearch}
                    className={`p-2 rounded-full text-yt-text hidden sm:block transition-all ${isListening ? 'bg-red-600 animate-pulse' : 'bg-yt-bg-secondary hover:bg-yt-bg-hover'}`}
                >
                    <Mic size={20} />
                </button>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                {user && (
                    <div className="relative">
                        <button
                            onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
                            className="p-2 hover:bg-yt-bg-hover rounded-full text-yt-text hidden sm:block transition-all active:scale-90"
                        >
                            <Video size={24} />
                        </button>

                        {isCreateMenuOpen && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-yt-bg-elevated border border-yt-border rounded-xl shadow-2xl py-2 z-50 animate-scale-in">
                                {!user.channelId ? (
                                    <button
                                        onClick={() => { setIsCCModalOpen(true); setIsCreateMenuOpen(false); }}
                                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white hover:bg-opacity-5 transition-colors text-left"
                                    >
                                        <Plus size={20} className="text-yt-blue" />
                                        <span className="text-sm">Create channel</span>
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => { setIsUploadModalOpen(true); setIsCreateMenuOpen(false); }}
                                            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white hover:bg-opacity-5 transition-colors text-left"
                                        >
                                            <Video size={20} className="text-yt-text-secondary" />
                                            <span className="text-sm">Upload video</span>
                                        </button>
                                        <button
                                            onClick={() => { setIsUploadModalOpen(true); setIsCreateMenuOpen(false); }}
                                            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white hover:bg-opacity-5 transition-colors text-left"
                                        >
                                            <Radio size={20} className="text-yt-text-secondary" />
                                            <span className="text-sm">Go live</span>
                                        </button>
                                        <button
                                            onClick={() => { setIsPostModalOpen(true); setIsCreateMenuOpen(false); }}
                                            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white hover:bg-opacity-5 transition-colors text-left"
                                        >
                                            <Send size={20} className="text-yt-text-secondary" />
                                            <span className="text-sm">Create post</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}
                <button className="p-2 hover:bg-yt-bg-hover rounded-full text-yt-text hidden sm:block">
                    <Bell size={24} />
                </button>

                {user ? (
                    <div className="relative ml-2">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="w-8 h-8 rounded-full overflow-hidden border border-yt-border active:scale-95 transition-all"
                        >
                            <img src={user.avatar} className="w-full h-full object-cover" />
                        </button>
                        <ProfileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
                    </div>
                ) : (
                    <button
                        onClick={() => setIsLoginModalOpen(true)}
                        className="flex items-center gap-2 px-3 py-1.5 border border-yt-border text-yt-blue rounded-full text-sm font-medium hover:bg-yt-blue hover:bg-opacity-10 transition-all active:scale-95"
                    >
                        <LogIn size={20} strokeWidth={2.5} />
                        Sign in
                    </button>
                )}
            </div>

            {/* Auth Modal */}
            {isLoginModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-80 p-4 animate-fade-in backdrop-blur-sm">
                    <div className="bg-yt-bg-secondary border border-yt-border rounded-2xl w-full max-w-[400px] overflow-hidden shadow-2xl animate-scale-in">
                        <div className="flex border-b border-yt-border">
                            <button
                                onClick={() => { setAuthMode('login'); setAuthError(''); }}
                                className={`flex-1 py-4 text-sm font-bold transition-all ${authMode === 'login' ? 'text-yt-blue border-b-2 border-yt-blue bg-white bg-opacity-5' : 'text-yt-text-secondary hover:bg-white hover:bg-opacity-5'}`}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => { setAuthMode('signup'); setAuthError(''); }}
                                className={`flex-1 py-4 text-sm font-bold transition-all ${authMode === 'signup' ? 'text-yt-blue border-b-2 border-yt-blue bg-white bg-opacity-5' : 'text-yt-text-secondary hover:bg-white hover:bg-opacity-5'}`}
                            >
                                Create Account
                            </button>
                        </div>

                        <form onSubmit={handleAuthAction} className="p-8 flex flex-col gap-5">
                            <div className="flex flex-col items-center gap-2 mb-2">
                                <div className="p-3 bg-yt-red bg-opacity-10 rounded-full">
                                    <Shield size={32} className="text-yt-red" />
                                </div>
                                <h2 className="text-xl font-bold">
                                    {authMode === 'login' ? 'Welcome Back' : 'Join OPFFARMY'}
                                </h2>
                                <p className="text-xs text-yt-text-secondary text-center px-4">
                                    {authMode === 'signup'
                                        ? 'Note: Use an email containing "admin" to get admin access for this demo.'
                                        : 'Enter your credentials to manage your account.'}
                                </p>
                            </div>

                            {authError && (
                                <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-2 rounded-lg text-xs text-center font-medium">
                                    {authError}
                                </div>
                            )}

                            <div className="flex flex-col gap-4">
                                {authMode === 'signup' && (
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-bold text-yt-text-secondary uppercase tracking-wider ml-1">Full Name</label>
                                        <div className="flex items-center gap-3 bg-yt-bg px-4 py-3 rounded-xl border border-yt-border focus-within:border-yt-blue transition-all">
                                            <User size={18} className="text-yt-text-secondary" />
                                            <input
                                                type="text"
                                                placeholder="Pravin Kumar"
                                                className="bg-transparent outline-none text-sm w-full"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-bold text-yt-text-secondary uppercase tracking-wider ml-1">Email Address</label>
                                    <div className="flex items-center gap-3 bg-yt-bg px-4 py-3 rounded-xl border border-yt-border focus-within:border-yt-blue transition-all">
                                        <LogIn size={18} className="text-yt-text-secondary" />
                                        <input
                                            type="email"
                                            placeholder="example@mail.com"
                                            className="bg-transparent outline-none text-sm w-full"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-bold text-yt-text-secondary uppercase tracking-wider ml-1">Password</label>
                                    <div className="flex items-center gap-3 bg-yt-bg px-4 py-3 rounded-xl border border-yt-border focus-within:border-yt-blue transition-all">
                                        <Shield size={18} className="text-yt-text-secondary" />
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            className="bg-transparent outline-none text-sm w-full"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-yt-blue text-[#0f0f0f] py-3.5 rounded-xl font-bold mt-2 hover:bg-opacity-90 transition-all active:scale-95 shadow-lg shadow-yt-blue/10"
                            >
                                {authMode === 'login' ? 'Sign In' : 'Create Account'}
                            </button>

                            <button
                                type="button"
                                onClick={async () => { await login('user'); setIsLoginModalOpen(false); }}
                                className="text-xs text-yt-text-secondary hover:underline text-center"
                            >
                                Continue as Guest
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <CreateChannelModal
                isOpen={isCCModalOpen}
                onClose={() => setIsCCModalOpen(false)}
                onSuccess={(channel) => {
                    const updatedUser = { ...user, channelId: channel._id };
                    setUser(updatedUser);
                    localStorage.setItem('yt_user', JSON.stringify(updatedUser));
                }}
            />

            <UploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onSuccess={(video) => {
                    if (window.location.pathname === '/') window.location.reload();
                    else navigate('/');
                }}
            />

            <CreatePostModal
                isOpen={isPostModalOpen}
                onClose={() => setIsPostModalOpen(false)}
                onSuccess={(post) => {
                    if (window.location.pathname === '/community') window.location.reload();
                    else navigate('/community');
                }}
            />
        </header>
    );
};

export default Header;
