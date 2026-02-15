import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Construction } from 'lucide-react';

const ComingSoon = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4 animate-fade-in">
            <div className="bg-yt-bg-secondary p-8 rounded-full mb-6">
                <Construction size={64} className="text-yt-blue" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Coming Soon</h1>
            <p className="text-yt-text-secondary max-w-md mb-8">
                This feature is currently under development. check back later for updates!
            </p>
            <button
                onClick={() => navigate(-1)}
                className="px-6 py-2 bg-yt-blue text-[#0f0f0f] font-medium rounded-full hover:bg-opacity-90 transition-colors"
            >
                Go Back
            </button>
        </div>
    );
};

export default ComingSoon;
