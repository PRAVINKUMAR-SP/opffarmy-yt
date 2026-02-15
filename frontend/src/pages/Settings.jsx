import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import { Sun, Moon, Monitor, Bell, BellOff, Shield, Eye, Globe, Palette, Lock, ExternalLink } from 'lucide-react';

const ToggleSwitch = ({ enabled, onToggle }) => (
    <button
        onClick={onToggle}
        className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-yt-blue' : 'bg-yt-bg-hover border border-yt-border'}`}
    >
        <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow ${enabled ? 'translate-x-5' : ''}`} />
    </button>
);

const SettingRow = ({ label, description, children }) => (
    <div className="flex items-center justify-between py-4 border-b border-yt-border last:border-0">
        <div className="flex-1 mr-4">
            <p className="text-sm font-medium text-yt-text">{label}</p>
            {description && <p className="text-xs text-yt-text-secondary mt-0.5">{description}</p>}
        </div>
        {children}
    </div>
);

const Settings = () => {
    const { user } = useUser();
    const { theme, toggleTheme } = useTheme();

    const [notifications, setNotifications] = useState({
        subscriptions: true,
        recommended: true,
        activity: true,
        mentions: true,
    });

    const [privacy, setPrivacy] = useState({
        keepHistory: true,
        keepSearchHistory: true,
    });

    const [playback, setPlayback] = useState({
        autoplay: true,
        captions: false,
        quality: 'auto',
    });

    if (!user) {
        return (
            <div className="flex justify-center items-center h-[60vh] text-yt-text-secondary">
                <p>Please sign in to view settings.</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-6 animate-fade-in">
            <h1 className="text-2xl font-bold text-yt-text mb-8">Settings</h1>

            {/* Account Section */}
            <div className="bg-yt-bg-secondary rounded-xl border border-yt-border p-6 mb-4">
                <h2 className="text-lg font-semibold text-yt-text mb-4 flex items-center gap-2">
                    <Lock size={18} className="text-yt-text-secondary" />
                    Account
                </h2>

                <div className="flex items-center gap-6 mb-4 pb-4 border-b border-yt-border">
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-yt-text">{user.name}</h3>
                        <p className="text-sm text-yt-text-secondary">{user.handle}</p>
                        <p className="text-xs text-yt-text-secondary mt-0.5">{user.email}</p>
                    </div>
                </div>

                <SettingRow label="Channel" description={user.channelId ? 'Your channel is active' : 'No channel created yet'}>
                    {user.channelId ? (
                        <Link
                            to={`/channel/${user.channelId}`}
                            className="text-sm text-yt-blue hover:underline flex items-center gap-1"
                        >
                            View <ExternalLink size={12} />
                        </Link>
                    ) : (
                        <span className="text-xs text-yt-text-secondary">Create via header menu</span>
                    )}
                </SettingRow>

                <SettingRow label="Your data" description="Manage your privacy and data preferences">
                    <Link to="/your-data" className="text-sm text-yt-blue hover:underline flex items-center gap-1">
                        Manage <ExternalLink size={12} />
                    </Link>
                </SettingRow>
            </div>

            {/* Appearance Section */}
            <div className="bg-yt-bg-secondary rounded-xl border border-yt-border p-6 mb-4">
                <h2 className="text-lg font-semibold text-yt-text mb-4 flex items-center gap-2">
                    <Palette size={18} className="text-yt-text-secondary" />
                    Appearance
                </h2>

                <div className="flex gap-3">
                    <button
                        onClick={() => theme !== 'dark' && toggleTheme()}
                        className={`flex-1 flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-yt-blue bg-yt-blue bg-opacity-5' : 'border-yt-border hover:border-yt-text-secondary'}`}
                    >
                        <div className="w-12 h-12 rounded-full bg-[#0f0f0f] flex items-center justify-center border border-[#333]">
                            <Moon size={20} className="text-white" />
                        </div>
                        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-yt-blue' : 'text-yt-text'}`}>Dark</span>
                    </button>
                    <button
                        onClick={() => theme !== 'light' && toggleTheme()}
                        className={`flex-1 flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-yt-blue bg-yt-blue bg-opacity-5' : 'border-yt-border hover:border-yt-text-secondary'}`}
                    >
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-[#e5e5e5]">
                            <Sun size={20} className="text-[#0f0f0f]" />
                        </div>
                        <span className={`text-sm font-medium ${theme === 'light' ? 'text-yt-blue' : 'text-yt-text'}`}>Light</span>
                    </button>
                </div>
            </div>

            {/* Notifications Section */}
            <div className="bg-yt-bg-secondary rounded-xl border border-yt-border p-6 mb-4">
                <h2 className="text-lg font-semibold text-yt-text mb-4 flex items-center gap-2">
                    <Bell size={18} className="text-yt-text-secondary" />
                    Notifications
                </h2>

                <SettingRow label="Subscriptions" description="Get notified about new videos from channels you subscribe to">
                    <ToggleSwitch
                        enabled={notifications.subscriptions}
                        onToggle={() => setNotifications(p => ({ ...p, subscriptions: !p.subscriptions }))}
                    />
                </SettingRow>
                <SettingRow label="Recommended videos" description="Get notified about videos we think you'll like">
                    <ToggleSwitch
                        enabled={notifications.recommended}
                        onToggle={() => setNotifications(p => ({ ...p, recommended: !p.recommended }))}
                    />
                </SettingRow>
                <SettingRow label="Activity on my channel" description="Comments, likes, and new subscribers">
                    <ToggleSwitch
                        enabled={notifications.activity}
                        onToggle={() => setNotifications(p => ({ ...p, activity: !p.activity }))}
                    />
                </SettingRow>
                <SettingRow label="Mentions" description="Get notified when someone mentions you">
                    <ToggleSwitch
                        enabled={notifications.mentions}
                        onToggle={() => setNotifications(p => ({ ...p, mentions: !p.mentions }))}
                    />
                </SettingRow>
            </div>

            {/* Privacy & Playback Section */}
            <div className="bg-yt-bg-secondary rounded-xl border border-yt-border p-6 mb-4">
                <h2 className="text-lg font-semibold text-yt-text mb-4 flex items-center gap-2">
                    <Shield size={18} className="text-yt-text-secondary" />
                    Privacy & Playback
                </h2>

                <SettingRow label="Save watch history" description="Remember videos you've watched for better recommendations">
                    <ToggleSwitch
                        enabled={privacy.keepHistory}
                        onToggle={() => setPrivacy(p => ({ ...p, keepHistory: !p.keepHistory }))}
                    />
                </SettingRow>
                <SettingRow label="Save search history" description="Remember your searches for better suggestions">
                    <ToggleSwitch
                        enabled={privacy.keepSearchHistory}
                        onToggle={() => setPrivacy(p => ({ ...p, keepSearchHistory: !p.keepSearchHistory }))}
                    />
                </SettingRow>
                <SettingRow label="Autoplay" description="Automatically play the next suggested video">
                    <ToggleSwitch
                        enabled={playback.autoplay}
                        onToggle={() => setPlayback(p => ({ ...p, autoplay: !p.autoplay }))}
                    />
                </SettingRow>
                <SettingRow label="Always show captions" description="Display captions when available">
                    <ToggleSwitch
                        enabled={playback.captions}
                        onToggle={() => setPlayback(p => ({ ...p, captions: !p.captions }))}
                    />
                </SettingRow>

                <SettingRow label="Video quality" description="Default playback quality for all videos">
                    <select
                        value={playback.quality}
                        onChange={(e) => setPlayback(p => ({ ...p, quality: e.target.value }))}
                        className="bg-yt-bg border border-yt-border rounded-lg text-sm text-yt-text px-3 py-1.5 outline-none focus:border-yt-blue"
                    >
                        <option value="auto">Auto</option>
                        <option value="1080p">1080p</option>
                        <option value="720p">720p</option>
                        <option value="480p">480p</option>
                        <option value="360p">360p</option>
                    </select>
                </SettingRow>
            </div>

            {/* Connected Apps */}
            <div className="bg-yt-bg-secondary rounded-xl border border-yt-border p-6">
                <h2 className="text-lg font-semibold text-yt-text mb-4 flex items-center gap-2">
                    <Globe size={18} className="text-yt-text-secondary" />
                    Connected Apps
                </h2>

                <div className="text-center py-8 opacity-60">
                    <p className="text-sm text-yt-text-secondary">No connected apps</p>
                    <p className="text-xs text-yt-text-secondary mt-1">
                        Third-party apps that you've connected to your OPFFARMY account will appear here.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Settings;
