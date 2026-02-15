import React from 'react';
import { Home, Compass, PlaySquare, Clock, ThumbsUp, Library, Settings, History, Tv2, Video, User, MessageSquare, Sun, Moon, ListVideo } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useSidebar } from '../context/SidebarContext';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';

const SidebarItem = ({ icon: Icon, label, to, isCollapsed }) => (
    <NavLink
        to={to}
        className={({ isActive }) => `
      flex items-center gap-5 px-3 py-2.5 rounded-lg transition-colors
      ${isActive ? 'bg-yt-bg-hover font-medium' : 'hover:bg-yt-bg-hover'}
      ${isCollapsed ? 'justify-center px-0' : ''}
    `}
        title={isCollapsed ? label : ''}
    >
        {({ isActive }) => (
            <>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {!isCollapsed && <span className="text-sm truncate">{label}</span>}
            </>
        )}
    </NavLink>
);

const Sidebar = () => {
    const { user, isAdmin, login } = useUser();
    const { isOpen } = useSidebar();
    const { theme, toggleTheme } = useTheme();
    const [subscriptions, setSubscriptions] = React.useState([]);

    React.useEffect(() => {
        const fetchSubs = async () => {
            if (user?._id) {
                try {
                    const res = await api.getUserSubscriptions(user._id);
                    // subscriptions are objects like { _id, subscriber, channel: { name, avatarUrl, ... } }
                    setSubscriptions(res);
                } catch (err) {
                    console.error('Sidebar Subs Error:', err);
                }
            }
        };
        fetchSubs();
    }, [user]);

    return (
        <aside className={`${isOpen ? 'w-64' : 'w-[72px]'} flex flex-col gap-2 p-2 bg-yt-bg border-r border-yt-border overflow-y-auto hidden lg:flex transition-all duration-300`}>
            <div className="flex flex-col gap-1 border-b border-yt-border pb-3">
                <SidebarItem icon={Home} label="Home" to="/" isCollapsed={!isOpen} />
                <SidebarItem icon={Compass} label="Trending" to="/trending" isCollapsed={!isOpen} />
                <SidebarItem icon={PlaySquare} label="Subscriptions" to="/subscriptions" isCollapsed={!isOpen} />
            </div>

            {!user && isOpen && (
                <div className="flex flex-col gap-3 border-b border-yt-border py-4 px-3">
                    <p className="text-sm leading-relaxed text-yt-text">Sign in to like videos, comment and subscribe.</p>
                    <button
                        onClick={async () => await login('user')}
                        className="flex items-center gap-2 w-max px-4 py-2 border border-yt-border text-yt-blue rounded-full text-sm font-medium hover:bg-yt-blue hover:bg-opacity-10 transition-all active:scale-95"
                    >
                        <User size={20} />
                        Sign in
                    </button>
                </div>
            )}

            <div className="flex flex-col gap-1 border-b border-yt-border py-3">
                {isOpen && <h3 className="px-3 py-2 text-sm font-semibold">You</h3>}
                <SidebarItem icon={Tv2} label="Your channel" to={user?.channelId ? `/channel/${user.channelId}` : '/'} isCollapsed={!isOpen} />
                <SidebarItem icon={History} label="History" to="/history" isCollapsed={!isOpen} />
                <SidebarItem icon={ListVideo} label="Playlists" to="/playlists" isCollapsed={!isOpen} />
                <SidebarItem icon={Library} label="Library" to="/library" isCollapsed={!isOpen} />
                <SidebarItem icon={ThumbsUp} label="Liked videos" to="/liked" isCollapsed={!isOpen} />
            </div>

            {/* Subscriptions Section */}
            {user && subscriptions.length > 0 && (
                <div className="flex flex-col gap-1 border-b border-yt-border py-3">
                    {isOpen && <h3 className="px-3 py-2 text-sm font-semibold uppercase text-[12px] text-yt-text-secondary tracking-wider">Subscriptions</h3>}
                    {subscriptions.map(sub => (
                        <Link
                            key={sub._id}
                            to={`/channel/${sub.channel?._id}`}
                            className={`flex items-center gap-5 px-3 py-2 rounded-lg hover:bg-yt-bg-hover transition-colors ${!isOpen ? 'justify-center px-0' : ''}`}
                            title={sub.channel?.name}
                        >
                            <img
                                src={sub.channel?.avatarUrl}
                                className="w-6 h-6 rounded-full object-cover shrink-0"
                                alt={sub.channel?.name}
                            />
                            {isOpen && <span className="text-sm truncate flex-1">{sub.channel?.name}</span>}
                        </Link>
                    ))}
                </div>
            )}

            {isAdmin && (
                <div className="flex flex-col gap-1 border-b border-yt-border py-3">
                    {isOpen && <h3 className="px-3 py-2 text-sm font-semibold">Admin</h3>}
                    <SidebarItem icon={Settings} label="Dashboard" to="/admin" isCollapsed={!isOpen} />
                    <SidebarItem icon={Video} label="Videos" to="/admin/videos" isCollapsed={!isOpen} />
                    <SidebarItem icon={User} label="Channels" to="/admin/channels" isCollapsed={!isOpen} />
                    <SidebarItem icon={User} label="Users" to="/admin/users" isCollapsed={!isOpen} />
                    <SidebarItem icon={MessageSquare} label="Posts" to="/admin/posts" isCollapsed={!isOpen} />
                    <SidebarItem icon={Compass} label="Categories" to="/admin/categories" isCollapsed={!isOpen} />
                </div>
            )}

            {isOpen && (
                <div className="mt-auto px-3 py-4 text-[11px] text-yt-text-secondary">
                    <button
                        onClick={toggleTheme}
                        className="flex items-center gap-2 mb-4 px-2 py-1.5 rounded-lg hover:bg-yt-bg-hover transition-colors w-full"
                    >
                        {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                        <span className="text-sm font-medium">Appearance: {theme === 'dark' ? 'Dark' : 'Light'}</span>
                    </button>
                    <p>&copy; 2024 OPFFARMY</p>
                    <p className="mt-2 text-[10px] leading-tight">
                        About Press Copyright Contact us Creators Advertise Developers
                    </p>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
