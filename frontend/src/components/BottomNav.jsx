import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Plus, PlaySquare, Library, Video, Send, Radio } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useModals } from '../context/ModalContext';

const BottomNav = () => {
    const { user } = useUser();
    const { openUpload, openPost, openCC, openLogin } = useModals();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const navItems = [
        { icon: Home, label: 'Home', to: '/' },
        { icon: Compass, label: 'Shorts', to: '/trending' },
        { icon: null, label: 'Create', to: null, isCreate: true },
        { icon: PlaySquare, label: 'Subscriptions', to: '/subscriptions' },
        { icon: Library, label: 'You', to: '/library' },
    ];

    const handleCreateClick = () => {
        if (!user) {
            openLogin();
            return;
        }
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            {/* Create Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[110] bg-black bg-opacity-60 flex items-end justify-center sm:hidden animate-fade-in" onClick={() => setIsMenuOpen(false)}>
                    <div className="bg-yt-bg-elevated w-full rounded-t-2xl p-4 flex flex-col gap-2 animate-slide-up" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-2 px-2">
                            <h3 className="text-lg font-bold">Create</h3>
                            <button onClick={() => setIsMenuOpen(false)} className="text-yt-text-secondary">✕</button>
                        </div>
                        {!user.channelId ? (
                            <button
                                onClick={() => { openCC(); setIsMenuOpen(false); }}
                                className="flex items-center gap-4 p-4 hover:bg-white hover:bg-opacity-5 rounded-xl transition-colors"
                            >
                                <Plus size={24} className="text-yt-blue" />
                                <span className="font-medium">Create a channel</span>
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => { openUpload(); setIsMenuOpen(false); }}
                                    className="flex items-center gap-4 p-4 hover:bg-white hover:bg-opacity-5 rounded-xl transition-colors"
                                >
                                    <Video size={24} />
                                    <span className="font-medium">Upload a video</span>
                                </button>
                                <button
                                    onClick={() => { openUpload(); setIsMenuOpen(false); }}
                                    className="flex items-center gap-4 p-4 hover:bg-white hover:bg-opacity-5 rounded-xl transition-colors"
                                >
                                    <Radio size={24} />
                                    <span className="font-medium">Go live</span>
                                </button>
                                <button
                                    onClick={() => { openPost(); setIsMenuOpen(false); }}
                                    className="flex items-center gap-4 p-4 hover:bg-white hover:bg-opacity-5 rounded-xl transition-colors"
                                >
                                    <Send size={24} />
                                    <span className="font-medium">Create a post</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-yt-bg border-t border-yt-border flex items-center justify-around h-12 lg:hidden safe-area-bottom">
                {navItems.map((item, idx) => {
                    if (item.isCreate) {
                        return (
                            <button
                                key={idx}
                                onClick={handleCreateClick}
                                className="flex flex-col items-center justify-center gap-0.5 p-1 relative active:scale-90 transition-transform"
                            >
                                <div className="w-9 h-7 bg-yt-text rounded-lg flex items-center justify-center">
                                    <Plus size={20} className="text-[#0f0f0f]" strokeWidth={3} />
                                </div>
                            </button>
                        );
                    }
                    return (
                        <NavLink
                            key={idx}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex flex-col items-center justify-center gap-0.5 p-1 min-w-[48px] transition-colors ${isActive ? 'text-yt-text' : 'text-yt-text-secondary'}`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.5} fill={isActive && (item.label === 'Home' || item.label === 'You') ? 'currentColor' : 'none'} />
                                    <span className="text-[10px] font-medium leading-none">{item.label}</span>
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </nav>
        </>
    );
};

export default BottomNav;
