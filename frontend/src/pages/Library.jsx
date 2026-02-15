import React, { useState, useEffect } from 'react';
import { Library as LibraryIcon, History as HistoryIcon, ThumbsUp, Clock, ListVideo, PlayCircle, User, Info } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import VideoCard from '../components/VideoCard';

const Library = () => {
    const { user } = useUser();
    const [history, setHistory] = useState([]);
    const [likedVideos, setLikedVideos] = useState([]);
    const [savedVideos, setSavedVideos] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLibraryData = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                // Fetch History (Recent 8)
                const histData = await api.getUserHistory(user._id);
                setHistory(histData.slice(0, 8));

                // Fetch Liked Videos (Recent 8)
                const allVideosRes = await api.getVideos();
                const liked = allVideosRes.videos.filter(v =>
                    v.likedBy?.some(id => id.toString() === user._id.toString())
                );
                setLikedVideos(liked.slice(0, 8));

                // Fetch Subscriptions
                const subsData = await api.getUserSubscriptions(user._id);
                setSubscriptions(subsData);

                // Fetch Saved Videos (Watch Later)
                const savedData = await api.getSavedVideos(user._id);
                setSavedVideos(savedData.slice(0, 8));

                // Fetch Playlists
                const playlistsData = await api.getUserPlaylists(user._id);
                setPlaylists(playlistsData.slice(0, 8));

            } catch (err) {
                console.error('Fetch Library Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchLibraryData();
    }, [user]);

    if (loading) return <div className="p-10 text-center text-yt-text-secondary">Loading library...</div>;

    if (!user) return (
        <div className="flex flex-col items-center justify-center py-32 opacity-50 px-6 text-center">
            <div className="bg-yt-bg-secondary p-8 rounded-full mb-6 text-yt-blue">
                <LibraryIcon size={64} />
            </div>
            <h2 className="text-2xl font-bold text-yt-text">Enjoy your favorite videos</h2>
            <p className="text-[15px] text-yt-text-secondary mt-2 max-w-sm">
                Sign in to access videos that you've liked or saved.
            </p>
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row gap-8 p-4 sm:p-8 max-w-[1400px] mx-auto min-h-screen">
            {/* Main Content Area */}
            <div className="flex-1 order-2 lg:order-1 flex flex-col gap-12">

                {/* History Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <Link to="/history" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <HistoryIcon size={22} className="text-yt-text" />
                            <h2 className="text-xl font-black text-yt-text uppercase tracking-widest">History</h2>
                        </Link>
                        <Link to="/history" className="text-sm font-bold text-yt-blue hover:bg-yt-blue hover:bg-opacity-10 px-4 py-2 rounded-full transition-all">
                            See all
                        </Link>
                    </div>
                    {history.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                            {history.map(item => (
                                <VideoCard key={item._id} video={item.video} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-yt-text-secondary text-sm px-2">Watched videos will appear here.</p>
                    )}
                </section>

                {/* Liked Videos Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <Link to="/liked" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <ThumbsUp size={22} className="text-yt-text" />
                            <h2 className="text-xl font-black text-yt-text uppercase tracking-widest">Liked videos</h2>
                        </Link>
                        <Link to="/liked" className="text-sm font-bold text-yt-blue hover:bg-yt-blue hover:bg-opacity-10 px-4 py-2 rounded-full transition-all">
                            See all
                        </Link>
                    </div>
                    {likedVideos.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                            {likedVideos.map(video => (
                                <VideoCard key={video._id} video={video} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-yt-text-secondary text-sm px-2">Videos you've liked will appear here.</p>
                    )}
                </section>

                {/* Watch Later Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <Clock size={22} className="text-yt-text" />
                            <h2 className="text-xl font-black text-yt-text uppercase tracking-widest">Watch later</h2>
                        </div>
                        <Link to="/library" className="text-sm font-bold text-yt-blue hover:bg-yt-blue/10 px-4 py-2 rounded-full transition-all">
                            See all
                        </Link>
                    </div>
                    {savedVideos.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                            {savedVideos.map(video => (
                                <VideoCard key={video._id} video={video} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 bg-yt-bg-secondary rounded-2xl border border-dashed border-yt-border opacity-50">
                            <p className="text-sm font-medium">Videos you save to watch later will appear here.</p>
                        </div>
                    )}
                </section>

                {/* Playlists Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <Link to="/playlists" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <ListVideo size={22} className="text-yt-text" />
                            <h2 className="text-xl font-black text-yt-text uppercase tracking-widest">Playlists</h2>
                        </Link>
                        <Link to="/playlists" className="text-sm font-bold text-yt-blue hover:bg-yt-blue/10 px-4 py-2 rounded-full transition-all">
                            See all
                        </Link>
                    </div>
                    {playlists.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                            {playlists.map(p => (
                                <Link key={p._id} to={`/playlist/${p._id}`} className="group flex flex-col gap-2">
                                    <div className="relative aspect-video rounded-xl overflow-hidden bg-yt-bg-secondary border border-yt-border">
                                        {p.videos?.[0]?.thumbnailUrl ? (
                                            <img src={p.videos[0].thumbnailUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center opacity-20">
                                                <ListVideo size={40} />
                                            </div>
                                        )}
                                        <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-bold text-white flex items-center gap-1">
                                            <ListVideo size={10} />
                                            {p.videos?.length || 0}
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-sm line-clamp-1 px-1 group-hover:text-yt-blue transition-colors">{p.title}</h3>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 bg-yt-bg-secondary rounded-2xl border border-dashed border-yt-border opacity-50">
                            <p className="text-sm font-medium">Create playlists to see them here</p>
                        </div>
                    )}
                </section>
            </div>

            {/* Submenu Sidebar (User Stats) */}
            <div className="w-full lg:w-80 flex flex-col gap-6 order-1 lg:order-2">
                <div className="bg-yt-bg-secondary p-8 rounded-2xl border border-yt-border shadow-xl flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-[4px] border-yt-bg shadow-2xl mb-4 bg-yt-bg">
                        <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
                    </div>
                    <h2 className="text-xl font-black text-yt-text uppercase tracking-widest mb-1">{user.name}</h2>
                    <p className="text-sm text-yt-text-secondary mb-6">{user.email}</p>

                    <div className="w-full h-[1px] bg-yt-border mb-6"></div>

                    <div className="grid grid-cols-3 w-full gap-2">
                        <div className="flex flex-col gap-1 text-center">
                            <span className="text-lg font-black text-yt-text">{subscriptions?.length || 0}</span>
                            <span className="text-[8px] font-bold text-yt-text-secondary uppercase tracking-tight">Subs</span>
                        </div>
                        <div className="flex flex-col gap-1 text-center">
                            <span className="text-lg font-black text-yt-text">{likedVideos.length}</span>
                            <span className="text-[8px] font-bold text-yt-text-secondary uppercase tracking-tight">Liked</span>
                        </div>
                        <div className="flex flex-col gap-1 text-center">
                            <span className="text-lg font-black text-yt-text">{savedVideos.length}</span>
                            <span className="text-[8px] font-bold text-yt-text-secondary uppercase tracking-tight">Saved</span>
                        </div>
                    </div>
                </div>

                <div className="bg-yt-bg-secondary p-6 rounded-2xl border border-yt-border shadow-xl flex flex-col gap-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-yt-text-secondary px-1 flex items-center gap-2">
                        <Info size={14} /> Account Settings
                    </h3>
                    <div className="flex flex-col gap-1">
                        <button className="flex items-center gap-3 w-full px-4 py-3 hover:bg-yt-bg-hover rounded-xl text-sm font-bold text-yt-text transition-all group">
                            <User size={20} className="text-yt-text-secondary group-hover:text-yt-blue" />
                            Manage Google Account
                        </button>
                        <button className="flex items-center gap-3 w-full px-4 py-3 hover:bg-yt-bg-hover rounded-xl text-sm font-bold text-yt-text transition-all group">
                            <Clock size={20} className="text-yt-text-secondary" />
                            Watch later
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Library;
