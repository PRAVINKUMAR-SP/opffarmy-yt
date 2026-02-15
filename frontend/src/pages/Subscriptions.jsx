import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import api from '../utils/api';
import VideoCard from '../components/VideoCard';
import { PlayCircle } from 'lucide-react';

const Subscriptions = () => {
    const { user } = useUser();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubscriptionVideos = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                const subs = await api.getUserSubscriptions(user._id);
                const channelIds = subs.map(sub => sub.channel._id);

                // Fetch videos from these channels
                const allVideosRes = await api.getVideos();
                const filteredVideos = allVideosRes.videos.filter(v =>
                    channelIds.includes(v.channel?._id)
                );

                setVideos(filteredVideos);
            } catch (err) {
                console.error('Fetch Subscription Videos Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSubscriptionVideos();
    }, [user]);

    if (loading) return <div className="p-10 text-center text-yt-text-secondary">Loading subscriptions...</div>;

    if (!user) return (
        <div className="flex flex-col items-center justify-center py-24 opacity-60">
            <PlayCircle size={64} className="text-yt-text-secondary mb-4" />
            <h2 className="text-2xl font-bold text-yt-text">Don't miss new videos</h2>
            <p className="text-yt-text-secondary mt-2">Sign in to see updates from your favorite YouTube channels</p>
        </div>
    );

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold text-yt-text mb-6">Latest from your subscriptions</h1>
            {videos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {videos.map(video => (
                        <VideoCard key={video._id} video={video} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 opacity-60">
                    <PlayCircle size={64} className="text-yt-text-secondary mb-4" />
                    <p className="text-lg font-bold text-yt-text">No videos found</p>
                    <p className="text-yt-text-secondary mt-1">Try subscribing to more channels to see their latest uploads here.</p>
                </div>
            )}
        </div>
    );
};

export default Subscriptions;
