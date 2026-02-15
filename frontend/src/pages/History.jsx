import React, { useState, useEffect } from 'react';
import { History as HistoryIcon, Trash2, X, Settings, UserCheck, Search } from 'lucide-react';
import { useUser } from '../context/UserContext';
import api from '../utils/api';
import VideoCard from '../components/VideoCard';

const History = () => {
    const { user } = useUser();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        if (!user) {
            setLoading(false);
            return;
        }
        try {
            const data = await api.getUserHistory(user._id);
            setHistory(data);
        } catch (err) {
            console.error('Fetch History Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [user]);

    const handleClearHistory = async () => {
        if (!confirm('Are you sure you want to clear your entire watch history?')) return;
        try {
            await api.clearHistory(user._id);
            setHistory([]);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleRemoveFromHistory = async (videoId) => {
        try {
            await api.removeFromHistory(user._id, videoId);
            setHistory(prev => prev.filter(h => h.video._id !== videoId));
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <div className="p-10 text-center text-yt-text-secondary">Loading history...</div>;

    if (!user) return (
        <div className="flex flex-col items-center justify-center py-32 opacity-50 px-6 text-center">
            <div className="bg-yt-bg-secondary p-8 rounded-full mb-6 text-yt-blue">
                <HistoryIcon size={64} />
            </div>
            <h2 className="text-2xl font-bold text-yt-text">Keep track of what you watch</h2>
            <p className="text-[15px] text-yt-text-secondary mt-2 max-w-sm">
                Sign in to see your watch history and pick up where you left off.
            </p>
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row gap-8 p-4 sm:p-8 max-w-[1400px] mx-auto min-h-screen">
            {/* History List */}
            <div className="flex-1 order-2 lg:order-1">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-xl sm:text-2xl font-black text-yt-text uppercase tracking-widest flex items-center gap-3">
                        Watch history
                    </h1>
                </div>

                {history.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-10">
                        {history.map((item) => (
                            <div key={item._id} className="relative group">
                                <VideoCard video={item.video} />
                                <button
                                    onClick={() => handleRemoveFromHistory(item.video._id)}
                                    className="absolute top-2 right-2 p-1.5 bg-black bg-opacity-80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-yt-red"
                                    title="Remove from history"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 opacity-50 border-2 border-dashed border-yt-border rounded-3xl">
                        <HistoryIcon size={64} className="mb-4 text-yt-text-secondary" />
                        <p className="text-lg font-bold text-yt-text">Your watch history is empty</p>
                        <p className="text-sm text-yt-text-secondary mt-1">Videos you watch will show up here.</p>
                    </div>
                )}
            </div>

            {/* Submenu Sidebar */}
            <div className="w-full lg:w-80 flex flex-col gap-6 order-1 lg:order-2">
                <div className="bg-yt-bg-secondary p-6 rounded-2xl border border-yt-border shadow-xl">
                    <div className="flex items-center gap-2 mb-6 px-1">
                        <Search size={18} className="text-yt-text-secondary" />
                        <input
                            type="text"
                            placeholder="Search watch history"
                            className="bg-transparent border-none outline-none text-sm w-full text-yt-text placeholder:text-yt-text-secondary"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <button
                            onClick={handleClearHistory}
                            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-yt-bg-hover rounded-xl text-sm font-bold text-yt-text transition-all active:scale-95 group"
                        >
                            <Trash2 size={20} className="text-yt-text-secondary group-hover:text-yt-red" />
                            Clear entire watch history
                        </button>
                        <button
                            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-yt-bg-hover rounded-xl text-sm font-bold text-yt-text transition-all active:scale-95 group opacity-50 cursor-not-allowed"
                            disabled
                        >
                            <HistoryIcon size={20} className="text-yt-text-secondary" />
                            Pause watch history
                        </button>
                        <button
                            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-yt-bg-hover rounded-xl text-sm font-bold text-yt-text transition-all active:scale-95 group opacity-50 cursor-not-allowed"
                            disabled
                        >
                            <Settings size={20} className="text-yt-text-secondary" />
                            Manage all history
                        </button>
                    </div>
                </div>

                <div className="bg-yt-bg-secondary p-6 rounded-2xl border border-yt-border shadow-xl flex flex-col gap-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-yt-text-secondary px-1">Community</h3>
                    <div className="flex flex-col gap-1">
                        <button className="flex items-center gap-3 w-full px-4 py-3 hover:bg-yt-bg-hover rounded-xl text-sm font-bold text-yt-text transition-all">
                            <Trash2 size={20} className="text-yt-text-secondary" />
                            Comments
                        </button>
                        <button className="flex items-center gap-3 w-full px-4 py-3 hover:bg-yt-bg-hover rounded-xl text-sm font-bold text-yt-text transition-all">
                            <UserCheck size={20} className="text-yt-text-secondary" />
                            Community posts
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default History;
