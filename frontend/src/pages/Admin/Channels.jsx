import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Trash2, Plus, User, CheckCircle2, Globe } from 'lucide-react';

const Channels = () => {
    const [channels, setChannels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        handle: '',
        avatarUrl: '',
        description: '',
        isVerified: false
    });

    useEffect(() => {
        const fetchChannels = async () => {
            try {
                const res = await api.getChannels();
                setChannels(res);
            } catch (err) {
                console.error('Admin Channels Load Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchChannels();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('WARNING: Deleting this channel will also delete ALL its videos. Proceed?')) return;
        try {
            await api.deleteChannel(id);
            setChannels(channels.filter(ch => ch._id !== id));
        } catch (err) {
            alert(err.message || 'Delete failed');
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await api.createChannel(formData);
            setChannels([res, ...channels]);
            setIsModalOpen(false);
            setFormData({ name: '', handle: '', avatarUrl: '', description: '', isVerified: false });
        } catch (err) {
            alert(err.message || 'Creation failed');
        }
    };

    if (loading) return <div className="p-10 text-center opacity-50 font-mono tracking-widest text-yt-blue animate-pulse">SYNCHRONIZING ASSETS...</div>;

    return (
        <div className="p-4 lg:p-8 max-w-[1400px] mx-auto flex flex-col gap-6 animate-fade-in text-yt-text">
            <div className="flex justify-between items-center">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold tracking-tight">Channel Directory</h1>
                    <p className="text-[10px] text-yt-text-secondary uppercase tracking-[0.2em] mt-1">Registry: Active</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-yt-blue text-[#0f0f0f] px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-opacity-80 active:scale-95 transition-all text-sm shadow-lg shadow-yt-blue/20"
                >
                    <Plus size={18} />
                    REGISTER CHANNEL
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {channels.map((ch) => (
                    <div key={ch._id} className="bg-yt-bg-secondary border border-yt-border rounded-2xl overflow-hidden hover:border-yt-blue transition-all group">
                        <div className="p-6 flex flex-col items-center text-center gap-4">
                            <div className="relative">
                                <img src={ch.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${ch.name}`} className="w-20 h-20 rounded-full border-2 border-yt-border object-cover" />
                                {ch.isVerified && <div className="absolute -bottom-1 -right-1 bg-yt-blue p-1 rounded-full"><CheckCircle2 size={12} color="black" fill="black" /></div>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <h3 className="font-bold text-lg">{ch.name}</h3>
                                <span className="text-sm text-yt-text-secondary">{ch.handle}</span>
                            </div>
                            <p className="text-xs line-clamp-2 opacity-60 px-2">{ch.description || 'No description provided.'}</p>
                            <div className="flex w-full gap-2 mt-4 pt-4 border-t border-yt-border">
                                <button className="flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider border border-yt-border rounded-lg hover:bg-yt-bg-hover transition-colors">Edit</button>
                                <button
                                    onClick={() => handleDelete(ch._id)}
                                    className="p-1.5 text-yt-red border border-yt-border rounded-lg hover:bg-yt-red hover:bg-opacity-10 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#000000cc] backdrop-blur-sm animate-fade-in">
                    <div className="bg-yt-bg-secondary w-full max-w-lg rounded-2xl border border-yt-border shadow-2xl animate-scale-in">
                        <div className="px-6 py-4 border-b border-yt-border flex justify-between items-center bg-yt-bg-elevated">
                            <h2 className="font-bold flex items-center gap-2 uppercase tracking-widest text-sm text-yt-blue">
                                <Plus size={18} />
                                Initialize Registry
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="hover:bg-yt-bg-hover p-1.5 rounded-lg transition-colors">
                                <Plus size={20} className="rotate-45" />
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="p-6 flex flex-col gap-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-yt-text-secondary">Name</label>
                                    <input
                                        type="text"
                                        className="bg-yt-bg border border-yt-border p-3 rounded-xl outline-none focus:border-yt-blue text-sm"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-yt-text-secondary">Handle</label>
                                    <input
                                        type="text"
                                        className="bg-yt-bg border border-yt-border p-3 rounded-xl outline-none focus:border-yt-blue text-sm"
                                        value={formData.handle}
                                        onChange={e => setFormData({ ...formData, handle: e.target.value })}
                                        placeholder="@example"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-yt-text-secondary">Avatar URL</label>
                                <input
                                    type="url"
                                    className="bg-yt-bg border border-yt-border p-3 rounded-xl outline-none focus:border-yt-blue text-sm"
                                    value={formData.avatarUrl}
                                    onChange={e => setFormData({ ...formData, avatarUrl: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-yt-text-secondary">Bio Manifest</label>
                                <textarea
                                    className="bg-yt-bg border border-yt-border p-3 rounded-xl outline-none focus:border-yt-blue text-sm h-24 resize-none"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isVerified"
                                    checked={formData.isVerified}
                                    onChange={e => setFormData({ ...formData, isVerified: e.target.checked })}
                                    className="w-4 h-4 accent-yt-blue"
                                />
                                <label htmlFor="isVerified" className="text-xs font-bold uppercase tracking-widest text-yt-text-secondary cursor-pointer">Verified Status</label>
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl text-sm font-bold border border-yt-border hover:bg-yt-bg-hover transition-colors">ABORT</button>
                                <button type="submit" className="px-8 py-2.5 rounded-xl text-sm font-bold bg-yt-blue text-[#0f0f0f] hover:bg-opacity-80 transition-all shadow-lg shadow-yt-blue/20">COMMIT</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Channels;
