import React from 'react';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';
import { Shield, Eye, EyeOff, Search, Trash2, Download, Clock, ToggleLeft, ToggleRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ToggleSwitch = ({ enabled, onToggle, label }) => (
    <div className="flex items-center justify-between py-3">
        <span className="text-sm text-yt-text">{label}</span>
        <button
            onClick={onToggle}
            className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-yt-blue' : 'bg-yt-bg-hover'}`}
        >
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow ${enabled ? 'translate-x-5' : ''}`} />
        </button>
    </div>
);

const YourData = () => {
    const { user } = useUser();
    const [watchHistory, setWatchHistory] = React.useState(() =>
        localStorage.getItem('yt_watch_history_enabled') !== 'false'
    );
    const [searchHistory, setSearchHistory] = React.useState(() =>
        localStorage.getItem('yt_search_history_enabled') !== 'false'
    );
    const [adPersonalization, setAdPersonalization] = React.useState(() =>
        localStorage.getItem('yt_ad_personalization') !== 'false'
    );

    const toggleWatchHistory = () => {
        const next = !watchHistory;
        setWatchHistory(next);
        localStorage.setItem('yt_watch_history_enabled', String(next));
    };

    const toggleSearchHistory = () => {
        const next = !searchHistory;
        setSearchHistory(next);
        localStorage.setItem('yt_search_history_enabled', String(next));
    };

    const toggleAdPersonalization = () => {
        const next = !adPersonalization;
        setAdPersonalization(next);
        localStorage.setItem('yt_ad_personalization', String(next));
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center h-[60vh] text-yt-text-secondary">
                <p>Please sign in to view your data settings.</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-8">
                <div className="bg-yt-blue bg-opacity-10 p-3 rounded-full">
                    <Shield size={28} className="text-yt-blue" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-yt-text">Your Data in OPFFARMY</h1>
                    <p className="text-sm text-yt-text-secondary">Manage your privacy and data preferences</p>
                </div>
            </div>

            {/* Watch History */}
            <div className="bg-yt-bg-secondary rounded-xl border border-yt-border p-6 mb-4">
                <div className="flex items-center gap-3 mb-4">
                    <Clock size={20} className="text-yt-text-secondary" />
                    <h2 className="text-lg font-semibold text-yt-text">Watch History</h2>
                </div>
                <p className="text-sm text-yt-text-secondary mb-4">
                    When watch history is on, videos you watch are saved and used to improve your recommendations.
                </p>
                <ToggleSwitch enabled={watchHistory} onToggle={toggleWatchHistory} label="Save watch history" />
                <div className="flex gap-3 mt-4 pt-4 border-t border-yt-border">
                    <Link to="/history" className="text-sm text-yt-blue hover:underline flex items-center gap-1">
                        <Eye size={14} /> View history
                    </Link>
                    <button className="text-sm text-yt-red hover:underline flex items-center gap-1">
                        <Trash2 size={14} /> Clear all watch history
                    </button>
                </div>
            </div>

            {/* Search History */}
            <div className="bg-yt-bg-secondary rounded-xl border border-yt-border p-6 mb-4">
                <div className="flex items-center gap-3 mb-4">
                    <Search size={20} className="text-yt-text-secondary" />
                    <h2 className="text-lg font-semibold text-yt-text">Search History</h2>
                </div>
                <p className="text-sm text-yt-text-secondary mb-4">
                    When search history is on, your searches are saved to improve your recommendations and suggestions.
                </p>
                <ToggleSwitch enabled={searchHistory} onToggle={toggleSearchHistory} label="Save search history" />
                <div className="flex gap-3 mt-4 pt-4 border-t border-yt-border">
                    <button className="text-sm text-yt-red hover:underline flex items-center gap-1">
                        <Trash2 size={14} /> Clear all search history
                    </button>
                </div>
            </div>

            {/* Ad Personalization */}
            <div className="bg-yt-bg-secondary rounded-xl border border-yt-border p-6 mb-4">
                <div className="flex items-center gap-3 mb-4">
                    <EyeOff size={20} className="text-yt-text-secondary" />
                    <h2 className="text-lg font-semibold text-yt-text">Ad Personalization</h2>
                </div>
                <p className="text-sm text-yt-text-secondary mb-4">
                    When ad personalization is on, OPFFARMY uses your information to show you more relevant ads.
                </p>
                <ToggleSwitch enabled={adPersonalization} onToggle={toggleAdPersonalization} label="Personalized ads" />
            </div>

            {/* Download Data */}
            <div className="bg-yt-bg-secondary rounded-xl border border-yt-border p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Download size={20} className="text-yt-text-secondary" />
                    <h2 className="text-lg font-semibold text-yt-text">Download Your Data</h2>
                </div>
                <p className="text-sm text-yt-text-secondary mb-4">
                    You can request a copy of your OPFFARMY data, including your videos, comments, and messages.
                </p>
                <button className="px-5 py-2.5 bg-yt-blue text-[#0f0f0f] font-medium rounded-full text-sm hover:bg-opacity-90 transition-all active:scale-95">
                    Request Data Export
                </button>
            </div>
        </div>
    );
};

export default YourData;
