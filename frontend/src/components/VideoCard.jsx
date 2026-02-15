import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, RotateCcw } from 'lucide-react';

const formatViews = (views) => {
    if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
    if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
    return views;
};

const VideoCard = ({ video }) => {
    return (
        <div className="flex flex-col gap-3 group cursor-pointer animate-fade-in">
            <Link to={`/watch/${video._id}`} className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
                <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-2 right-2 bg-[#000000cc] text-white text-xs font-medium px-1.5 py-0.5 rounded-md">
                    {video.type === 'live' ? 'LIVE' : (video.type === 'short' ? 'SHORTS' : video.duration)}
                </div>
                {video.type === 'live' && (
                    <div className="absolute top-2 left-2 bg-yt-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-lg">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                        LIVE
                    </div>
                )}
                {video.type === 'short' && (
                    <div className="absolute top-2 left-2 bg-yt-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-lg">
                        <RotateCcw size={10} className="animate-spin-slow" />
                        SHORTS
                    </div>
                )}
            </Link>

            <div className="flex gap-3 px-1">
                <Link to={`/channel/${video.channel?._id}`} className="flex-shrink-0 mt-1">
                    <img
                        src={video.channel?.avatarUrl}
                        alt={video.channel?.name}
                        className="w-9 h-9 rounded-full object-cover border border-yt-border"
                    />
                </Link>
                <div className="flex flex-col overflow-hidden">
                    <Link to={`/watch/${video._id}`}>
                        <h3 className="text-yt-text font-semibold line-clamp-2 text-[15px] leading-tight hover:text-yt-blue">
                            {video.title}
                        </h3>
                    </Link>
                    <div className="flex flex-col mt-1">
                        <Link to={`/channel/${video.channel?._id}`} className="text-yt-text-secondary text-sm hover:text-yt-text flex items-center gap-1">
                            {video.channel?.name}
                            {video.channel?.isVerified && <CheckCircle2 size={12} fill="gray" />}
                        </Link>
                        <div className="text-yt-text-secondary text-[13px] flex items-center gap-1">
                            {video.type === 'live' ? (
                                <span className="text-yt-red flex items-center gap-1 font-medium">
                                    {video.viewers?.toLocaleString() || 0} watching
                                </span>
                            ) : (
                                <>
                                    <span>{formatViews(video.views)} views</span>
                                    <span>•</span>
                                    <span>{new Date(video.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoCard;
