import React from 'react';
import { useUser } from '../context/UserContext';
import { Crown, CreditCard, Star, Users, Zap, Gift, ShieldCheck } from 'lucide-react';

const PurchaseCard = ({ icon: Icon, title, description, buttonText, color }) => (
    <div className="bg-yt-bg-secondary rounded-xl border border-yt-border p-6 flex flex-col gap-4 hover:border-yt-text-secondary transition-colors">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
            <Icon size={24} className="text-white" />
        </div>
        <div>
            <h3 className="font-bold text-yt-text mb-1">{title}</h3>
            <p className="text-sm text-yt-text-secondary leading-relaxed">{description}</p>
        </div>
        <button className="mt-auto px-5 py-2.5 bg-yt-blue text-[#0f0f0f] font-medium rounded-full text-sm hover:bg-opacity-90 transition-all active:scale-95 w-max">
            {buttonText}
        </button>
    </div>
);

const Purchases = () => {
    const { user } = useUser();

    if (!user) {
        return (
            <div className="flex justify-center items-center h-[60vh] text-yt-text-secondary">
                <p>Please sign in to view purchases and memberships.</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6 animate-fade-in">
            {/* Premium Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-orange-500 p-8 mb-8">
                <div className="absolute inset-0 bg-black bg-opacity-20" />
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                    <div className="bg-white bg-opacity-20 p-4 rounded-full backdrop-blur-sm">
                        <Crown size={40} className="text-white" />
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-2xl md:text-3xl font-black text-white mb-2">OPFFARMY Premium</h1>
                        <p className="text-white text-opacity-90 max-w-lg">
                            Ad-free videos, background play, offline downloads, and OPFFARMY Music Premium — all included.
                        </p>
                    </div>
                    <button className="px-8 py-3 bg-white text-red-600 font-bold rounded-full text-sm hover:bg-opacity-90 transition-all active:scale-95 shadow-lg whitespace-nowrap">
                        Get Premium
                    </button>
                </div>
            </div>

            <h2 className="text-xl font-bold text-yt-text mb-6">Your Purchases & Memberships</h2>

            {/* Empty State */}
            <div className="bg-yt-bg-secondary rounded-xl border border-yt-border p-12 text-center mb-8">
                <div className="bg-yt-bg-hover w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard size={36} className="text-yt-text-secondary" />
                </div>
                <h3 className="font-bold text-lg text-yt-text mb-2">No purchases yet</h3>
                <p className="text-sm text-yt-text-secondary max-w-md mx-auto">
                    Your movies, shows, and other purchased content will appear here. Start exploring to find something you'll love.
                </p>
            </div>

            {/* Features Grid */}
            <h2 className="text-xl font-bold text-yt-text mb-6">Explore Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <PurchaseCard
                    icon={Star}
                    title="Channel Memberships"
                    description="Join your favorite creators' memberships for exclusive perks, badges, and custom emojis."
                    buttonText="Browse Channels"
                    color="bg-purple-600"
                />
                <PurchaseCard
                    icon={Zap}
                    title="Super Chat & Super Stickers"
                    description="Stand out during live streams by sending highlighted messages and animated stickers."
                    buttonText="Find Live Streams"
                    color="bg-yellow-600"
                />
                <PurchaseCard
                    icon={Gift}
                    title="Super Thanks"
                    description="Show extra appreciation to creators by purchasing Super Thanks on their videos."
                    buttonText="Explore Videos"
                    color="bg-green-600"
                />
                <PurchaseCard
                    icon={Users}
                    title="Family Plan"
                    description="Share your Premium benefits with up to 5 family members living in the same household."
                    buttonText="Learn More"
                    color="bg-blue-600"
                />
                <PurchaseCard
                    icon={ShieldCheck}
                    title="Movies & Shows"
                    description="Rent or buy the latest movies and shows directly on OPFFARMY."
                    buttonText="Browse Store"
                    color="bg-red-600"
                />
            </div>
        </div>
    );
};

export default Purchases;
