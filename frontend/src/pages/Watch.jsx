import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, Share2, MoreHorizontal, CheckCircle2, ListPlus, Download, Flag } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';
import CommentSection from '../components/CommentSection';
import VideoCard from '../components/VideoCard';
import { useUser } from '../context/UserContext';
import api from '../utils/api';
import ShareModal from '../components/ShareModal';
import PlaylistModal from '../components/PlaylistModal';

const formatSubscribers = (count) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count;
};

const Watch = () => {
    const { id } = useParams();
    const { user } = useUser();
    const [video, setVideo] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [descExpanded, setDescExpanded] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchData = async () => {
            setLoading(true);
            try {
                const [videoRes, recsRes] = await Promise.all([
                    api.getVideo(id),
                    api.getVideos({ limit: 10 })
                ]);
                setVideo(videoRes);
                setRecommendations(recsRes.videos.filter(v => v._id !== id));

                // Record unique view
                await api.recordVideoView(id, user?._id);

                // Set initial like state
                if (user && videoRes.likedBy) {
                    setIsLiked(videoRes.likedBy.includes(user._id));
                }

                // Check subscription status
                if (user && videoRes.channel?._id) {
                    const subRes = await api.checkSubscription(user._id, videoRes.channel._id);
                    setIsSubscribed(subRes.subscribed);
                }
            } catch (err) {
                console.error('Watch Page Load Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, user]);

    const handleLike = async () => {
        if (!user) return alert('Please sign in to like videos');
        try {
            const res = await api.likeVideo(id, user._id);
            setIsLiked(res.hasLiked);
            setVideo(prev => ({ ...prev, likes: res.likes }));
        } catch (err) {
            console.error('Like error:', err);
        }
    };

    const handleSubscribe = async () => {
        if (!user) return alert('Please sign in to subscribe');
        try {
            const res = await api.subscribe(user._id, video.channel._id);
            setIsSubscribed(res.subscribed);
            setVideo(prev => ({
                ...prev,
                channel: {
                    ...prev.channel,
                    subscribers: prev.channel.subscribers + (res.subscribed ? 1 : -1)
                }
            }));
        } catch (err) {
            console.error('Subscribe error:', err);
        }
    };

    const handleDownload = async () => {
        if (!video?.videoUrl) return;
        try {
            // Use fetch to get the blob for reliable cross-origin download
            const response = await fetch(video.videoUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${video.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp4`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download error:', err);
            // Fallback to direct link if fetch fails
            window.open(video.videoUrl, '_blank');
        }
    };

    const handleReport = async () => {
        if (!user) return alert('Please sign in to report videos');
        try {
            await api.reportVideo(id, user._id);
            alert('Video reported successfully. Thank you for helping keep our community safe.');
            setIsMoreMenuOpen(false);
        } catch (err) {
            console.error('Report error:', err);
            alert(err.message);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-6 animate-pulse">
                <div className="flex-1">
                    <div className="aspect-video skeleton rounded-xl" />
                    <div className="mt-4 h-8 skeleton rounded-lg w-3/4" />
                    <div className="mt-4 flex justify-between items-center">
                        <div className="flex gap-4 items-center">
                            <div className="w-10 h-10 skeleton rounded-full" />
                            <div className="w-24 h-4 skeleton rounded-md" />
                        </div>
                        <div className="w-32 h-10 skeleton rounded-full" />
                    </div>
                </div>
                <div className="lg:w-[400px] flex flex-col gap-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex gap-2">
                            <div className="w-40 aspect-video skeleton rounded-lg" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 skeleton rounded-md" />
                                <div className="h-3 skeleton rounded-md w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-6 pb-12 max-w-[1440px] mx-auto overflow-x-hidden">
            {/* Video Content */}
            <div className="flex-1 min-w-0">
                <VideoPlayer src={video.videoUrl} poster={video.thumbnailUrl} />

                <div className="flex flex-wrap gap-2 mt-4">
                    {video.categories?.map(cat => (
                        <span key={cat._id} className="text-yt-blue text-[13px] font-bold hover:underline cursor-pointer">
                            #{cat.name.replace(/\s+/g, '')}
                        </span>
                    ))}
                </div>

                <h1 className="text-xl font-bold mt-2 leading-relaxed line-clamp-2">
                    {video.title}
                </h1>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 border-b border-yt-border pb-4">
                    <div className="flex items-center gap-4">
                        <Link to={`/channel/${video.channel?._id}`} className="flex-shrink-0">
                            <img src={video.channel?.avatarUrl} className="w-10 h-10 rounded-full object-cover border border-yt-border" />
                        </Link>
                        <div className="flex flex-col overflow-hidden">
                            <Link to={`/channel/${video.channel?._id}`} className="font-bold flex items-center gap-1 group">
                                <span className="truncate group-hover:text-yt-blue transition-colors">{video.channel?.name}</span>
                                {video.channel?.isVerified && <CheckCircle2 size={12} fill="gray" />}
                            </Link>
                            <span className="text-xs text-yt-text-secondary truncate">
                                {formatSubscribers(video.channel?.subscribers)} {video.channel?.subscribers === 1 ? 'subscriber' : 'subscribers'}
                            </span>
                        </div>
                        <button
                            onClick={handleSubscribe}
                            className={`ml-2 font-medium px-4 py-2 rounded-full transition-colors text-sm whitespace-nowrap ${isSubscribed
                                ? 'bg-yt-bg-secondary text-yt-text hover:bg-yt-bg-hover'
                                : 'bg-yt-text text-[#0f0f0f] hover:bg-[#e1e1e1]'
                                }`}
                        >
                            {isSubscribed ? 'Subscribed' : 'Subscribe'}
                        </button>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap pb-1">
                        <div className="flex bg-yt-bg-secondary rounded-full overflow-hidden">
                            <button
                                onClick={handleLike}
                                className={`flex items-center gap-2 px-4 py-2 hover:bg-yt-bg-hover border-r border-yt-border transition-colors ${isLiked ? 'text-yt-blue' : ''}`}
                            >
                                <ThumbsUp size={18} fill={isLiked ? "currentColor" : "none"} />
                                <span className="text-sm font-medium">
                                    {video.likes >= 1000 ? (video.likes / 1000).toFixed(1) + 'K' : video.likes}
                                </span>
                            </button>
                            <button className="px-4 py-2 hover:bg-yt-bg-hover transition-colors">
                                <ThumbsDown size={18} />
                            </button>
                        </div>
                        <button
                            onClick={() => setIsShareModalOpen(true)}
                            className="flex items-center gap-2 bg-yt-bg-secondary px-4 py-2 rounded-full hover:bg-yt-bg-hover transition-colors whitespace-nowrap"
                        >
                            <Share2 size={18} />
                            <span className="text-sm font-medium">Share</span>
                        </button>
                        <button
                            onClick={() => setIsPlaylistModalOpen(true)}
                            className="flex items-center gap-2 bg-yt-bg-secondary px-4 py-2 rounded-full hover:bg-yt-bg-hover transition-colors whitespace-nowrap"
                        >
                            <ListPlus size={18} />
                            <span className="text-sm font-medium">Save</span>
                        </button>
                        <div className="relative">
                            <button
                                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                                className={`p-2 rounded-full transition-colors ${isMoreMenuOpen ? 'bg-yt-bg-hover' : 'bg-yt-bg-secondary hover:bg-yt-bg-hover'}`}
                            >
                                <MoreHorizontal size={18} />
                            </button>

                            {isMoreMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsMoreMenuOpen(false)}></div>
                                    <div className="absolute right-0 bottom-full mb-2 w-44 bg-yt-bg-secondary border border-yt-border rounded-xl shadow-2xl overflow-hidden z-20 animate-fade-in">
                                        <button
                                            onClick={handleDownload}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-yt-bg-hover text-sm font-medium transition-colors"
                                        >
                                            <Download size={18} />
                                            <span>Download</span>
                                        </button>
                                        <button
                                            onClick={handleReport}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-yt-bg-hover text-sm font-medium transition-colors text-red-500"
                                        >
                                            <Flag size={18} />
                                            <span>Report</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Description Section */}
                <div className="mt-4 p-3 bg-yt-bg-secondary rounded-xl cursor-default hover:bg-yt-bg-hover transition-colors overflow-hidden">
                    <div className="flex items-center gap-2 font-bold text-sm mb-1">
                        <span>{video.views.toLocaleString()} views</span>
                        <span>•</span>
                        <span>{new Date(video.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <p className={`text-sm whitespace-pre-wrap leading-relaxed ${!descExpanded ? 'line-clamp-2' : ''}`}>
                        {video.description}
                    </p>
                    <button
                        onClick={() => setDescExpanded(!descExpanded)}
                        className="text-sm font-bold mt-2 hover:opacity-80 transition-opacity"
                    >
                        {descExpanded ? 'Show less' : '...more'}
                    </button>
                </div>

                <CommentSection videoId={id} />

                <ShareModal
                    isOpen={isShareModalOpen}
                    onClose={() => setIsShareModalOpen(false)}
                    videoTitle={video.title}
                />

                <PlaylistModal
                    isOpen={isPlaylistModalOpen}
                    onClose={() => setIsPlaylistModalOpen(false)}
                    videoId={id}
                />
            </div>

            {/* Suggested Videos */}
            <div className="lg:w-[400px] flex flex-col gap-4">
                {recommendations.map(v => (
                    <div key={v._id} className="flex gap-3 group animate-fade-in">
                        <Link to={`/watch/${v._id}`} className="relative h-24 aspect-video rounded-lg overflow-hidden flex-shrink-0">
                            <img src={v.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                            <div className="absolute bottom-1 right-1 bg-[#00000080] text-[10px] font-medium px-1.5 py-0.5 rounded text-white">
                                {v.duration}
                            </div>
                        </Link>
                        <div className="flex flex-col gap-1 overflow-hidden">
                            <Link to={`/watch/${v._id}`}>
                                <h3 className="text-sm font-semibold line-clamp-2 leading-tight group-hover:text-yt-blue transition-colors">
                                    {v.title}
                                </h3>
                            </Link>
                            <Link to={`/channel/${v.channel?._id}`} className="text-xs text-yt-text-secondary hover:text-yt-text transition-colors">
                                {v.channel?.name}
                            </Link>
                            <div className="text-[11px] text-yt-text-secondary flex items-center gap-1">
                                <span>{v.views > 1000 ? (v.views / 1000).toFixed(1) + 'K' : v.views} views</span>
                                <span>•</span>
                                <span>{new Date(v.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Watch;
