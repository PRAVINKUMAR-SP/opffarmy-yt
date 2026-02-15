import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, RotateCcw } from 'lucide-react';

const VideoPlayer = ({ src, poster }) => {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showControls, setShowControls] = useState(false);
    const [quality, setQuality] = useState('Auto'); // 1080p, 720p, 480p, 360p, Auto
    const [showSettings, setShowSettings] = useState(false);

    const togglePlay = () => {
        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPlaying(true);
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleTimeUpdate = () => {
        const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
        setProgress(p);
    };

    const handleSeek = (e) => {
        const time = (e.target.value / 100) * videoRef.current.duration;
        videoRef.current.currentTime = time;
        setProgress(e.target.value);
    };

    const toggleMute = () => {
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const toggleFullScreen = () => {
        const container = containerRef.current;
        if (!document.fullscreenElement) {
            if (container.requestFullscreen) container.requestFullscreen();
            else if (container.webkitRequestFullscreen) container.webkitRequestFullscreen();
            else if (container.msRequestFullscreen) container.msRequestFullscreen();
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
        }
    };

    const formatTime = (time) => {
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getQualityBlur = () => {
        if (quality === '360p') return 'blur(1.5px)';
        if (quality === '480p') return 'blur(0.8px)';
        if (quality === '720p') return 'blur(0.3px)';
        return 'none';
    };

    const qualityOptions = ['1080p', '720p', '480p', '360p', 'Auto'];

    return (
        <div
            ref={containerRef}
            className="relative aspect-video bg-black rounded-xl overflow-hidden group shadow-2xl animate-fade-in"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
        >
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                className="w-full h-full cursor-pointer transition-all duration-500"
                style={{ filter: getQualityBlur() }}
                onClick={togglePlay}
                onDoubleClick={toggleFullScreen}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={() => setDuration(videoRef.current.duration)}
            />

            {/* Play/Pause Overlay Icon */}
            {!isPlaying && (
                <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                >
                    <div className="bg-[#00000080] p-6 rounded-full scale-110 animate-pulse">
                        <Play size={48} fill="white" color="white" />
                    </div>
                </div>
            )}

            {/* Controls Container */}
            <div className={`
        absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#000000cc] to-transparent
        transition-opacity duration-300 flex flex-col gap-2
        ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}
      `}>
                {/* Progress Bar */}
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleSeek}
                    className="w-full h-1 bg-[#ffffff4d] rounded-full appearance-none cursor-pointer accent-yt-red"
                />

                <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-4">
                        <button onClick={togglePlay} className="hover:scale-110 transition-transform">
                            {isPlaying ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" />}
                        </button>
                        <button onClick={toggleMute} className="hover:scale-110 transition-transform">
                            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                        </button>
                        <div className="text-sm font-medium">
                            {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 relative">
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className={`hover:rotate-45 transition-transform ${showSettings ? 'text-yt-red' : ''}`}
                        >
                            <Settings size={22} />
                        </button>

                        {showSettings && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowSettings(false)}></div>
                                <div className="absolute right-0 bottom-full mb-4 w-48 bg-[#0f0f0fde] backdrop-blur-md border border-[#ffffff1a] rounded-xl shadow-2xl overflow-hidden z-20 animate-slide-up">
                                    <div className="px-4 py-3 border-b border-[#ffffff1a]">
                                        <p className="text-[10px] font-bold text-[#ffffff80] uppercase tracking-widest">Quality</p>
                                    </div>
                                    <div className="py-1">
                                        {qualityOptions.map((opt) => (
                                            <button
                                                key={opt}
                                                onClick={() => {
                                                    setQuality(opt);
                                                    setShowSettings(false);
                                                }}
                                                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium hover:bg-[#ffffff1a] transition-colors ${quality === opt ? 'text-yt-red' : 'text-white'}`}
                                            >
                                                <span>{opt}</span>
                                                {quality === opt && <div className="w-1.5 h-1.5 rounded-full bg-yt-red shadow-[0_0_8px_#ff0000]"></div>}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        <button onClick={toggleFullScreen} className="hover:scale-110 transition-transform"><Maximize size={22} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
