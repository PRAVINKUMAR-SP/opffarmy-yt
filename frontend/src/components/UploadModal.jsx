import React, { useState, useEffect } from 'react';
import { Plus, Video, Radio } from 'lucide-react';
import api from '../utils/api';
import { useUser } from '../context/UserContext';

const UploadModal = ({ isOpen, onClose, onSuccess }) => {
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [videoFile, setVideoFile] = useState(null);
    const [thumbFile, setThumbFile] = useState(null);
    const [thumbPreview, setThumbPreview] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        thumbnailUrl: '',
        videoUrl: '',
        duration: '0:00',
        categories: [],
        tags: '',
        type: 'video'
    });

    useEffect(() => {
        if (isOpen) {
            api.getCategories().then(setCategories).catch(console.error);
            setStep(1);
            setVideoFile(null);
            setThumbFile(null);
            setThumbPreview('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const toggleCategory = (id) => {
        setFormData(prev => {
            const categories = prev.categories.includes(id)
                ? prev.categories.filter(c => c !== id)
                : [...prev.categories, id];
            return { ...prev, categories };
        });
    };

    const formatDuration = (seconds) => {
        if (!seconds) return '0:00';
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleVideoSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideoFile(file);

            // Auto-extract duration
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = function () {
                window.URL.revokeObjectURL(video.src);
                const duration = video.duration;
                setFormData(prev => ({
                    ...prev,
                    duration: formatDuration(duration),
                    title: prev.title || file.name.split('.').slice(0, -1).join('.')
                }));
            }
            video.src = URL.createObjectURL(file);

            setStep(2);
        }
    };

    const handleThumbChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setThumbPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user?.channelId) return alert('You must create a channel first!');
        if (formData.type === 'video' && !videoFile) return alert('Please select a video file');

        setLoading(true);
        try {
            let finalVideoUrl = formData.videoUrl;
            let finalThumbUrl = formData.thumbnailUrl;

            // 1. Upload Video if provided (and not live)
            if (formData.type === 'video' && videoFile) {
                const vRes = await api.uploadFile(videoFile);
                finalVideoUrl = vRes.url;
            }

            // 2. Upload Thumbnail if provided
            if (thumbFile) {
                const tRes = await api.uploadFile(thumbFile);
                finalThumbUrl = tRes.url;
            }

            const data = {
                ...formData,
                videoUrl: finalVideoUrl,
                thumbnailUrl: finalThumbUrl,
                channel: user.channelId,
                creator: user._id,
                tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
            };

            const res = await api.createVideo(data);
            onSuccess(res);
            onClose();
        } catch (err) {
            alert(err.message || 'Upload failed');
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-80 backdrop-blur-sm animate-fade-in">
            <div className={`bg-yt-bg-secondary w-full rounded-2xl border border-yt-border shadow-2xl overflow-hidden flex flex-col animate-scale-in transition-all duration-300 ${step === 1 ? 'max-w-md' : 'max-w-2xl'}`}>
                <div className="px-6 py-4 border-b border-yt-border flex justify-between items-center bg-yt-bg-elevated">
                    <h2 className="font-bold flex items-center gap-2">
                        {step === 2 && (
                            <button onClick={() => setStep(1)} className="p-1 hover:bg-yt-bg-hover rounded-full transition-colors mr-1">
                                <Plus size={18} className="rotate-180" />
                            </button>
                        )}
                        <Video size={18} className="text-yt-blue" />
                        {formData.type === 'video' ? 'UPLOAD VIDEO' : 'START LIVE STREAM'}
                    </h2>
                    <div className="flex bg-yt-bg p-1 rounded-lg border border-yt-border mr-4 ml-auto">
                        <button
                            type="button"
                            onClick={() => {
                                setFormData({ ...formData, type: 'video' });
                                setStep(1);
                            }}
                            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${formData.type === 'video' ? 'bg-yt-blue text-[#0f0f0f]' : 'text-yt-text-secondary hover:text-yt-text'}`}
                        >
                            VIDEO
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setFormData({ ...formData, type: 'live' });
                                setStep(2);
                            }}
                            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${formData.type === 'live' ? 'bg-yt-red text-white' : 'text-yt-text-secondary hover:text-yt-text'}`}
                        >
                            LIVE
                        </button>
                    </div>
                    <button onClick={onClose} className="hover:bg-yt-bg-hover p-1.5 rounded-lg transition-colors ml-2">
                        <Plus size={20} className="rotate-45" />
                    </button>
                </div>

                {step === 1 ? (
                    <div className="p-12 flex flex-col items-center justify-center gap-6">
                        <div className="w-24 h-24 bg-yt-bg-secondary border-2 border-dashed border-yt-border rounded-full flex items-center justify-center group cursor-pointer hover:border-yt-blue transition-colors overflow-hidden relative">
                            <input
                                type="file"
                                accept="video/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleVideoSelect}
                            />
                            <Video size={40} className="text-yt-text-secondary group-hover:text-yt-blue transition-colors" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-bold mb-1">Select video files to upload</h3>
                            <p className="text-xs text-yt-text-secondary">Your videos will be private until you publish them.</p>
                        </div>
                        <label className="bg-yt-blue text-[#0f0f0f] px-6 py-2.5 rounded-full font-bold text-sm cursor-pointer hover:bg-opacity-90 active:scale-95 transition-all">
                            SELECT FILES
                            <input
                                type="file"
                                accept="video/*"
                                className="hidden"
                                onChange={handleVideoSelect}
                            />
                        </label>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto">
                        <div className="flex flex-col gap-1.5 col-span-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-yt-text-secondary">Title</label>
                            <input
                                type="text"
                                required
                                className="bg-yt-bg border border-yt-border p-3 rounded-xl outline-none focus:border-yt-blue transition-colors text-sm"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5 col-span-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-yt-text-secondary">Description</label>
                            <textarea
                                className="bg-yt-bg border border-yt-border p-3 rounded-xl outline-none focus:border-yt-blue transition-colors text-sm h-24 resize-none"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="flex flex-col gap-2 col-span-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-yt-text-secondary">Select Categories (Select multiple)</label>
                            <div className="flex flex-wrap gap-2 py-1">
                                {categories.map(cat => (
                                    <button
                                        key={cat._id}
                                        type="button"
                                        onClick={() => toggleCategory(cat._id)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${formData.categories.includes(cat._id)
                                            ? 'bg-yt-blue text-[#0f0f0f] border-yt-blue'
                                            : 'bg-yt-bg border-yt-border text-yt-text-secondary hover:border-yt-text'
                                            }`}
                                    >
                                        {cat.icon} {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-yt-text-secondary">Duration (e.g. 10:30)</label>
                            <input
                                type="text"
                                className="bg-yt-bg border border-yt-border p-3 rounded-xl outline-none focus:border-yt-blue transition-colors text-sm"
                                value={formData.duration}
                                onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                placeholder="0:00"
                            />
                        </div>

                        {formData.type === 'video' ? (
                            <div className="flex flex-col gap-1.5 col-span-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-yt-text-secondary">Selected Video</label>
                                <div className="flex items-center gap-3 bg-yt-bg border border-yt-border p-2.5 rounded-xl">
                                    <Video size={18} className="text-yt-blue" />
                                    <span className="text-xs text-yt-text truncate font-medium">
                                        {videoFile ? videoFile.name : 'No file selected'}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-yt-text-secondary">Stream URL (Optional)</label>
                                <input
                                    type="url"
                                    className="bg-yt-bg border border-yt-border p-3 rounded-xl outline-none focus:border-yt-blue transition-colors text-sm"
                                    value={formData.videoUrl}
                                    onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                                />
                            </div>
                        )}

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-yt-text-secondary">Thumbnail</label>
                            <div className="relative group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    id="thumb-upload"
                                    onChange={handleThumbChange}
                                />
                                <label
                                    htmlFor="thumb-upload"
                                    className="flex items-center gap-3 border-2 border-dashed border-yt-border rounded-xl p-2 cursor-pointer hover:border-yt-blue transition-colors"
                                >
                                    <div className="w-16 h-10 bg-yt-bg rounded overflow-hidden flex items-center justify-center border border-yt-border">
                                        {thumbPreview ? (
                                            <img src={thumbPreview} className="w-full h-full object-cover" />
                                        ) : (
                                            <Plus size={16} className="text-yt-text-secondary" />
                                        )}
                                    </div>
                                    <span className="text-xs text-yt-text-secondary truncate">
                                        {thumbFile ? thumbFile.name : 'Upload JPG/PNG'}
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5 col-span-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-yt-text-secondary">Tags (Comma separated)</label>
                            <input
                                type="text"
                                className="bg-yt-bg border border-yt-border p-3 rounded-xl outline-none focus:border-yt-blue transition-colors text-sm"
                                value={formData.tags}
                                onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                placeholder="gaming, tutorial, vlogs..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`col-span-2 py-3.5 rounded-xl font-bold mt-2 transition-all active:scale-95 shadow-lg ${formData.type === 'video' ? 'bg-yt-blue text-[#0f0f0f] shadow-yt-blue/20' : 'bg-yt-red text-white shadow-yt-red/20'} disabled:opacity-50`}
                        >
                            {loading ? 'UPLOADING...' : (formData.type === 'video' ? 'EXECUTE UPLOAD' : 'INITIALIZE LIVE')}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default UploadModal;
