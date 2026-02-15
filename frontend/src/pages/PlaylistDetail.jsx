import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Play, Shuffle, Share2, MoreVertical, Trash2, ListVideo, Clock, Globe, Lock } from 'lucide-react';
import { useUser } from '../context/UserContext';
import api from '../utils/api';
import VideoCard from '../components/VideoCard';

const PlaylistDetail = () => {
    const { id } = useParams();
    const { user } = useUser();
    const navigate = useNavigate();
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPlaylist();
    }, [id]);

    const fetchPlaylist = async () => {
        try {
            const data = await api.getPlaylist(id);
            setPlaylist(data);
        } catch (err) {
            console.error('Fetch playlist error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePlaylist = async () => {
        if (!confirm('Are you sure you want to delete this playlist?')) return;
        try {
            await api.deletePlaylist(id);
            navigate('/library');
        } catch (err) {
            alert(err.message);
        }
    };

    const handleRemoveVideo = async (videoId) => {
        try {
            await api.removeVideoFromPlaylist(id, videoId);
            fetchPlaylist();
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <div className="p-10 text-center opacity-50">Loading...</div>;
    if (!playlist) return <div className="p-10 text-center text-red-500 font-bold">Playlist not found</div>;

    const firstVideo = playlist.videos?.[0];

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-yt-bg max-w-[1700px] mx-auto overflow-x-hidden">
            {/* Left Sidebar - Playlist Info */}
            <div className="w-full lg:w-[380px] lg:fixed lg:h-[calc(100vh-56px)] overflow-y-auto p-6 flex flex-col gap-6 lg:bg-gradient-to-b lg:from-yt-bg-secondary lg:to-yt-bg border-r border-yt-border">
                {/* Playlist Thumbnail Card */}
                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl group border border-yt-border">
                    {firstVideo?.thumbnailUrl ? (
                        <img src={firstVideo.thumbnailUrl} className="w-full h-full object-cover blur-[2px] opacity-40 scale-110" />
                    ) : (
                        <div className="w-full h-full bg-yt-bg-secondary flex items-center justify-center opacity-20">
                            <ListVideo size={64} />
                        </div>
                    )}
                    <div className="absolute inset-x-4 top-4 aspect-video rounded-xl overflow-hidden border border-yt-border/40 shadow-xl">
                        {firstVideo?.thumbnailUrl ? (
                            <img src={firstVideo.thumbnailUrl} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-yt-bg flex items-center justify-center">
                                <ListVideo size={32} />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-black text-yt-text uppercase tracking-widest">{playlist.title}</h1>
                    <Link to={`/channel/${playlist.owner?._id}`} className="text-sm font-bold text-yt-text hover:text-yt-blue transition-colors">
                        {playlist.owner?.name}
                    </Link>
                    <div className="flex items-center gap-3 text-xs text-yt-text-secondary font-medium">
                        <span className="flex items-center gap-1">
                            {playlist.privacy === 'private' ? <Lock size={12} /> : <Globe size={12} />}
                            {playlist.privacy}
                        </span>
                        <span>•</span>
                        <span>{playlist.videos?.length || 0} videos</span>
                        <span>•</span>
                        <span>Updated {new Date(playlist.updatedAt).toLocaleDateString()}</span>
                    </div>
                </div>

                <p className="text-sm text-yt-text-secondary line-clamp-4 leading-relaxed">
                    {playlist.description || "No description provided."}
                </p>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => firstVideo && navigate(`/watch/${firstVideo._id}`)}
                        className="flex-1 flex items-center justify-center gap-2 bg-yt-text text-[#0f0f0f] py-2.5 rounded-full font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                    >
                        <Play size={18} fill="currentColor" />
                        Play all
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 bg-yt-bg-secondary text-yt-text py-2.5 rounded-full font-bold text-sm hover:bg-yt-bg-hover active:scale-95 transition-all shadow-lg border border-yt-border">
                        <Shuffle size={18} />
                        Shuffle
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-3 hover:bg-yt-bg-hover rounded-full transition-colors text-yt-text">
                        <Share2 size={20} />
                    </button>
                    {user?._id === playlist.owner?._id && (
                        <button
                            onClick={handleDeletePlaylist}
                            className="p-3 hover:bg-red-500/10 hover:text-red-500 rounded-full transition-colors text-yt-text"
                        >
                            <Trash2 size={20} />
                        </button>
                    )}
                </div>
            </div>

            {/* Right Side - Video List */}
            <div className="flex-1 lg:ml-[380px] p-4 lg:p-8 flex flex-col gap-4">
                {playlist.videos?.length > 0 ? (
                    playlist.videos.map((video, index) => (
                        <div key={video._id} className="group relative flex gap-4 p-2 hover:bg-yt-bg-secondary rounded-2xl transition-all cursor-pointer">
                            <div className="flex items-center justify-center w-6 text-xs font-bold text-yt-text-secondary opacity-0 group-hover:opacity-100">
                                {index + 1}
                            </div>
                            <Link to={`/watch/${video._id}`} className="relative h-24 aspect-video rounded-xl overflow-hidden flex-shrink-0">
                                <img src={video.thumbnailUrl} className="w-full h-full object-cover" />
                                <div className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.5 rounded text-[10px] font-bold text-white">
                                    {video.duration}
                                </div>
                            </Link>
                            <div className="flex-1 flex flex-col gap-1 min-w-0 py-1">
                                <Link to={`/watch/${video._id}`}>
                                    <h3 className="font-bold text-[15px] line-clamp-2 leading-tight group-hover:text-yt-blue transition-colors">
                                        {video.title}
                                    </h3>
                                </Link>
                                <div className="flex items-center gap-1 text-xs text-yt-text-secondary font-medium mt-1">
                                    <span>{video.channel?.name}</span>
                                    <span>•</span>
                                    <span>{video.views >= 1000 ? (video.views / 1000).toFixed(1) + 'K' : video.views} views</span>
                                </div>
                            </div>

                            {user?._id === playlist.owner?._id && (
                                <button
                                    onClick={() => handleRemoveVideo(video._id)}
                                    className="p-2 opacity-0 group-hover:opacity-100 hover:bg-yt-bg-hover rounded-full text-yt-text-secondary hover:text-red-500 transition-all self-center"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 opacity-30">
                        <ListVideo size={48} className="mb-4" />
                        <p className="font-bold italic">This playlist has no videos.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlaylistDetail;
