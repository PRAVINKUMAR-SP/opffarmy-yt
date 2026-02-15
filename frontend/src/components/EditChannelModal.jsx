import React, { useState, useEffect } from 'react';
import { Camera, X, Check, Upload } from 'lucide-react';
import api from '../utils/api';
import { useUser } from '../context/UserContext';

const EditChannelModal = ({ channel, isOpen, onClose, onUpdate }) => {
    const { setUser } = useUser(); // To update local user context if avatar changes
    const [formData, setFormData] = useState({
        name: '',
        handle: '',
        description: '',
        avatarUrl: '',
        bannerUrl: ''
    });
    const [loading, setLoading] = useState(false);
    const [avatarFile, setAvatarFile] = useState(null);
    const [bannerFile, setBannerFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [bannerPreview, setBannerPreview] = useState('');

    useEffect(() => {
        if (channel && isOpen) {
            setFormData({
                name: channel.name || '',
                handle: channel.handle || '',
                description: channel.description || '',
                avatarUrl: channel.avatarUrl || '',
                bannerUrl: channel.bannerUrl || ''
            });
            setAvatarPreview(channel.avatarUrl || '');
            setBannerPreview(channel.bannerUrl || '');
            setAvatarFile(null);
            setBannerFile(null);
        }
    }, [channel, isOpen]);

    if (!isOpen) return null;

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === 'avatar') {
                    setAvatarFile(file);
                    setAvatarPreview(reader.result);
                } else {
                    setBannerFile(file);
                    setBannerPreview(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let finalAvatarUrl = formData.avatarUrl;
            let finalBannerUrl = formData.bannerUrl;

            // Upload Avatar if changed
            if (avatarFile) {
                const res = await api.uploadFile(avatarFile);
                finalAvatarUrl = res.url;
            }

            // Upload Banner if changed
            if (bannerFile) {
                const res = await api.uploadFile(bannerFile);
                finalBannerUrl = res.url;
            }

            const updateData = {
                ...formData,
                avatarUrl: finalAvatarUrl,
                bannerUrl: finalBannerUrl
            };

            const updatedChannel = await api.updateChannel(channel._id, updateData);

            // If avatar changed, update local user context to reflect change immediately
            if (finalAvatarUrl !== channel.avatarUrl) {
                const storedUser = JSON.parse(localStorage.getItem('yt_user') || '{}');
                const updatedUser = { ...storedUser, avatar: finalAvatarUrl };
                localStorage.setItem('yt_user', JSON.stringify(updatedUser));
                setUser(updatedUser);
            }

            onUpdate(updatedChannel);
            onClose();
        } catch (err) {
            alert(err.message || 'Failed to update channel');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-80 backdrop-blur-sm animate-fade-in">
            <div className="bg-yt-bg-secondary w-full max-w-2xl rounded-2xl border border-yt-border shadow-2xl overflow-hidden flex flex-col animate-scale-in max-h-[90vh]">
                <div className="px-6 py-4 border-b border-yt-border flex justify-between items-center bg-yt-bg-elevated">
                    <h2 className="font-bold text-xl">Customize Channel</h2>
                    <button onClick={onClose} className="hover:bg-yt-bg-hover p-2 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
                    {/* Branding Section */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-yt-text-secondary uppercase tracking-wider">Branding</h3>

                        {/* Banner Upload */}
                        <div className="relative w-full h-32 bg-yt-bg rounded-xl overflow-hidden group border border-dashed border-yt-border hover:border-yt-blue transition-colors">
                            <img src={bannerPreview || 'https://via.placeholder.com/800x200'} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <label className="cursor-pointer flex flex-col items-center gap-2 p-4 bg-black/50 rounded-xl hover:bg-black/70 transition-colors">
                                    <Camera size={24} className="text-white" />
                                    <span className="text-xs font-bold text-white">CHANGE BANNER</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'banner')} />
                                </label>
                            </div>
                        </div>

                        {/* Avatar Upload */}
                        <div className="flex items-center gap-6">
                            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-yt-bg shadow-md group">
                                <img src={avatarPreview} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <label className="cursor-pointer w-full h-full flex items-center justify-center">
                                        <Camera size={24} className="text-white" />
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'avatar')} />
                                    </label>
                                </div>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold">Profile Picture</p>
                                <p className="text-xs text-yt-text-secondary mt-1">
                                    This will also update your YouTube profile picture and will be visible across the platform.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="space-y-4 pt-4 border-t border-yt-border">
                        <h3 className="text-sm font-bold text-yt-text-secondary uppercase tracking-wider">Basic Info</h3>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-yt-text-secondary">Name</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-yt-bg border border-yt-border p-3 rounded-lg outline-none focus:border-yt-blue transition-colors"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-yt-text-secondary">Handle</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-yt-bg border border-yt-border p-3 rounded-lg outline-none focus:border-yt-blue transition-colors"
                                value={formData.handle}
                                onChange={e => setFormData({ ...formData, handle: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-yt-text-secondary">Description</label>
                            <textarea
                                className="w-full bg-yt-bg border border-yt-border p-3 rounded-lg outline-none focus:border-yt-blue transition-colors min-h-[100px] resize-none"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Tell viewers about your channel..."
                            />
                        </div>
                    </div>
                </form>

                <div className="p-4 border-t border-yt-border flex justify-end gap-3 bg-yt-bg-elevated">
                    <button onClick={onClose} className="px-4 py-2 rounded-full font-bold hover:bg-yt-bg-hover transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2 bg-yt-blue text-[#0f0f0f] rounded-full font-bold hover:bg-opacity-90 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditChannelModal;
