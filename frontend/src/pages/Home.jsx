import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RotateCcw } from 'lucide-react';
import CategoryBar from '../components/CategoryBar';
import VideoCard from '../components/VideoCard';
import api from '../utils/api';

const Home = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [videos, setVideos] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Find if the current selected category is "All"
                const currentCat = categories.find(c => c._id === selectedCategory);
                const isAll = !currentCat || currentCat.name === 'All';

                const [catsRes, vidsRes] = await Promise.all([
                    api.getCategories(),
                    api.getVideos({
                        category: isAll ? undefined : selectedCategory,
                        search: query || undefined
                    })
                ]);

                // Update categories list
                setCategories(catsRes);
                setVideos(vidsRes.videos);

                // Ensure "All" is selected by default if nothing is selected
                if (!selectedCategory && catsRes.length > 0) {
                    const allCat = catsRes.find(c => c.name === 'All');
                    if (allCat) setSelectedCategory(allCat._id);
                }
            } catch (err) {
                console.error('Home Page Load Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedCategory, query]);

    if (loading) {
        return (
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="flex flex-col gap-3">
                        <div className="aspect-video skeleton rounded-xl w-full" />
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full skeleton" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 skeleton rounded-md w-3/4" />
                                <div className="h-3 skeleton rounded-md w-1/2" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="pb-10">
            <CategoryBar
                categories={categories}
                selectedCategory={selectedCategory}
                onSelect={setSelectedCategory}
            />

            {query && (
                <div className="px-4 sm:px-6 pt-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        Results for <span className="text-yt-blue">"{query}"</span>
                    </h2>
                    <p className="text-xs text-yt-text-secondary font-medium uppercase tracking-widest bg-yt-bg-secondary px-3 py-1 rounded-full border border-yt-border">
                        {videos.length} videos found
                    </p>
                </div>
            )}

            {videos.some(v => v.type === 'short') && !query && (
                <section className="px-4 sm:px-6 mb-10">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-yt-red rounded-lg flex items-center justify-center shadow-lg">
                            <RotateCcw size={20} className="text-white animate-spin-slow" />
                        </div>
                        <h2 className="text-xl font-black text-yt-text uppercase tracking-widest">Shorts</h2>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                        {videos.filter(v => v.type === 'short').map((video) => (
                            <div key={video._id} className="flex-shrink-0 w-[180px] sm:w-[220px]">
                                <VideoCard video={video} />
                            </div>
                        ))}
                    </div>
                    <div className="h-[1px] bg-yt-border mt-6"></div>
                </section>
            )}

            <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-10">
                {videos.filter(v => v.type !== 'short' || query).map((video) => (
                    <VideoCard key={video._id} video={video} />
                ))}
            </div>

            {videos.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 opacity-50">
                    <p className="text-xl">No videos found in this category.</p>
                </div>
            )}
        </div>
    );
};

export default Home;
