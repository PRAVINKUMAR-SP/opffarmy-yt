import React, { useState } from 'react';
import { Shield, Plus } from 'lucide-react';
import api from '../utils/api';
import { useUser } from '../context/UserContext';

const CreateChannelModal = ({ isOpen, onClose, onSuccess }) => {
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [logoFile, setLogoFile] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        handle: '',
        description: '',
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=008cff&color=fff&size=128&bold=true`
    });

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            // Create a local preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, avatarUrl: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let finalAvatarUrl = formData.avatarUrl;

            // 1. Upload file if selected
            if (logoFile) {
                const uploadRes = await api.uploadFile(logoFile);
                // Prepend base URL if needed, but relative should work if served statically
                finalAvatarUrl = uploadRes.url;
            }

            // 2. Create Channel
            const res = await api.createChannel({
                ...formData,
                avatarUrl: finalAvatarUrl,
                owner: user._id
            });
            onSuccess(res);
            onClose();
        } catch (err) {
            alert(err.message || 'Failed to create channel');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-80 backdrop-blur-sm animate-fade-in">
            <div className="bg-yt-bg-secondary w-full max-w-md rounded-2xl border border-yt-border shadow-2xl animate-scale-in">
                <div className="px-6 py-4 border-b border-yt-border flex justify-between items-center">
                    <h2 className="font-bold flex items-center gap-2 uppercase tracking-widest text-sm">
                        <Plus size={16} className="text-yt-blue" />
                        Create Your Channel
                    </h2>
                    <button onClick={onClose} className="hover:bg-yt-bg-hover p-1.5 rounded-lg transition-colors">
                        <Plus size={20} className="rotate-45" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
                    <div className="flex flex-col items-center gap-4 mb-2">
                        <label className="relative cursor-pointer group">
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-yt-blue p-1 bg-yt-bg transition-all group-hover:scale-105 group-hover:border-yt-red shadow-xl">
                                <img src={formData.avatarUrl} className="w-full h-full rounded-full object-cover" />
                                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Plus size={24} className="text-white" />
                                </div>
                            </div>
                        </label>
                        <p className="text-[10px] text-yt-text-secondary uppercase tracking-widest text-center font-bold">Click Logo to Upload</p>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-yt-text-secondary">Channel Name</label>
                        <input
                            type="text"
                            required
                            className="bg-yt-bg border border-yt-border p-3 rounded-xl outline-none focus:border-yt-blue transition-colors text-sm"
                            placeholder="e.g. My Awesome Channel"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-yt-text-secondary">Handle (@name)</label>
                        <input
                            type="text"
                            required
                            className="bg-yt-bg border border-yt-border p-3 rounded-xl outline-none focus:border-yt-blue transition-colors text-sm"
                            placeholder="e.g. awesome_creator"
                            value={formData.handle}
                            onChange={e => {
                                let val = e.target.value.toLowerCase().replace(/\s+/g, '_');
                                if (val && !val.startsWith('@')) val = '@' + val;
                                setFormData({ ...formData, handle: val });
                            }}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-yt-text-secondary">Description</label>
                        <textarea
                            className="bg-yt-bg border border-yt-border p-3 rounded-xl outline-none focus:border-yt-blue transition-colors text-sm h-20 resize-none"
                            placeholder="Tell viewers about your channel..."
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-yt-blue text-[#0f0f0f] py-3.5 rounded-xl font-bold mt-2 hover:bg-opacity-90 transition-all active:scale-95 shadow-lg shadow-yt-blue/20 disabled:opacity-50"
                    >
                        {loading ? 'CREATING...' : 'CREATE CHANNEL'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateChannelModal;
