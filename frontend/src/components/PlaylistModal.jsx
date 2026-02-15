import React, { useState, useEffect } from 'react';
import { X, Plus, Lock, Globe, ListMusic } from 'lucide-react';
import api from '../utils/api';
import { useUser } from '../context/UserContext';

const PlaylistModal = ({ isOpen, onClose, videoId }) => {
    const { user } = useUser();
    const [playlists, setPlaylists] = useState([]);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [privacy, setPrivacy] = useState('public');
    const [showCreate, setShowCreate] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && user) {
            fetchPlaylists();
        }
    }, [isOpen, user]);

    const fetchPlaylists = async () => {
        try {
            const data = await api.getUserPlaylists(user._id);
            setPlaylists(data);
        } catch (err) {
            console.error('Fetch playlists error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePlaylist = async (playlist) => {
        const isAdded = playlist.videos.some(v => v._id === videoId || v === videoId);
        try {
            if (isAdded) {
                await api.removeVideoFromPlaylist(playlist._id, videoId);
            } else {
                await api.addVideoToPlaylist(playlist._id, videoId);
            }
            fetchPlaylists(); // Refresh state
        } catch (err) {
            alert(err.message);
        }
    };

    const handleCreatePlaylist = async () => {
        if (!newPlaylistName.trim()) return;
        try {
            await api.createPlaylist({
                title: newPlaylistName,
                privacy,
                videoId
            });
            setNewPlaylistName('');
            setShowCreate(false);
            fetchPlaylists();
        } catch (err) {
            alert(err.message);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-yt-text">
            <div className="bg-yt-bg-secondary w-full max-w-sm rounded-2xl shadow-2xl border border-yt-border overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-yt-border">
                    <h3 className="font-bold">Save video to...</h3>
                    <button onClick={onClose} className="p-1 hover:bg-yt-bg-hover rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-2 max-h-60 overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <p className="text-center py-4 text-yt-text-secondary text-sm">Loading...</p>
                    ) : playlists.length > 0 ? (
                        playlists.map(p => {
                            const isAdded = p.videos.some(v => v._id === videoId || v === videoId);
                            return (
                                <label key={p._id} className="flex items-center gap-3 p-3 hover:bg-yt-bg-hover rounded-xl cursor-pointer transition-colors group">
                                    <input
                                        type="checkbox"
                                        checked={isAdded}
                                        onChange={() => handleTogglePlaylist(p)}
                                        className="w-4 h-4 accent-yt-blue rounded"
                                    />
                                    <span className="flex-1 text-sm font-medium">{p.title}</span>
                                    {p.privacy === 'private' ? <Lock size={14} className="text-yt-text-secondary" /> : <Globe size={14} className="text-yt-text-secondary" />}
                                </label>
                            );
                        })
                    ) : (
                        <p className="text-center py-4 text-yt-text-secondary text-sm px-4">You haven't created any playlists yet.</p>
                    )}
                </div>

                <div className="p-4 border-t border-yt-border">
                    {!showCreate ? (
                        <button
                            onClick={() => setShowCreate(true)}
                            className="flex items-center gap-3 w-full p-2 hover:bg-yt-bg-hover rounded-xl text-sm font-bold transition-all"
                        >
                            <Plus size={20} />
                            <span>Create new playlist</span>
                        </button>
                    ) : (
                        <div className="flex flex-col gap-4 animate-slide-up">
                            <div>
                                <label className="text-[12px] font-bold text-yt-text-secondary uppercase mb-1 block">Name</label>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Enter playlist name..."
                                    value={newPlaylistName}
                                    onChange={(e) => setNewPlaylistName(e.target.value)}
                                    className="w-full bg-yt-bg border-b border-yt-border focus:border-yt-blue outline-none py-2 text-sm px-1 transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-[12px] font-bold text-yt-text-secondary uppercase mb-1 block">Privacy</label>
                                <select
                                    value={privacy}
                                    onChange={(e) => setPrivacy(e.target.value)}
                                    className="w-full bg-yt-bg-secondary border border-yt-border rounded-lg p-2 text-sm outline-none cursor-pointer hover:bg-yt-bg-hover"
                                >
                                    <option value="public">Public</option>
                                    <option value="private">Private</option>
                                    <option value="unlisted">Unlisted</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 mt-2">
                                <button
                                    onClick={() => setShowCreate(false)}
                                    className="text-sm font-bold px-4 py-2 hover:bg-yt-bg-hover rounded-full transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={!newPlaylistName.trim()}
                                    onClick={handleCreatePlaylist}
                                    className="text-sm font-bold text-yt-blue px-4 py-2 hover:bg-yt-blue/10 rounded-full transition-colors disabled:opacity-50"
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlaylistModal;
