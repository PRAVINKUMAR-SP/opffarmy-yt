import React, { useState } from 'react';
import { X, Copy, Check, Twitter, Facebook, Mail, MessageCircle, Send } from 'lucide-react';

const ShareModal = ({ isOpen, onClose, videoTitle }) => {
    const [copied, setCopied] = useState(false);
    const videoUrl = window.location.href;

    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(videoUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareOptions = [
        {
            name: 'WhatsApp',
            icon: MessageCircle,
            color: 'bg-[#25D366]',
            url: `https://api.whatsapp.com/send?text=${encodeURIComponent(videoTitle + ' ' + videoUrl)}`
        },
        {
            name: 'X (Twitter)',
            icon: Twitter,
            color: 'bg-black',
            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(videoTitle)}&url=${encodeURIComponent(videoUrl)}`
        },
        {
            name: 'Facebook',
            icon: Facebook,
            color: 'bg-[#1877F2]',
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(videoUrl)}`
        },
        {
            name: 'Telegram',
            icon: Send,
            color: 'bg-[#0088CC]',
            url: `https://t.me/share/url?url=${encodeURIComponent(videoUrl)}&text=${encodeURIComponent(videoTitle)}`
        },
        {
            name: 'Email',
            icon: Mail,
            color: 'bg-yt-text-secondary',
            url: `mailto:?subject=${encodeURIComponent(videoTitle)}&body=${encodeURIComponent(videoUrl)}`
        },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm animate-fade-in">
            <div className="bg-yt-bg-secondary w-full max-w-md rounded-2xl shadow-2xl border border-yt-border overflow-hidden animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-yt-border">
                    <h2 className="text-xl font-bold text-yt-text">Share</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-yt-bg-hover rounded-full transition-colors text-yt-text"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Social Icons */}
                <div className="px-6 py-8">
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar justify-between">
                        {shareOptions.map((option) => (
                            <a
                                key={option.name}
                                href={option.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-2 group shrink-0"
                            >
                                <div className={`${option.color} p-3.5 rounded-full text-white transition-transform group-hover:scale-110 shadow-lg`}>
                                    <option.icon size={24} />
                                </div>
                                <span className="text-[11px] font-medium text-yt-text-secondary group-hover:text-yt-text transition-colors">
                                    {option.name}
                                </span>
                            </a>
                        ))}
                    </div>

                    {/* Copy Link Section */}
                    <div className="mt-8">
                        <label className="text-xs font-bold text-yt-text-secondary uppercase tracking-widest mb-2 block">
                            Video Link
                        </label>
                        <div className="flex items-center gap-2 p-1.5 bg-yt-bg rounded-xl border border-yt-border focus-within:border-yt-blue transition-all">
                            <input
                                type="text"
                                readOnly
                                value={videoUrl}
                                className="flex-1 bg-transparent border-none outline-none px-3 py-2 text-sm text-yt-text-secondary font-medium"
                            />
                            <button
                                onClick={handleCopy}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all active:scale-95 ${copied
                                        ? 'bg-yt-blue text-white'
                                        : 'bg-yt-text text-[#0f0f0f] hover:bg-[#e1e1e1]'
                                    }`}
                            >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-yt-bg p-4 flex justify-end">
                    <p className="text-[10px] text-yt-text-secondary font-medium italic opacity-60">
                        Links are generated for the current video view
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
