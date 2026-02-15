import React, { useState } from 'react';
import {
    User, LogOut, Settings,
    ShieldCheck, HelpCircle, MessageSquare,
    Globe, Shield, ChevronRight, ChevronLeft, Languages,
    Moon, Sun, Check
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';

const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'es', label: 'Español (Spanish)' },
    { code: 'fr', label: 'Français (French)' },
    { code: 'de', label: 'Deutsch (German)' },
    { code: 'ja', label: '日本語 (Japanese)' },
    { code: 'ko', label: '한국어 (Korean)' },
    { code: 'pt', label: 'Português (Portuguese)' },
    { code: 'ru', label: 'Русский (Russian)' },
    { code: 'ar', label: 'العربية (Arabic)' },
];

const locations = [
    { code: 'IN', label: 'India' },
    { code: 'US', label: 'United States' },
    { code: 'GB', label: 'United Kingdom' },
    { code: 'CA', label: 'Canada' },
    { code: 'AU', label: 'Australia' },
    { code: 'JP', label: 'Japan' },
    { code: 'DE', label: 'Germany' },
    { code: 'FR', label: 'France' },
    { code: 'BR', label: 'Brazil' },
    { code: 'KR', label: 'South Korea' },
];

const MenuSection = ({ children }) => (
    <div className="py-2 border-b border-yt-border last:border-0">
        {children}
    </div>
);

const MenuItem = ({ icon: Icon, label, secondary, onClick, to }) => {
    const Component = to ? Link : 'button';
    return (
        <Component
            to={to}
            onClick={onClick}
            className="w-full flex items-center px-4 py-2.5 hover:bg-yt-bg-hover transition-colors text-left"
        >
            <div className="w-9">
                <Icon size={20} className="text-yt-text" />
            </div>
            <div className="flex-1 flex items-center justify-between overflow-hidden">
                <span className="text-sm truncate text-yt-text">{label}</span>
                {secondary && <span className="text-xs text-yt-text-secondary pr-1">{secondary}</span>}
            </div>
        </Component>
    );
};

// Sub-panel for selecting from a list
const SelectPanel = ({ title, items, selectedValue, onSelect, onBack }) => (
    <div className="animate-fade-in">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-yt-border">
            <button onClick={onBack} className="p-1 hover:bg-yt-bg-hover rounded-full transition-colors">
                <ChevronLeft size={18} className="text-yt-text" />
            </button>
            <h3 className="text-sm font-semibold text-yt-text">{title}</h3>
        </div>
        <div className="max-h-[50vh] overflow-y-auto py-1">
            {items.map(item => (
                <button
                    key={item.code}
                    onClick={() => onSelect(item.code)}
                    className="w-full flex items-center px-4 py-2.5 hover:bg-yt-bg-hover transition-colors text-left"
                >
                    <div className="w-9 flex items-center justify-center">
                        {selectedValue === item.code ? (
                            <Check size={16} className="text-yt-blue" />
                        ) : (
                            <span className="w-4" />
                        )}
                    </div>
                    <span className={`text-sm ${selectedValue === item.code ? 'text-yt-blue font-medium' : 'text-yt-text'}`}>
                        {item.label}
                    </span>
                </button>
            ))}
        </div>
    </div>
);

// Sub-panel for switch account
const SwitchAccountPanel = ({ user, onBack, onClose }) => (
    <div className="animate-fade-in">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-yt-border">
            <button onClick={onBack} className="p-1 hover:bg-yt-bg-hover rounded-full transition-colors">
                <ChevronLeft size={18} className="text-yt-text" />
            </button>
            <h3 className="text-sm font-semibold text-yt-text">Switch account</h3>
        </div>
        <div className="py-2">
            {/* Current account */}
            <div className="flex items-center gap-3 px-4 py-3 bg-yt-bg-hover">
                <img src={user.avatar} className="w-10 h-10 rounded-full object-cover" alt="" />
                <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium text-yt-text truncate">{user.name}</p>
                    <p className="text-xs text-yt-text-secondary truncate">{user.email}</p>
                </div>
                <Check size={18} className="text-yt-blue shrink-0" />
            </div>
            {/* Add account button */}
            <Link
                to="/settings"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 hover:bg-yt-bg-hover transition-colors"
            >
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-yt-border flex items-center justify-center">
                    <User size={18} className="text-yt-text-secondary" />
                </div>
                <span className="text-sm text-yt-text">Add another account</span>
            </Link>
        </div>
    </div>
);

const ProfileMenu = ({ isOpen, onClose }) => {
    const { user, logout, isAdmin } = useUser();
    const { theme, toggleTheme } = useTheme();

    const [subPanel, setSubPanel] = useState(null); // null | 'language' | 'location' | 'switchAccount'
    const [language, setLanguage] = useState(() =>
        localStorage.getItem('yt_language') || 'en'
    );
    const [location, setLocation] = useState(() =>
        localStorage.getItem('yt_location') || 'IN'
    );
    const [restrictedMode, setRestrictedMode] = useState(() =>
        localStorage.getItem('yt_restricted_mode') === 'true'
    );

    if (!isOpen || !user) return null;

    const selectedLanguageLabel = languages.find(l => l.code === language)?.label || 'English';
    const selectedLocationLabel = locations.find(l => l.code === location)?.label || 'India';

    const handleLanguageSelect = (code) => {
        setLanguage(code);
        localStorage.setItem('yt_language', code);
        setSubPanel(null);
    };

    const handleLocationSelect = (code) => {
        setLocation(code);
        localStorage.setItem('yt_location', code);
        setSubPanel(null);
    };

    const handleRestrictedToggle = () => {
        const next = !restrictedMode;
        setRestrictedMode(next);
        localStorage.setItem('yt_restricted_mode', String(next));
    };

    return (
        <>
            {/* Backdrop for closing */}
            <div
                className="fixed inset-0 z-[60]"
                onClick={onClose}
            />

            <div className="fixed top-14 right-4 w-[300px] bg-yt-bg-secondary border border-yt-border rounded-xl shadow-2xl z-[70] overflow-hidden animate-scale-in">
                {subPanel === 'language' ? (
                    <SelectPanel
                        title="Choose your language"
                        items={languages}
                        selectedValue={language}
                        onSelect={handleLanguageSelect}
                        onBack={() => setSubPanel(null)}
                    />
                ) : subPanel === 'location' ? (
                    <SelectPanel
                        title="Choose your location"
                        items={locations}
                        selectedValue={location}
                        onSelect={handleLocationSelect}
                        onBack={() => setSubPanel(null)}
                    />
                ) : subPanel === 'switchAccount' ? (
                    <SwitchAccountPanel
                        user={user}
                        onBack={() => setSubPanel(null)}
                        onClose={onClose}
                    />
                ) : (
                    <>
                        {/* User Info Header */}
                        <div className="p-4 flex gap-4 border-b border-yt-border">
                            <img src={user.avatar} className="w-10 h-10 rounded-full object-cover" />
                            <div className="flex flex-col overflow-hidden">
                                <span className="font-semibold text-sm truncate text-yt-text">{user.name}</span>
                                <span className="text-sm text-yt-text-secondary truncate">{user.handle}</span>
                                <Link
                                    to={user.channelId ? `/channel/${user.channelId}` : '#'}
                                    onClick={onClose}
                                    className={`text-yt-blue text-sm mt-2 hover:underline ${!user.channelId ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {user.channelId ? 'View your channel' : 'No channel created'}
                                </Link>
                            </div>
                        </div>

                        <div className="max-h-[75vh] overflow-y-auto no-scrollbar">
                            <MenuSection>
                                <MenuItem icon={User} label="Google Account" to="/settings" onClick={onClose} />
                                <MenuItem
                                    icon={ShieldCheck}
                                    label="Switch account"
                                    secondary={<ChevronRight size={16} />}
                                    onClick={() => setSubPanel('switchAccount')}
                                />
                                <MenuItem icon={LogOut} label="Sign out" onClick={() => { logout(); onClose(); }} />
                            </MenuSection>

                            {isAdmin && (
                                <MenuSection>
                                    <MenuItem
                                        icon={Shield}
                                        label="YouTube Studio"
                                        to="/admin"
                                        onClick={onClose}
                                    />
                                    <MenuItem icon={Settings} label="Purchases and memberships" to="/purchases" onClick={onClose} />
                                </MenuSection>
                            )}

                            {!isAdmin && (
                                <MenuSection>
                                    <MenuItem icon={Settings} label="Purchases and memberships" to="/purchases" onClick={onClose} />
                                </MenuSection>
                            )}

                            <MenuSection>
                                <MenuItem icon={ShieldCheck} label="Your data in YouTube" to="/your-data" onClick={onClose} />
                                <MenuItem
                                    icon={theme === 'dark' ? Moon : Sun}
                                    label={`Appearance: ${theme === 'dark' ? 'Dark' : 'Light'}`}
                                    onClick={toggleTheme}
                                />
                                <MenuItem
                                    icon={Languages}
                                    label={`Language: ${selectedLanguageLabel}`}
                                    secondary={<ChevronRight size={16} />}
                                    onClick={() => setSubPanel('language')}
                                />
                                {/* Restricted Mode Toggle */}
                                <button
                                    onClick={handleRestrictedToggle}
                                    className="w-full flex items-center px-4 py-2.5 hover:bg-yt-bg-hover transition-colors text-left"
                                >
                                    <div className="w-9">
                                        <Shield size={20} className="text-yt-text" />
                                    </div>
                                    <div className="flex-1 flex items-center justify-between overflow-hidden">
                                        <span className="text-sm truncate text-yt-text">Restricted Mode</span>
                                        <div className={`relative w-9 h-5 rounded-full transition-colors ${restrictedMode ? 'bg-yt-blue' : 'bg-yt-bg-hover border border-yt-border'}`}>
                                            <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow ${restrictedMode ? 'translate-x-4' : ''}`} />
                                        </div>
                                    </div>
                                </button>
                                <MenuItem
                                    icon={Globe}
                                    label={`Location: ${selectedLocationLabel}`}
                                    secondary={<ChevronRight size={16} />}
                                    onClick={() => setSubPanel('location')}
                                />
                            </MenuSection>

                            <MenuSection>
                                <MenuItem icon={Settings} label="Settings" to="/settings" onClick={onClose} />
                            </MenuSection>

                            <MenuSection>
                                <MenuItem icon={HelpCircle} label="Help" to="/help" onClick={onClose} />
                                <MenuItem icon={MessageSquare} label="Send feedback" to="/feedback" onClick={onClose} />
                            </MenuSection>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default ProfileMenu;
