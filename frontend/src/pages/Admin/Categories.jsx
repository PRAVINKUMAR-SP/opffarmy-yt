import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Plus, Trash2, Edit2, FolderPlus, Search as SearchIcon } from 'lucide-react';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [newName, setNewName] = useState('');
    const [newIcon, setNewIcon] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCats = async () => {
            try {
                const res = await api.getCategories();
                setCategories(res);
            } catch (err) {
                console.error('Admin Category Load Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCats();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newName.trim()) return;
        try {
            const res = await api.createCategory({ name: newName, icon: newIcon || '📁' });
            setCategories([...categories, res]);
            setNewName('');
            setNewIcon('');
        } catch (err) {
            alert('Fail to create category');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Remove this category?')) return;
        try {
            await api.deleteCategory(id);
            setCategories(categories.filter(c => c._id !== id));
        } catch (err) {
            alert('Fail to delete category');
        }
    };

    if (loading) return <div className="p-10 text-center opacity-50">Loading categories...</div>;

    return (
        <div className="p-4 lg:p-8 max-w-[1200px] mx-auto flex flex-col gap-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold italic tracking-tight">Category Architecture</h1>
                <p className="text-xs text-yt-text-secondary tracking-widest uppercase opacity-60">Manage content taxonomy</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-1">
                    <div className="bg-yt-bg-secondary p-6 rounded-2xl border border-yt-border shadow-xl h-fit">
                        <h3 className="font-bold flex items-center gap-2 mb-6 text-yt-blue">
                            <FolderPlus size={18} />
                            Add New Category
                        </h3>
                        <form onSubmit={handleCreate} className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-yt-text-secondary px-1">Display Name</label>
                                <input
                                    type="text"
                                    className="bg-yt-bg border border-yt-border p-3 rounded-xl focus:border-yt-blue outline-none transition-colors text-sm"
                                    placeholder="e.g. Science Fiction"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-yt-text-secondary px-1">Icon / Emoji</label>
                                <input
                                    type="text"
                                    className="bg-yt-bg border border-yt-border p-3 rounded-xl focus:border-yt-blue outline-none transition-colors text-sm"
                                    placeholder="e.g. 🚀"
                                    value={newIcon}
                                    onChange={(e) => setNewIcon(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                className="mt-2 bg-yt-blue text-[#0f0f0f] p-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-opacity-80 active:scale-95 transition-all text-sm"
                            >
                                <Plus size={18} />
                                Create Entity
                            </button>
                        </form>
                    </div>
                </div>

                {/* List */}
                <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {categories.map(cat => (
                            <div key={cat._id} className="bg-yt-bg-secondary p-4 rounded-2xl border border-yt-border flex items-center justify-between group hover:border-yt-blue transition-colors animate-fade-in shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-yt-bg rounded-xl flex items-center justify-center text-xl shadow-inner border border-yt-border group-hover:scale-110 transition-transform">
                                        {cat.icon}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm tracking-tight">{cat.name}</span>
                                        <span className="text-[10px] text-yt-text-secondary uppercase">Active Terminal</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 hover:bg-yt-bg border border-yt-border rounded-lg text-yt-blue transition-colors">
                                        <Edit2 size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cat._id)}
                                        className="p-2 hover:bg-yt-red hover:bg-opacity-10 border border-yt-border rounded-lg text-yt-red transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {categories.length === 0 && (
                            <div className="col-span-2 text-center py-20 bg-yt-bg-secondary rounded-2xl opacity-40 border border-dashed border-yt-border">
                                <p className="text-sm font-mono tracking-widest">NO ASSETS FOUND IN DIRECTORY</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Categories;
