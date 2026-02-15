import React, { useState, useEffect } from 'react';
import VideoCard from '../components/VideoCard';
import api from '../utils/api';
import { Flame } from 'lucide-react';

const Trending = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const res = await api.getTrendingVideos();
                setVideos(res.videos);
            } catch (err) {
                console.error('Trending Page Load Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTrending();
    }, []);

    return (
        <div className="p-4 sm:p-6 lg:p-10 max-w-[1400px] mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-yt-bg-secondary rounded-full flex items-center justify-center">
                    <Flame size={32} className="text-orange-600" fill="currentColor" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold">Trending</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 gap-y-10">
                {videos.map(video => (
                    <VideoCard key={video._id} video={video} />
                ))}
            </div>

            {loading && <div className="text-center py-10 opacity-50">Loading trending content...</div>}
        </div>
    );
};

export default Trending;
