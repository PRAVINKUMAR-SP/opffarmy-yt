import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Trash2, Plus, MessageSquare, Image as ImageIcon, Send, Clock } from 'lucide-react';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [channels, setChannels] = useState([]);
    const [formData, setFormData] = useState({
        content: '',
        imageUrl: '',
        channel: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [postsRes, chansRes] = await Promise.all([
                    api.getPosts(),
                    api.getChannels()
                ]);
                setPosts(postsRes);
                setChannels(chansRes);
                if (chansRes.length > 0) setFormData(prev => ({ ...prev, channel: chansRes[0]._id }));
            } catch (err) {
                console.error('Admin Posts Load Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this community post?')) return;
        try {
            await api.deletePost(id);
            setPosts(posts.filter(p => p._id !== id));
        } catch (err) {
            alert('Delete failed');
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!formData.channel) {
            return alert('Critical Error: No Channel selected. Please create a channel first in the Channels tab.');
        }
        try {
            const res = await api.createPost(formData);
            setPosts([res, ...posts]);
            setIsModalOpen(false);
            setFormData({
                content: '',
                imageUrl: '',
                channel: channels[0]?._id || ''
            });
        } catch (err) {
            alert(`Post failed: ${err.message}`);
        }
    };

    if (loading) return <div className="p-10 text-center opacity-50 font-mono tracking-widest text-yt-blue animate-pulse">RECONSTRUCTING TIMELINE...</div>;

    return (
        <div className="p-4 lg:p-8 max-w-[1200px] mx-auto flex flex-col gap-6 animate-fade-in text-yt-text">
            <div className="flex justify-between items-center">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold tracking-tight">Community Transmission</h1>
                    <p className="text-[10px] text-yt-text-secondary uppercase tracking-[0.2em] mt-1">Status: Ready for broadcast</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-yt-red text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-opacity-80 active:scale-95 transition-all text-sm shadow-lg shadow-yt-red/20"
                >
                    <Send size={18} />
                    NEW TRANSMISSION
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post) => (
                    <div key={post._id} className="bg-yt-bg-secondary border border-yt-border rounded-2xl overflow-hidden hover:border-yt-text-secondary transition-all group">
                        <div className="p-4 border-b border-yt-border flex justify-between items-center bg-yt-bg-elevated">
                            <div className="flex items-center gap-3">
                                <img src={post.channel?.avatarUrl} className="w-8 h-8 rounded-full" />
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold">{post.channel?.name}</span>
                                    <span className="text-[10px] text-yt-text-secondary">{post.channel?.handle}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(post._id)}
                                className="p-2 hover:bg-yt-red hover:bg-opacity-10 text-yt-red rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <div className="p-5 flex flex-col gap-4">
                            <p className="text-sm leading-relaxed">{post.content}</p>
                            {post.imageUrl && (
                                <div className="rounded-xl overflow-hidden border border-yt-border aspect-video bg-yt-bg">
                                    <img src={post.imageUrl} className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="flex items-center gap-4 text-[11px] text-yt-text-secondary pt-2">
                                <span className="flex items-center gap-1.5"><MessageSquare size={14} /> {post.stats?.comments || 0} Comments</span>
                                <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date(post.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Post Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#000000cc] backdrop-blur-sm animate-fade-in">
                    <div className="bg-yt-bg-secondary w-full max-w-lg rounded-2xl border border-yt-border shadow-2xl animate-scale-in">
                        <div className="px-6 py-4 border-b border-yt-border flex justify-between items-center">
                            <h2 className="font-bold flex items-center gap-2 uppercase tracking-widest text-sm">
                                <Send size={16} className="text-yt-red" />
                                Initiate Transmission
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="hover:bg-yt-bg-hover p-1.5 rounded-lg transition-colors">
                                <Plus size={20} className="rotate-45" />
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="p-6 flex flex-col gap-5">
                            {channels.length === 0 ? (
                                <div className="bg-yt-red/10 border border-yt-red/20 p-4 rounded-xl flex flex-col gap-3">
                                    <div className="flex items-center gap-2 text-yt-red font-bold">
                                        <Plus size={18} className="rotate-45" />
                                        CHANNEL REQUIRED
                                    </div>
                                    <p className="text-xs text-yt-text-secondary">
                                        You need a **Channel** to broadcast community posts. Your registry is currently empty.
                                    </p>
                                    <a href="/admin/channels" className="text-[10px] font-bold uppercase bg-yt-red text-white px-3 py-1.5 rounded-md hover:bg-opacity-80 transition-all text-center">Create Your First Channel</a>
                                </div>
                            ) : null}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-yt-text-secondary">Broadcasting Channel</label>
                                <select
                                    className="bg-yt-bg border border-yt-border p-3 rounded-xl outline-none focus:border-yt-red transition-colors text-sm"
                                    value={formData.channel}
                                    onChange={e => setFormData({ ...formData, channel: e.target.value })}
                                >
                                    {channels.map(ch => <option key={ch._id} value={ch._id}>{ch.name}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-yt-text-secondary">Transmission Payload (Text)</label>
                                <textarea
                                    className="bg-yt-bg border border-yt-border p-4 rounded-xl outline-none focus:border-yt-red transition-colors text-sm h-32 resize-none"
                                    placeholder="Enter post content..."
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-yt-text-secondary text-flex items-center gap-2">
                                    <ImageIcon size={12} />
                                    Image Resource Link (Optional)
                                </label>
                                <input
                                    type="url"
                                    className="bg-yt-bg border border-yt-border p-3 rounded-xl outline-none focus:border-yt-red transition-colors text-sm"
                                    placeholder="https://..."
                                    value={formData.imageUrl}
                                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2.5 rounded-xl text-sm font-bold border border-yt-border hover:bg-yt-bg-hover transition-colors"
                                >
                                    ABORT
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-2.5 rounded-xl text-sm font-bold bg-yt-red text-white hover:bg-opacity-80 transition-all"
                                >
                                    BROADCAST
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Posts;
