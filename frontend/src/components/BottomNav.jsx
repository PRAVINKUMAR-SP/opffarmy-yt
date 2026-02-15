import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Plus, PlaySquare, Library } from 'lucide-react';
import { useUser } from '../context/UserContext';

const BottomNav = () => {
    const { user } = useUser();

    const navItems = [
        { icon: Home, label: 'Home', to: '/' },
        { icon: Compass, label: 'Shorts', to: '/trending' },
        { icon: null, label: 'Create', to: null, isCreate: true },
        { icon: PlaySquare, label: 'Subscriptions', to: '/subscriptions' },
        { icon: Library, label: 'You', to: '/library' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-yt-bg border-t border-yt-border flex items-center justify-around h-12 lg:hidden safe-area-bottom">
            {navItems.map((item, idx) => {
                if (item.isCreate) {
                    return (
                        <button key={idx} className="flex flex-col items-center justify-center gap-0.5 p-1">
                            <div className="w-8 h-6 bg-yt-text rounded-lg flex items-center justify-center">
                                <Plus size={18} className="text-[#0f0f0f]" strokeWidth={3} />
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
                                <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.5} fill={isActive && item.label === 'Home' ? 'currentColor' : 'none'} />
                                <span className="text-[10px] font-medium leading-none">{item.label}</span>
                            </>
                        )}
                    </NavLink>
                );
            })}
        </nav>
    );
};

export default BottomNav;
