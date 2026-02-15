import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Users, Video, MessageSquare, List, Eye, ThumbsUp } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-yt-bg-secondary p-6 rounded-xl border border-yt-border flex items-center gap-4 animate-fade-in shadow-sm">
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
            <Icon size={24} className={color.replace('bg-', 'text-')} />
        </div>
        <div>
            <p className="text-sm text-yt-text-secondary">{label}</p>
            <p className="text-2xl font-bold">{value.toLocaleString()}</p>
        </div>
    </div>
);

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.getAdminStats();
                setData(res);
            } catch (err) {
                console.error('Admin Stats Load Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-10 text-center opacity-50">Loading admin data...</div>;

    const { stats, recentVideos, recentComments, recentPosts, topChannels } = data;

    return (
        <div className="p-4 lg:p-8 max-w-[1600px] mx-auto flex flex-col gap-8">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <StatCard icon={Video} label="Total Videos" value={stats.totalVideos} color="bg-yt-blue" />
                <StatCard icon={Users} label="Channels" value={stats.totalChannels} color="bg-yt-red" />
                <StatCard icon={MessageSquare} label="Posts" value={stats.totalPosts} color="bg-teal-500" />
                <StatCard icon={List} label="Categories" value={stats.totalCategories} color="bg-yellow-500" />
                <StatCard icon={Eye} label="Total Views" value={stats.totalViews} color="bg-purple-500" />
                <StatCard icon={ThumbsUp} label="Total Likes" value={stats.totalLikes} color="bg-blue-600" />
                <StatCard icon={Users} label="Total Users" value={stats.totalUsers} color="bg-cyan-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
                {/* Recent Videos */}
                <div className="bg-yt-bg-secondary rounded-xl border border-yt-border overflow-hidden">
                    <div className="px-6 py-4 border-b border-yt-border flex justify-between items-center bg-yt-bg-elevated">
                        <h2 className="font-bold">Recent Uploads</h2>
                        <button className="text-xs text-yt-blue hover:underline">View All</button>
                    </div>
                    <div className="p-2">
                        <table className="w-full text-left text-sm">
                            <thead className="text-yt-text-secondary border-b border-yt-border">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Video Title</th>
                                    <th className="px-4 py-3 font-medium">Channel</th>
                                    <th className="px-4 py-3 font-medium">Views</th>
                                    <th className="px-4 py-3 font-medium text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-yt-border">
                                {recentVideos.map(v => (
                                    <tr key={v._id} className="hover:bg-yt-bg-hover transition-colors">
                                        <td className="px-4 py-3 truncate max-w-[200px] font-medium">{v.title}</td>
                                        <td className="px-4 py-3">{v.channel?.name}</td>
                                        <td className="px-4 py-3">{v.views.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right">
                                            <span className="bg-green-500 bg-opacity-10 text-green-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Public</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Channels */}
                <div className="bg-yt-bg-secondary rounded-xl border border-yt-border overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-yt-border flex justify-between items-center bg-yt-bg-elevated">
                        <h2 className="font-bold">Top Channels</h2>
                        <button className="text-xs text-yt-blue hover:underline">Manage</button>
                    </div>
                    <div className="p-4 flex flex-col gap-4">
                        {topChannels.map(ch => (
                            <div key={ch._id} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <img src={ch.avatarUrl} className="w-10 h-10 rounded-full border border-yt-border" />
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm">{ch.name}</span>
                                        <span className="text-xs text-yt-text-secondary">{ch.handle}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold">{(ch.subscribers / 1000000).toFixed(1)}M</p>
                                    <p className="text-[10px] text-yt-text-secondary uppercase">Subs</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-yt-bg-secondary rounded-xl border border-yt-border overflow-hidden">
                <div className="px-6 py-4 border-b border-yt-border flex justify-between items-center bg-yt-bg-elevated">
                    <h2 className="font-bold">Recent Community Posts</h2>
                    <button className="text-xs text-yt-blue hover:underline">View All</button>
                </div>
                <div className="p-2">
                    <table className="w-full text-left text-sm">
                        <thead className="text-yt-text-secondary border-b border-yt-border">
                            <tr>
                                <th className="px-4 py-3 font-medium">Content Snippet</th>
                                <th className="px-4 py-3 font-medium">Channel</th>
                                <th className="px-4 py-3 font-medium text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-yt-border">
                            {recentPosts && recentPosts.map(p => (
                                <tr key={p._id} className="hover:bg-yt-bg-hover transition-colors">
                                    <td className="px-4 py-3 truncate max-w-[300px]">{p.content}</td>
                                    <td className="px-4 py-3">{p.channel?.name}</td>
                                    <td className="px-4 py-3 text-right text-yt-text-secondary">{new Date(p.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Comments */}
            <div className="bg-yt-bg-secondary rounded-xl border border-yt-border overflow-hidden">
                <div className="px-6 py-4 border-b border-yt-border flex justify-between items-center bg-yt-bg-elevated">
                    <h2 className="font-bold">Recent Comments</h2>
                    <button className="text-xs text-yt-blue hover:underline">Moderate</button>
                </div>
                <div className="divide-y divide-yt-border">
                    {recentComments.map(c => (
                        <div key={c._id} className="p-4 flex gap-4 hover:bg-yt-bg-hover transition-colors">
                            <img src={c.avatarUrl} className="w-8 h-8 rounded-full" />
                            <div className="flex flex-col gap-1 w-full">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold">{c.username}</span>
                                    <span className="text-[10px] text-yt-text-secondary uppercase">{new Date(c.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm line-clamp-1 opacity-80 italic">"{c.text}"</p>
                                <p className="text-[10px] text-yt-blue">on: {c.video?.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
