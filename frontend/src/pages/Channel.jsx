import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import api from '../utils/api';
import { CheckCircle2, Search, Bell, PlayCircle, FileText, ListVideo, Film, Info, ThumbsUp, Calendar, Eye, Users, Camera } from 'lucide-react';
import { useUser } from '../context/UserContext';
import EditChannelModal from '../components/EditChannelModal';

const formatSubscribers = (count) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count;
};

const formatDate = (dateStr) => {
    if (!dateStr) return 'Unknown';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return `${Math.floor(months / 12)}y ago`;
};

// Posts Tab Content
const PostsTab = ({ channelId, user }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await api.getPostsByChannel(channelId);
                setPosts(res);
            } catch (err) {
                console.error('Error fetching channel posts:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [channelId]);

    const handleLike = async (postId) => {
        if (!user) return alert('Please sign in to like posts');
        try {
            const res = await api.likePost(postId, user._id);
            setPosts(prev => prev.map(p =>
                p._id === postId ? { ...p, likes: res.likes, hasLiked: res.hasLiked } : p
            ));
        } catch (err) {
            console.error('Error liking post:', err);
        }
    };

    if (loading) {
        return <div className="py-16 text-center text-yt-text-secondary">Loading posts...</div>;
    }

    if (posts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 opacity-60">
                <div className="bg-yt-bg-secondary p-6 rounded-full mb-4">
                    <FileText size={48} className="text-yt-text-secondary" />
                </div>
                <p className="text-lg font-bold text-yt-text">No community posts yet</p>
                <p className="text-[14px] text-yt-text-secondary mt-1">This channel hasn't published any community posts.</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl space-y-4">
            {posts.map(post => (
                <div key={post._id} className="bg-yt-bg-secondary rounded-xl border border-yt-border p-5 hover:border-yt-text-secondary transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                        <img src={post.channel?.avatarUrl} className="w-10 h-10 rounded-full object-cover" alt="" />
                        <div>
                            <p className="text-sm font-semibold text-yt-text">{post.channel?.name}</p>
                            <p className="text-xs text-yt-text-secondary">{timeAgo(post.createdAt)}</p>
                        </div>
                    </div>
                    <p className="text-sm text-yt-text leading-relaxed mb-3 whitespace-pre-wrap">{post.content}</p>
                    {post.imageUrl && (
                        <img src={post.imageUrl} className="w-full rounded-xl mb-3 max-h-[400px] object-cover" alt="" />
                    )}
                    <div className="flex items-center gap-4 pt-2 border-t border-yt-border">
                        <button
                            onClick={() => handleLike(post._id)}
                            className={`flex items-center gap-1.5 text-sm transition-colors ${post.hasLiked ? 'text-yt-blue' : 'text-yt-text-secondary hover:text-yt-text'}`}
                        >
                            <ThumbsUp size={16} fill={post.hasLiked ? 'currentColor' : 'none'} />
                            <span>{post.likes || 0}</span>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

// About Tab Content
const AboutTab = ({ channel, videoCount }) => {
    return (
        <div className="max-w-3xl grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Description Section */}
            <div className="md:col-span-2 space-y-6">
                <div className="bg-yt-bg-secondary rounded-xl border border-yt-border p-6">
                    <h3 className="font-bold text-yt-text mb-3">Description</h3>
                    <p className="text-sm text-yt-text-secondary leading-relaxed whitespace-pre-wrap">
                        {channel.description || 'This channel has no description yet.'}
                    </p>
                </div>

                {channel.socialLinks && channel.socialLinks.length > 0 && (
                    <div className="bg-yt-bg-secondary rounded-xl border border-yt-border p-6">
                        <h3 className="font-bold text-yt-text mb-3">Links</h3>
                        <div className="space-y-2">
                            {channel.socialLinks.map((link, i) => (
                                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                                    className="text-sm text-yt-blue hover:underline block">
                                    {link.title || link.url}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Stats Section */}
            <div className="space-y-4">
                <div className="bg-yt-bg-secondary rounded-xl border border-yt-border p-6">
                    <h3 className="font-bold text-yt-text mb-4">Stats</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Users size={18} className="text-yt-text-secondary" />
                            <div>
                                <p className="text-sm font-semibold text-yt-text">
                                    {formatSubscribers(channel.subscribers)}
                                </p>
                                <p className="text-xs text-yt-text-secondary">Subscribers</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <PlayCircle size={18} className="text-yt-text-secondary" />
                            <div>
                                <p className="text-sm font-semibold text-yt-text">{videoCount}</p>
                                <p className="text-xs text-yt-text-secondary">Videos</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar size={18} className="text-yt-text-secondary" />
                            <div>
                                <p className="text-sm font-semibold text-yt-text">
                                    {formatDate(channel.createdAt)}
                                </p>
                                <p className="text-xs text-yt-text-secondary">Joined</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Empty State for Shorts/Playlists
const EmptyTabState = ({ icon: Icon, title, description }) => (
    <div className="flex flex-col items-center justify-center py-24 opacity-60">
        <div className="bg-yt-bg-secondary p-6 rounded-full mb-4">
            <Icon size={48} className="text-yt-text-secondary" />
        </div>
        <p className="text-lg font-bold text-yt-text">{title}</p>
        <p className="text-[14px] text-yt-text-secondary mt-1">{description}</p>
    </div>
);

const Channel = () => {
    const { id } = useParams();
    const { user } = useUser();
    const [channel, setChannel] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Videos');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await api.getChannel(id);
                setChannel(res.channel);
                setVideos(res.videos);

                // Check subscription status
                if (user && res.channel?._id) {
                    const subRes = await api.checkSubscription(user._id, res.channel._id);
                    setIsSubscribed(subRes.subscribed);
                }
            } catch (err) {
                console.error('Channel Page Load Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, user]);

    const handleSubscribe = async () => {
        if (!user) return alert('Please sign in to subscribe');
        try {
            const res = await api.subscribe(user._id, channel._id);
            setIsSubscribed(res.subscribed);
            setChannel(prev => ({
                ...prev,
                subscribers: prev.subscribers + (res.subscribed ? 1 : -1)
            }));
        } catch (err) {
            console.error('Subscribe error:', err);
        }
    };

    if (loading) {
        return <div className="p-10 text-center text-yt-text-secondary">Loading channel...</div>;
    }

    if (!channel) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-yt-bg-secondary m-10 rounded-2xl border border-dashed border-yt-border">
                <p className="text-xl font-bold opacity-50 text-yt-text">Channel not found</p>
                <p className="text-sm opacity-40 mt-2 text-yt-text-secondary">This channel might have been deleted or moved.</p>
                <button
                    onClick={() => window.location.href = '/'}
                    className="mt-6 bg-yt-blue text-[#0f0f0f] px-6 py-2 rounded-full font-bold hover:bg-opacity-90 transition-all"
                >
                    Go Back Home
                </button>
            </div>
        );
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Home':
            case 'Videos':
                return (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-10">
                            {videos.map(video => (
                                <VideoCard key={video._id} video={video} />
                            ))}
                        </div>
                        {videos.length === 0 && (
                            <EmptyTabState
                                icon={PlayCircle}
                                title="No videos yet"
                                description="Check back later for new content from this creator."
                            />
                        )}
                    </>
                );
            case 'Shorts':
                return (
                    <EmptyTabState
                        icon={Film}
                        title="No Shorts yet"
                        description="When this channel uploads Shorts, they'll appear here."
                    />
                );
            case 'Playlists':
                return (
                    <EmptyTabState
                        icon={ListVideo}
                        title="No Playlists yet"
                        description="Playlists created by this channel will show up here."
                    />
                );
            case 'Posts':
                return <PostsTab channelId={channel._id} user={user} />;
            case 'About':
                return <AboutTab channel={channel} videoCount={videos.length} />;
            default:
                return null;
        }
    };

    const isOwner = user && channel && user._id === channel.owner;

    return (
        <div className="flex flex-col animate-fade-in bg-yt-bg min-h-screen">
            <EditChannelModal
                channel={channel}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onUpdate={(updatedChannel) => setChannel(updatedChannel)}
            />

            {/* Banner Area */}
            <div className="w-full h-[16vw] min-h-[160px] max-h-[240px] relative overflow-hidden bg-yt-bg-secondary group">
                <img
                    src={channel.bannerUrl || 'https://images.unsplash.com/photo-1579546678183-a9c101ad90d9?w=1600&h=400&fit=crop'}
                    className="w-full h-full object-cover opacity-90"
                    alt="Channel Banner"
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&h=400&fit=crop';
                    }}
                />
                {isOwner && (
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="absolute top-4 right-4 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 flex items-center gap-2"
                    >
                        <Camera size={16} /> Customize Banner
                    </button>
                )}
            </div>

            {/* Header Info Section */}
            <div className="max-w-[1284px] mx-auto w-full px-4 lg:px-8 py-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-8">
                    {/* Avatar Container */}
                    <div className="relative flex-shrink-0 group">
                        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-[4px] border-yt-bg shadow-xl bg-yt-bg-secondary relative">
                            <img
                                src={channel.avatarUrl}
                                className="w-full h-full object-cover"
                                alt={channel.name}
                            />
                            {isOwner && (
                                <div
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                >
                                    <Camera size={32} className="text-white" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Meta Details */}
                    <div className="flex flex-col gap-3 text-center sm:text-left flex-1 mt-1">
                        <div className="space-y-1">
                            <h1 className="text-2xl sm:text-4xl font-black text-yt-text tracking-tight flex items-center justify-center sm:justify-start gap-2">
                                {channel.name}
                                {channel.isVerified && <CheckCircle2 size={24} className="text-yt-text-secondary fill-yt-text-secondary/20" />}
                            </h1>

                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-1 text-[14px] font-normal text-yt-text-secondary">
                                <span className="font-semibold text-yt-text">{channel.handle || `@${channel.name.toLowerCase().replace(/\s+/g, '')}`}</span>
                                <span className="text-yt-border">•</span>
                                <span>{formatSubscribers(channel.subscribers)} {channel.subscribers === 1 ? 'subscriber' : 'subscribers'}</span>
                                <span className="text-yt-border">•</span>
                                <span>{videos.length} videos</span>
                            </div>
                        </div>

                        {channel.description && (
                            <p className="text-[14px] text-yt-text-secondary line-clamp-2 max-w-[600px] leading-relaxed">
                                {channel.description}
                                <span className="ml-1 font-bold text-yt-text cursor-pointer hover:underline" onClick={() => setActiveTab('About')}>...more</span>
                            </p>
                        )}

                        <div className="flex items-center justify-center sm:justify-start gap-3 mt-4">
                            {isOwner ? (
                                <>
                                    <button
                                        onClick={() => setIsEditModalOpen(true)}
                                        className="px-6 py-2.5 rounded-full text-[14px] font-bold transition-all active:scale-95 bg-yt-bg-secondary text-yt-text hover:bg-yt-bg-hover border border-yt-border"
                                    >
                                        Customize Channel
                                    </button>
                                    <button className="px-6 py-2.5 rounded-full text-[14px] font-bold transition-all active:scale-95 bg-yt-bg-secondary text-yt-text hover:bg-yt-bg-hover border border-yt-border">
                                        Manage Videos
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={handleSubscribe}
                                        className={`px-6 py-2.5 rounded-full text-[14px] font-bold transition-all active:scale-95 ${isSubscribed
                                            ? 'bg-yt-bg-secondary text-yt-text hover:bg-yt-bg-hover border border-yt-border'
                                            : 'bg-yt-text text-yt-bg hover:opacity-90'
                                            }`}
                                    >
                                        {isSubscribed ? 'Subscribed' : 'Subscribe'}
                                    </button>
                                    <button className="p-2.5 bg-yt-bg-secondary hover:bg-yt-bg-hover rounded-full text-yt-text transition-all active:scale-90 border border-yt-border">
                                        <Bell size={20} />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="mt-12 border-b border-yt-border flex relative overflow-x-auto no-scrollbar scroll-smooth">
                    <div className="flex gap-1">
                        {['Home', 'Videos', 'Shorts', 'Playlists', 'Posts', 'About'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 pb-3.5 text-[15px] font-bold transition-all relative ${activeTab === tab ? 'text-yt-text' : 'text-yt-text-secondary hover:text-yt-text'
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-yt-text rounded-t-full" />
                                )}
                            </button>
                        ))}
                    </div>
                    <div className="flex-1" />
                    <button className="px-4 pb-3.5 text-yt-text-secondary hover:text-yt-text transition-colors">
                        <Search size={20} />
                    </button>
                </div>

                {/* Tab Content */}
                <div className="py-6 sm:py-8">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default Channel;
