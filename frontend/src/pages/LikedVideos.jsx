import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import api from '../utils/api';
import VideoCard from '../components/VideoCard';
import { ThumbsUp } from 'lucide-react';

const LikedVideos = () => {
    const { user } = useUser();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLikedVideos = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                const allVideosRes = await api.getVideos();
                const filteredVideos = allVideosRes.videos.filter(v =>
                    v.likedBy?.includes(user._id)
                );
                setVideos(filteredVideos);
            } catch (err) {
                console.error('Fetch Liked Videos Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchLikedVideos();
    }, [user]);

    if (loading) return <div className="p-10 text-center text-yt-text-secondary">Loading liked videos...</div>;

    if (!user) return (
        <div className="flex flex-col items-center justify-center py-24 opacity-60">
            <ThumbsUp size={64} className="text-yt-text-secondary mb-4" />
            <h2 className="text-2xl font-bold text-yt-text">Enjoy your favorite videos</h2>
            <p className="text-yt-text-secondary mt-2">Sign in to access videos that you've liked</p>
        </div>
    );

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold text-yt-text mb-6">Liked videos</h1>
            {videos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {videos.map(video => (
                        <VideoCard key={video._id} video={video} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 opacity-60">
                    <ThumbsUp size={64} className="text-yt-text-secondary mb-4" />
                    <p className="text-lg font-bold text-yt-text">No liked videos</p>
                    <p className="text-yt-text-secondary mt-1">Videos you've liked will appear here.</p>
                </div>
            )}
        </div>
    );
};

export default LikedVideos;
