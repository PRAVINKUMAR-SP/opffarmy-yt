import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ListVideo, Plus, MoreVertical, Globe, Lock } from 'lucide-react';
import { useUser } from '../context/UserContext';
import api from '../utils/api';

const Playlists = () => {
    const { user } = useUser();
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchPlaylists();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchPlaylists = async () => {
        try {
            const data = await api.getUserPlaylists(user._id);
            setPlaylists(data);
        } catch (err) {
            console.error('Fetch playlists error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center opacity-50">Loading playlists...</div>;

    if (!user) return (
        <div className="flex flex-col items-center justify-center py-32 opacity-50">
            <ListVideo size={64} className="mb-4" />
            <h2 className="text-2xl font-bold">Sign in to see your playlists</h2>
        </div>
    );

    return (
        <div className="p-4 sm:p-8 max-w-[1400px] mx-auto min-h-screen">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-black uppercase tracking-widest flex items-center gap-3">
                    <ListVideo size={28} />
                    Playlists
                </h1>
            </div>

            {playlists.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                    {playlists.map(playlist => (
                        <div key={playlist._id} className="group flex flex-col gap-3">
                            <Link to={`/playlist/${playlist._id}`} className="relative aspect-video rounded-xl overflow-hidden bg-yt-bg-secondary border border-yt-border">
                                {playlist.videos?.[0]?.thumbnailUrl ? (
                                    <img src={playlist.videos[0].thumbnailUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center opacity-20">
                                        <ListVideo size={48} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white font-bold text-sm">PLAY ALL</span>
                                </div>
                                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-[10px] font-bold text-white flex items-center gap-1">
                                    <ListVideo size={12} />
                                    {playlist.videos?.length || 0} VIDEOS
                                </div>
                            </Link>

                            <div className="flex flex-col gap-1 px-1">
                                <div className="flex justify-between items-start gap-2">
                                    <Link to={`/playlist/${playlist._id}`} className="font-bold text-[15px] line-clamp-2 hover:text-yt-blue transition-colors">
                                        {playlist.title}
                                    </Link>
                                    <button className="p-1 hover:bg-yt-bg-hover rounded-full transition-colors opacity-0 group-hover:opacity-100">
                                        <MoreVertical size={16} />
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-yt-text-secondary font-medium">
                                    <span>{playlist.privacy === 'private' ? 'Private' : 'Public'}</span>
                                    <span>•</span>
                                    <span>View full playlist</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-32 opacity-30 border-2 border-dashed border-yt-border rounded-3xl">
                    <ListVideo size={64} className="mb-4" />
                    <p className="text-lg font-bold">No playlists found</p>
                    <p className="text-sm">Create a playlist while watching a video to see it here.</p>
                </div>
            )}
        </div>
    );
};

export default Playlists;
