import React, { useState } from 'react';
import { MessageSquare, Send, AlertTriangle, Bug, Lightbulb, HelpCircle, Image, CheckCircle, X } from 'lucide-react';

const categories = [
    { id: 'bug', label: 'Bug Report', icon: Bug, color: 'text-red-500' },
    { id: 'feature', label: 'Feature Request', icon: Lightbulb, color: 'text-yellow-500' },
    { id: 'content', label: 'Content Issue', icon: AlertTriangle, color: 'text-orange-500' },
    { id: 'general', label: 'General Feedback', icon: MessageSquare, color: 'text-yt-blue' },
    { id: 'question', label: 'Question', icon: HelpCircle, color: 'text-green-500' },
];

const Feedback = () => {
    const [category, setCategory] = useState('');
    const [message, setMessage] = useState('');
    const [screenshot, setScreenshot] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!category || !message.trim()) return;
        // Simulate submission
        setSubmitted(true);
        setTimeout(() => {
            setCategory('');
            setMessage('');
            setScreenshot(null);
            setEmail('');
        }, 300);
    };

    const handleScreenshot = (e) => {
        const file = e.target.files[0];
        if (file) {
            setScreenshot({
                name: file.name,
                preview: URL.createObjectURL(file),
                size: (file.size / 1024).toFixed(1) + ' KB'
            });
        }
    };

    if (submitted) {
        return (
            <div className="max-w-2xl mx-auto p-6 animate-fade-in flex flex-col items-center justify-center h-[60vh]">
                <div className="bg-green-500 bg-opacity-10 p-6 rounded-full mb-6">
                    <CheckCircle size={56} className="text-green-500" />
                </div>
                <h1 className="text-2xl font-black text-yt-text mb-2">Thank You!</h1>
                <p className="text-yt-text-secondary text-center max-w-md mb-8">
                    Your feedback has been submitted successfully. We appreciate your help in making OPFFARMY better.
                </p>
                <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 bg-yt-blue text-[#0f0f0f] font-medium rounded-full text-sm hover:bg-opacity-90 transition-all active:scale-95"
                >
                    Send More Feedback
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="bg-yt-blue bg-opacity-10 p-3 rounded-full">
                    <Send size={28} className="text-yt-blue" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-yt-text">Send Feedback</h1>
                    <p className="text-sm text-yt-text-secondary">Help us improve OPFFARMY</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category Selection */}
                <div>
                    <label className="text-xs font-bold text-yt-text-secondary uppercase tracking-wider mb-3 block">
                        Feedback Category *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {categories.map(cat => {
                            const CatIcon = cat.icon;
                            return (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setCategory(cat.id)}
                                    className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${category === cat.id
                                            ? 'bg-yt-blue bg-opacity-10 border-yt-blue text-yt-blue'
                                            : 'bg-yt-bg-secondary border-yt-border text-yt-text hover:border-yt-text-secondary'
                                        }`}
                                >
                                    <CatIcon size={16} className={category === cat.id ? 'text-yt-blue' : cat.color} />
                                    {cat.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label className="text-xs font-bold text-yt-text-secondary uppercase tracking-wider mb-2 block">
                        Email (optional)
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com — so we can follow up"
                        className="w-full bg-yt-bg-secondary border border-yt-border rounded-xl px-4 py-3 text-sm text-yt-text outline-none focus:border-yt-blue focus:ring-1 focus:ring-yt-blue transition-all"
                    />
                </div>

                {/* Message */}
                <div>
                    <label className="text-xs font-bold text-yt-text-secondary uppercase tracking-wider mb-2 block">
                        Your Feedback *
                    </label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Describe your feedback in detail. Include steps to reproduce if reporting a bug..."
                        rows={6}
                        className="w-full bg-yt-bg-secondary border border-yt-border rounded-xl px-4 py-3 text-sm text-yt-text outline-none resize-none focus:border-yt-blue focus:ring-1 focus:ring-yt-blue transition-all"
                    />
                    <p className="text-xs text-yt-text-secondary mt-1">{message.length}/2000 characters</p>
                </div>

                {/* Screenshot */}
                <div>
                    <label className="text-xs font-bold text-yt-text-secondary uppercase tracking-wider mb-2 block">
                        Screenshot (optional)
                    </label>
                    {screenshot ? (
                        <div className="flex items-center gap-3 bg-yt-bg-secondary border border-yt-border rounded-xl p-3">
                            <img src={screenshot.preview} alt="Screenshot" className="w-16 h-16 object-cover rounded-lg" />
                            <div className="flex-1">
                                <p className="text-sm text-yt-text font-medium truncate">{screenshot.name}</p>
                                <p className="text-xs text-yt-text-secondary">{screenshot.size}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setScreenshot(null)}
                                className="p-1.5 hover:bg-yt-bg-hover rounded-full transition-colors"
                            >
                                <X size={16} className="text-yt-text-secondary" />
                            </button>
                        </div>
                    ) : (
                        <label className="flex items-center justify-center gap-2 p-6 border-2 border-dashed border-yt-border rounded-xl cursor-pointer hover:border-yt-text-secondary transition-colors">
                            <Image size={20} className="text-yt-text-secondary" />
                            <span className="text-sm text-yt-text-secondary">Click to attach a screenshot</span>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleScreenshot}
                            />
                        </label>
                    )}
                </div>

                {/* Submit */}
                <div className="flex items-center gap-4 pt-2">
                    <button
                        type="submit"
                        disabled={!category || !message.trim()}
                        className="px-8 py-3 bg-yt-blue text-[#0f0f0f] font-bold rounded-full text-sm hover:bg-opacity-90 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 shadow-lg shadow-yt-blue/10"
                    >
                        Submit Feedback
                    </button>
                    <p className="text-xs text-yt-text-secondary">* Required fields</p>
                </div>
            </form>
        </div>
    );
};

export default Feedback;
