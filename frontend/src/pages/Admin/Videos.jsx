import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Trash2, Edit2, Plus, Filter, Search as SearchIcon, Eye, ThumbsUp } from 'lucide-react';

const Videos = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [channels, setChannels] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        thumbnailUrl: '',
        videoUrl: '',
        duration: '0:00',
        channel: '',
        category: '',
        tags: '',
        type: 'video',
        viewers: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [vidsRes, catsRes, chansRes] = await Promise.all([
                    api.getAdminVideos(),
                    api.getCategories(),
                    api.getChannels()
                ]);
                setVideos(vidsRes);
                setCategories(catsRes);
                setChannels(chansRes);
                if (chansRes.length > 0) setFormData(prev => ({ ...prev, channel: chansRes[0]._id }));
            } catch (err) {
                console.error('Admin Videos Load Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this video?')) return;
        try {
            await api.deleteVideo(id);
            setVideos(videos.filter(v => v._id !== id));
        } catch (err) {
            alert('Delete failed');
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!formData.channel) return alert('Error: You must select a Channel Actor first.');
        if (!formData.category) return alert('Error: Please select a Category for this asset.');
        try {
            const data = {
                ...formData,
                tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
            };
            const res = await api.createVideo(data);
            setVideos([res, ...videos]);
            setIsModalOpen(false);
            setFormData({
                title: '',
                description: '',
                thumbnailUrl: '',
                videoUrl: '',
                duration: '0:00',
                channel: channels[0]?._id || '',
                category: '',
                tags: '',
                type: 'video',
                viewers: 0
            });
        } catch (err) {
            console.error('Upload Error:', err);
            alert(`Upload failed: ${err.message}`);
        }
    };

    if (loading) return <div className="p-10 text-center opacity-50 font-mono tracking-widest text-yt-blue animate-pulse">SYNCHRONIZING REPOSITORY...</div>;

    return (
        <div className="p-4 lg:p-8 max-w-[1600px] mx-auto flex flex-col gap-6 animate-fade-in text-yt-text">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold tracking-tight">Content Inventory</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <p className="text-[10px] text-yt-text-secondary uppercase tracking-[0.2em]">Operational Status: Normal</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-yt-blue text-[#0f0f0f] px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-opacity-80 active:scale-95 transition-all text-sm shadow-lg shadow-yt-blue/20"
                >
                    <Plus size={18} />
                    INITIALIZE UPLOAD
                </button>
            </div>

            {/* Upload Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#000000cc] backdrop-blur-sm animate-fade-in">
                    <div className="bg-yt-bg-secondary w-full max-w-2xl rounded-2xl border border-yt-border shadow-2xl overflow-hidden flex flex-col animate-scale-in">
                        <div className="px-6 py-4 border-b border-yt-border flex justify-between items-center bg-yt-bg-elevated">
                            <h2 className="font-bold flex items-center gap-2">
                                <Plus size={18} className="text-yt-blue" />
                                CONTENT MANIFEST INITIALIZATION
                            </h2>
                            <div className="flex bg-yt-bg p-1 rounded-lg border border-yt-border mr-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: 'video' })}
                                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${formData.type === 'video' ? 'bg-yt-blue text-[#0f0f0f]' : 'text-yt-text-secondary hover:text-yt-text'}`}
                                >
                                    VIDEO
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: 'live' })}
                                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${formData.type === 'live' ? 'bg-yt-red text-white' : 'text-yt-text-secondary hover:text-yt-text'}`}
                                >
                                    LIVE
                                </button>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="hover:bg-yt-bg-hover p-1.5 rounded-lg transition-colors">
                                <Plus size={20} className="rotate-45" />
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {channels.length === 0 || categories.length === 0 ? (
                                <div className="col-span-2 bg-yt-red/10 border border-yt-red/20 p-4 rounded-xl flex flex-col gap-3">
                                    <div className="flex items-center gap-2 text-yt-red font-bold">
                                        <Plus size={18} className="rotate-45" />
                                        PREREQUISITES MISSING
                                    </div>
                                    <p className="text-xs text-yt-text-secondary">
                                        You need at least one **Channel** and one **Category** to upload content. The database is currently empty.
                                    </p>
                                    <div className="flex gap-2">
                                        <a href="/admin/channels" className="text-[10px] font-bold uppercase bg-yt-blue text-[#0f0f0f] px-3 py-1.5 rounded-md hover:bg-opacity-80 transition-all">Go Create Channel</a>
                                        <a href="/admin/categories" className="text-[10px] font-bold uppercase border border-yt-border px-3 py-1.5 rounded-md hover:bg-yt-bg-hover transition-all">Go Create Category</a>
                                    </div>
                                </div>
                            ) : null}

                            <div className="flex flex-col gap-1.5 col-span-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-yt-text-secondary">Title</label>
                                <input
                                    type="text"
                                    className="bg-yt-bg border border-yt-border p-3 rounded-xl outline-none focus:border-yt-blue transition-colors text-sm text-yt-text"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-yt-text-secondary">Channel Actor</label>
                                <select
                                    className="bg-yt-bg border border-yt-border p-3 rounded-xl outline-none focus:border-yt-blue transition-colors text-sm text-yt-text appearance-none"
                                    value={formData.channel}
                                    onChange={e => setFormData({ ...formData, channel: e.target.value })}
                                    required
                                >
                                    {channels.map(ch => <option key={ch._id} value={ch._id} className="bg-yt-bg">{ch.name}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-yt-text-secondary">Category</label>
                                <select
                                    className="bg-yt-bg border border-yt-border p-3 rounded-xl outline-none focus:border-yt-blue transition-colors text-sm text-yt-text appearance-none"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    required
                                    disabled={categories.length === 0}
                                >
                                    <option value="" className="bg-yt-bg">{categories.length === 0 ? "No Categories Available" : "Select Category"}</option>
                                    {categories.map(cat => <option key={cat._id} value={cat._id} className="bg-yt-bg">{cat.name}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-yt-text-secondary">Thumbnail URL</label>
                                <input
                                    type="url"
                                    className="bg-yt-bg border border-yt-border p-3 rounded-xl outline-none focus:border-yt-blue transition-colors text-sm text-yt-text"
                                    value={formData.thumbnailUrl}
                                    onChange={e => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-yt-text-secondary">
                                    {formData.type === 'live' ? 'Live Stream URL' : 'Video Asset URL'}
                                </label>
                                <input
                                    type="url"
                                    className="bg-yt-bg border border-yt-border p-3 rounded-xl outline-none focus:border-yt-blue transition-colors text-sm text-yt-text"
                                    value={formData.videoUrl}
                                    onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-yt-text-secondary">Temporal Duration</label>
                                <input
                                    type="text"
                                    className="bg-yt-bg border border-yt-border p-3 rounded-xl outline-none focus:border-yt-blue transition-colors text-sm text-yt-text"
                                    value={formData.duration}
                                    onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                    placeholder="0:00"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-yt-text-secondary">Tags (Comma Separated)</label>
                                <input
                                    type="text"
                                    className="bg-yt-bg border border-yt-border p-3 rounded-xl outline-none focus:border-yt-blue transition-colors text-sm text-yt-text"
                                    value={formData.tags}
                                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5 col-span-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-yt-text-secondary">Description Manifest</label>
                                <textarea
                                    className="bg-yt-bg border border-yt-border p-3 rounded-xl outline-none focus:border-yt-blue transition-colors text-sm text-yt-text h-24 resize-none"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="col-span-2 flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2.5 rounded-xl text-sm font-bold border border-yt-border hover:bg-yt-bg-hover transition-colors text-yt-text"
                                >
                                    ABORT
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-2.5 rounded-xl text-sm font-bold bg-yt-blue text-[#0f0f0f] hover:bg-opacity-80 transition-all shadow-lg shadow-yt-blue/20"
                                >
                                    EXECUTE UPLOAD
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex gap-4 p-1 bg-yt-bg-secondary rounded-xl border border-yt-border">
                <div className="flex-1 flex items-center gap-3 px-4">
                    <SearchIcon size={18} className="text-yt-text-secondary" />
                    <input
                        type="text"
                        placeholder="Filter by title, channel or tag..."
                        className="bg-transparent text-sm w-full py-2.5 outline-none text-yt-text"
                    />
                </div>
                <button className="p-2.5 hover:bg-yt-bg-hover rounded-lg transition-colors text-yt-text-secondary">
                    <Filter size={18} />
                </button>
            </div>

            <div className="bg-yt-bg-secondary rounded-xl border border-yt-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-yt-bg-elevated text-yt-text-secondary border-b border-yt-border">
                            <tr>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Video</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Channel</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Category</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Statistics</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Date Uploaded</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-yt-border">
                            {videos.map((v) => (
                                <tr key={v._id} className="hover:bg-yt-bg-hover group transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-24 aspect-video rounded-lg overflow-hidden flex-shrink-0 border border-yt-border">
                                                <img src={v.thumbnailUrl} className="w-full h-full object-cover" />
                                                <span className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-[8px] px-1 py-0.5 rounded text-white">{v.duration}</span>
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="font-bold truncate max-w-[200px] text-yt-text">{v.title}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-yt-text-secondary uppercase">{v.isPublished ? 'Public' : 'Hidden'}</span>
                                                    {v.type === 'live' && (
                                                        <span className="bg-yt-red text-white text-[8px] font-black px-1 rounded-sm animate-pulse">LIVE</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-yt-text">{v.channel?.name}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-yt-bg rounded-full px-2.5 py-1 text-[11px] font-medium border border-yt-border text-yt-text-secondary">
                                            {v.category?.name || 'Uncategorized'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1 text-[11px] font-mono">
                                            <span className="flex items-center gap-1.5 text-yt-blue"><Eye size={12} /> {v.views.toLocaleString()}</span>
                                            <span className="flex items-center gap-1.5 text-yt-red"><ThumbsUp size={12} /> {v.likes.toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-yt-text-secondary">
                                        {new Date(v.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 hover:bg-yt-bg border border-yt-border rounded-lg text-yt-blue transition-all active:scale-90">
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(v._id)}
                                                className="p-2 hover:bg-yt-red hover:bg-opacity-10 border border-yt-border rounded-lg text-yt-red transition-all active:scale-90"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Videos;
