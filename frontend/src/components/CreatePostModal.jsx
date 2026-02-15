import React, { useState } from 'react';
import { Send, Image as ImageIcon, Plus } from 'lucide-react';
import api from '../utils/api';
import { useUser } from '../context/UserContext';

const CreatePostModal = ({ isOpen, onClose, onSuccess }) => {
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        content: '',
        imageUrl: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user?.channelId) return alert('You must create a channel first!');

        setLoading(true);
        try {
            const res = await api.createPost({
                ...formData,
                channel: user.channelId,
                creator: user._id
            });
            onSuccess(res);
            onClose();
            setFormData({ content: '', imageUrl: '' });
        } catch (err) {
            alert(err.message || 'Post failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-80 backdrop-blur-sm animate-fade-in">
            <div className="bg-yt-bg-secondary w-full max-w-lg rounded-2xl border border-yt-border shadow-2xl animate-scale-in">
                <div className="px-6 py-4 border-b border-yt-border flex justify-between items-center">
                    <h2 className="font-bold flex items-center gap-2 uppercase tracking-widest text-sm">
                        <Send size={16} className="text-yt-red" />
                        Initiate Transmission
                    </h2>
                    <button onClick={onClose} className="hover:bg-yt-bg-hover p-1.5 rounded-lg transition-colors">
                        <Plus size={20} className="rotate-45" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-yt-text-secondary">Transmission Payload (Text)</label>
                        <textarea
                            required
                            className="bg-yt-bg border border-yt-border p-4 rounded-xl outline-none focus:border-yt-red transition-colors text-sm h-32 resize-none"
                            placeholder="Enter post content..."
                            value={formData.content}
                            onChange={e => setFormData({ ...formData, content: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-yt-text-secondary flex items-center gap-2">
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
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-yt-red text-white py-3.5 rounded-xl font-bold mt-2 hover:bg-opacity-90 transition-all active:scale-95 shadow-lg shadow-yt-red/20 disabled:opacity-50"
                    >
                        {loading ? 'BROADCASTING...' : 'BROADCAST POST'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreatePostModal;
