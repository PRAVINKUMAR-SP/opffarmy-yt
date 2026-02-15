import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import api from '../utils/api';
import { SlidersHorizontal } from 'lucide-react';

const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) return;
            setLoading(true);
            try {
                const res = await api.search(query);
                setResults(res.videos);
            } catch (err) {
                console.error('Search Page Load Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [query]);

    if (loading) {
        return (
            <div className="flex flex-col gap-4 p-4 lg:p-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex flex-col sm:flex-row gap-4 animate-pulse">
                        <div className="w-full sm:w-72 aspect-video skeleton rounded-xl" />
                        <div className="flex-1 space-y-3">
                            <div className="h-6 skeleton rounded-md w-3/4" />
                            <div className="h-4 skeleton rounded-md w-1/4" />
                            <div className="h-4 skeleton rounded-md w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto p-4 lg:p-6 pb-12">
            <div className="flex items-center justify-between mb-6 border-b border-yt-border pb-4">
                <h2 className="text-xl font-bold">Search results for "{query}"</h2>
                <button className="flex items-center gap-2 hover:bg-yt-bg-hover px-3 py-1.5 rounded-full transition-colors font-medium text-sm">
                    <SlidersHorizontal size={18} />
                    Filters
                </button>
            </div>

            <div className="flex flex-col gap-6 lg:gap-8">
                {results.map((video) => (
                    <div key={video._id} className="flex flex-col sm:flex-row gap-4 group cursor-pointer animate-fade-in">
                        <Link to={`/watch/${video._id}`} className="relative w-full sm:w-[360px] aspect-video rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                            <img
                                src={video.thumbnailUrl}
                                alt={video.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute bottom-2 right-2 bg-[#000000cc] text-white text-xs font-medium px-1.5 py-0.5 rounded-md">
                                {video.duration}
                            </div>
                        </Link>

                        <div className="flex flex-col gap-1 pr-2">
                            <Link to={`/watch/${video._id}`}>
                                <h3 className="text-lg lg:text-xl font-medium line-clamp-2 leading-tight group-hover:text-yt-blue transition-colors">
                                    {video.title}
                                </h3>
                            </Link>
                            <div className="text-sm text-yt-text-secondary flex items-center gap-1 mt-1">
                                <span>{(video.views / 1000).toFixed(1)}K views</span>
                                <span>•</span>
                                <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                            </div>

                            <Link to={`/channel/${video.channel?._id}`} className="flex items-center gap-2 py-2 group/channel">
                                <img
                                    src={video.channel?.avatarUrl}
                                    className="w-6 h-6 rounded-full object-cover border border-yt-border"
                                />
                                <span className="text-sm text-yt-text-secondary group-hover/channel:text-yt-text transition-colors">
                                    {video.channel?.name}
                                </span>
                            </Link>

                            <p className="text-sm text-yt-text-secondary line-clamp-2 mt-1 hidden lg:block">
                                {video.description}
                            </p>
                        </div>
                    </div>
                ))}

                {results.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 bg-yt-bg-secondary rounded-2xl border border-dashed border-yt-border">
                        <p className="text-xl font-bold opacity-50">No results found for "{query}"</p>
                        <p className="text-sm opacity-40 mt-2">Try different keywords or check for typos</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
