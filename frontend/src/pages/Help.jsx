import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, BookOpen, Monitor, Shield, Bell, Video, Users, Flag, MessageCircle } from 'lucide-react';

const faqs = [
    {
        category: 'Getting Started',
        icon: BookOpen,
        questions: [
            { q: 'How do I create an account?', a: 'Click the "Sign In" button in the top right corner of the page, then select "Create Account". Fill in your name, email, and password to get started.' },
            { q: 'How do I create a channel?', a: 'After signing in, click the camera/video icon in the header bar and select "Create channel". Enter your channel name, description, and upload an avatar to personalize your channel.' },
            { q: 'How do I upload a video?', a: 'Click the camera icon in the top right corner and select "Upload video". You can then fill in the video details including title, description, thumbnail URL, and video URL.' },
        ]
    },
    {
        category: 'Account & Settings',
        icon: Monitor,
        questions: [
            { q: 'How do I change my theme?', a: 'You can switch between Dark and Light mode by clicking your profile avatar, then clicking the "Appearance" option. You can also find the theme toggle at the bottom of the sidebar.' },
            { q: 'How do I edit my profile?', a: 'Click your profile avatar in the top right corner, then select "Settings" to view and manage your account information.' },
            { q: 'How do I manage my watch history?', a: 'Go to Settings > Your data in OPFFARMY to manage your watch and search history preferences, or visit the History page from the sidebar.' },
        ]
    },
    {
        category: 'Privacy & Safety',
        icon: Shield,
        questions: [
            { q: 'How do I report a video?', a: 'While watching a video, click the "..." (more options) button below the video and select "Report". This will flag the video for review.' },
            { q: 'How do I enable Restricted Mode?', a: 'Click your profile avatar, then toggle "Restricted Mode" to filter potentially mature content from your browsing experience.' },
            { q: 'How is my data protected?', a: 'Your data is stored securely and you can manage your privacy settings through the "Your data in OPFFARMY" option in your profile menu.' },
        ]
    },
    {
        category: 'Subscriptions & Notifications',
        icon: Bell,
        questions: [
            { q: 'How do I subscribe to a channel?', a: 'Visit a channel\'s page and click the "Subscribe" button. You can also click the bell icon to manage notification preferences for that channel.' },
            { q: 'Where can I see my subscriptions?', a: 'Click "Subscriptions" in the sidebar to see the latest videos from channels you\'ve subscribed to. Your subscribed channels also appear in the sidebar.' },
        ]
    },
    {
        category: 'Content Creation',
        icon: Video,
        questions: [
            { q: 'How do I create a community post?', a: 'Click the camera icon in the header and select "Create post". You can write text content and optionally include an image.' },
            { q: 'How do I manage my videos?', a: 'If you\'re an admin, you can manage all videos through the Admin Dashboard. Navigate to Admin > Videos from the sidebar.' },
        ]
    },
    {
        category: 'Community Guidelines',
        icon: Users,
        questions: [
            { q: 'What are the community guidelines?', a: 'Our community guidelines encourage respectful interactions, original content, and helpful engagement. Spam, harassment, and hate speech are not tolerated.' },
            { q: 'What happens if I violate guidelines?', a: 'Violations may result in content removal, warnings, or account restrictions depending on the severity and frequency of violations.' },
        ]
    }
];

const AccordionItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-yt-border last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-4 px-1 text-left hover:bg-yt-bg-hover rounded-lg transition-colors"
            >
                <span className="text-sm font-medium text-yt-text pr-4">{question}</span>
                {isOpen ? <ChevronUp size={18} className="text-yt-text-secondary shrink-0" /> : <ChevronDown size={18} className="text-yt-text-secondary shrink-0" />}
            </button>
            {isOpen && (
                <div className="pb-4 px-1 animate-fade-in">
                    <p className="text-sm text-yt-text-secondary leading-relaxed">{answer}</p>
                </div>
            )}
        </div>
    );
};

const Help = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState(null);

    const filteredFaqs = faqs.map(cat => ({
        ...cat,
        questions: cat.questions.filter(
            qItem => qItem.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                qItem.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(cat => cat.questions.length > 0);

    return (
        <div className="max-w-4xl mx-auto p-6 animate-fade-in">
            {/* Header */}
            <div className="text-center mb-10">
                <div className="bg-yt-blue bg-opacity-10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HelpCircle size={40} className="text-yt-blue" />
                </div>
                <h1 className="text-3xl font-black text-yt-text mb-2">How can we help you?</h1>
                <p className="text-yt-text-secondary">Search for answers or browse our help topics below</p>
            </div>

            {/* Search */}
            <div className="relative max-w-xl mx-auto mb-10">
                <div className="flex items-center bg-yt-bg-secondary border border-yt-border rounded-full px-5 py-3 focus-within:border-yt-blue focus-within:ring-1 focus-within:ring-yt-blue transition-all">
                    <Search size={20} className="text-yt-text-secondary mr-3" />
                    <input
                        type="text"
                        placeholder="Describe your issue..."
                        className="bg-transparent text-yt-text w-full outline-none text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Topic Cards */}
            {!searchQuery && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
                    {faqs.map((cat, idx) => {
                        const CategoryIcon = cat.icon;
                        return (
                            <button
                                key={idx}
                                onClick={() => setActiveCategory(activeCategory === idx ? null : idx)}
                                className={`flex flex-col items-center gap-2 p-5 rounded-xl border transition-all hover:border-yt-blue ${activeCategory === idx
                                        ? 'bg-yt-blue bg-opacity-10 border-yt-blue'
                                        : 'bg-yt-bg-secondary border-yt-border'
                                    }`}
                            >
                                <CategoryIcon size={24} className={activeCategory === idx ? 'text-yt-blue' : 'text-yt-text-secondary'} />
                                <span className="text-xs font-semibold text-yt-text text-center">{cat.category}</span>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* FAQ Sections */}
            <div className="space-y-6">
                {(searchQuery ? filteredFaqs : activeCategory !== null ? [faqs[activeCategory]] : faqs).map((cat, idx) => (
                    <div key={idx} className="bg-yt-bg-secondary rounded-xl border border-yt-border overflow-hidden">
                        <div className="px-6 py-4 border-b border-yt-border bg-yt-bg-elevated flex items-center gap-3">
                            <cat.icon size={18} className="text-yt-blue" />
                            <h2 className="font-bold text-sm text-yt-text">{cat.category}</h2>
                        </div>
                        <div className="px-5">
                            {cat.questions.map((qItem, qIdx) => (
                                <AccordionItem key={qIdx} question={qItem.q} answer={qItem.a} />
                            ))}
                        </div>
                    </div>
                ))}

                {searchQuery && filteredFaqs.length === 0 && (
                    <div className="text-center py-16">
                        <MessageCircle size={48} className="text-yt-text-secondary mx-auto mb-4 opacity-40" />
                        <p className="text-yt-text font-bold mb-1">No results found</p>
                        <p className="text-sm text-yt-text-secondary">Try different keywords or browse the topics above</p>
                    </div>
                )}
            </div>

            {/* Still Need Help */}
            <div className="mt-10 text-center bg-yt-bg-secondary rounded-xl border border-yt-border p-8">
                <h3 className="text-lg font-bold text-yt-text mb-2">Still need help?</h3>
                <p className="text-sm text-yt-text-secondary mb-4">Our support team is here to assist you</p>
                <div className="flex gap-3 justify-center">
                    <a href="/feedback" className="px-6 py-2.5 bg-yt-blue text-[#0f0f0f] font-medium rounded-full text-sm hover:bg-opacity-90 transition-all active:scale-95">
                        Contact Support
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 bg-yt-bg-hover text-yt-text font-medium rounded-full text-sm hover:bg-yt-border transition-all active:scale-95">
                        @OPFFARMY on X
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Help;
