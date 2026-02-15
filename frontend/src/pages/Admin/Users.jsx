import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { User, Mail, Shield, Key, Calendar } from 'lucide-react';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.getAdminUsers();
                setUsers(res);
            } catch (err) {
                console.error('Fetch users error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) return <div className="p-10 text-center opacity-50 font-mono tracking-widest text-yt-blue animate-pulse">RETRIVING USER DATABASE...</div>;

    return (
        <div className="p-4 lg:p-8 max-w-[1400px] mx-auto flex flex-col gap-6 animate-fade-in text-yt-text">
            <div className="flex flex-col">
                <h1 className="text-2xl font-bold tracking-tight">User Directory</h1>
                <p className="text-[10px] text-yt-text-secondary uppercase tracking-[0.2em] mt-1">Status: Operational</p>
            </div>

            <div className="bg-yt-bg-secondary border border-yt-border rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-yt-border bg-yt-bg-elevated">
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-yt-text-secondary">User</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-yt-text-secondary">Email</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-yt-text-secondary">Role</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-yt-text-secondary">Password (Verification)</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-yt-text-secondary">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-yt-border">
                            {users.map((u) => (
                                <tr key={u._id} className="hover:bg-white hover:bg-opacity-[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={u.avatar} className="w-8 h-8 rounded-full border border-yt-border" />
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm">{u.name}</span>
                                                <span className="text-xs text-yt-text-secondary">{u.handle}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-xs opacity-80">
                                            <Mail size={14} className="text-yt-blue" />
                                            {u.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${u.role === 'admin' ? 'bg-yt-red bg-opacity-10 text-yt-red border border-yt-red border-opacity-20' : 'bg-yt-blue bg-opacity-10 text-yt-blue border border-yt-blue border-opacity-20'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 font-mono text-xs text-yt-text-secondary italic bg-black bg-opacity-20 p-2 rounded border border-yt-border group-hover:text-yt-text transition-colors">
                                            <Key size={14} className="opacity-50" />
                                            {u.password}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-xs opacity-60">
                                            <Calendar size={14} />
                                            {new Date(u.createdAt).toLocaleDateString()}
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

export default Users;
