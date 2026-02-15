import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useUser } from '../context/UserContext';
import { ThumbsUp, MessageSquare, MoreVertical, Trash2, CornerDownRight } from 'lucide-react';

const CommentSection = ({ videoId }) => {
    const { user } = useUser();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null); // comment ID
    const [replyText, setReplyText] = useState('');
    const [replySubmitting, setReplySubmitting] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await api.getComments(videoId);
                setComments(res);
            } catch (err) {
                console.error('Failed to fetch comments', err);
            }
        };
        fetchComments();
    }, [videoId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        if (!user) return alert('Please sign in to comment');

        setSubmitting(true);
        try {
            const res = await api.addComment({
                text: newComment,
                video: videoId,
                user: user._id
            });

            const newCommentWithUser = {
                ...res,
                user: {
                    _id: user._id,
                    name: user.name,
                    avatar: user.avatar
                },
                replies: [],
                likes: 0,
                likedBy: []
            };
            setComments([newCommentWithUser, ...comments]);
            setNewComment('');
        } catch (err) {
            console.error('Comment Post Error:', err);
            alert('Failed to post comment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleLike = async (commentId) => {
        if (!user) return alert('Please sign in to like comments');
        try {
            const res = await api.likeComment(commentId, user._id);
            setComments(comments.map(c => {
                if (c._id === commentId) {
                    return { ...c, likes: res.likes, likedBy: res.hasLiked ? [...(c.likedBy || []), user._id] : (c.likedBy || []).filter(id => id !== user._id) };
                }
                return c;
            }));
        } catch (err) {
            console.error('Like error:', err);
        }
    };

    const handleReplySubmit = async (commentId) => {
        if (!replyText.trim()) return;
        if (!user) return alert('Please sign in to reply');

        setReplySubmitting(true);
        try {
            const res = await api.replyToComment(commentId, {
                text: replyText,
                userId: user._id
            });

            // Update the comment with the new reply list from server
            setComments(comments.map(c =>
                c._id === commentId ? res : c
            ));
            setReplyingTo(null);
            setReplyText('');
        } catch (err) {
            console.error('Reply error:', err);
            alert('Failed to reply');
        } finally {
            setReplySubmitting(false);
        }
    };

    return (
        <div className="mt-6 flex flex-col gap-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
                {comments.length} Comments
            </h3>

            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-yt-blue flex items-center justify-center text-white font-bold flex-shrink-0">
                    {user ? <img src={user.avatar} className="w-full h-full rounded-full object-cover" /> : 'G'}
                </div>
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-2">
                    <input
                        type="text"
                        placeholder="Add a comment..."
                        className="bg-transparent border-b border-yt-border py-1 text-sm outline-none focus:border-yt-text focus:border-b-2 transition-all w-full"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <div className={`flex justify-end gap-3 transition-opacity ${newComment.trim() ? 'opacity-100' : 'opacity-0'}`}>
                        <button
                            type="button"
                            onClick={() => setNewComment('')}
                            className="text-sm px-4 py-2 hover:bg-yt-bg-hover rounded-full transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="text-sm px-4 py-2 bg-yt-blue text-[#0f0f0f] font-medium rounded-full hover:bg-opacity-90 disabled:opacity-50"
                        >
                            Comment
                        </button>
                    </div>
                </form>
            </div>

            <div className="flex flex-col gap-5 mt-4">
                {comments.map((comment) => (
                    <div key={comment._id} className="flex gap-4 group">
                        <img
                            src={comment.user?.avatar}
                            alt={comment.user?.name}
                            className="w-10 h-10 rounded-full flex-shrink-0 object-cover cursor-pointer"
                        />
                        <div className="flex flex-col gap-1 w-full">
                            <div className="flex items-center gap-2">
                                <span className={`text-sm font-bold cursor-pointer ${comment.user?.role === 'admin' ? 'bg-yt-text text-yt-bg px-2 rounded-full text-xs py-0.5' : 'text-yt-text'}`}>
                                    {comment.user?.name}
                                </span>
                                <span className="text-xs text-yt-text-secondary">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-[15px]">{comment.text}</p>

                            {/* Actions */}
                            <div className="flex items-center gap-4 mt-2">
                                <button
                                    onClick={() => handleLike(comment._id)}
                                    className={`flex items-center gap-1.5 hover:bg-yt-bg-hover p-1.5 rounded-full transition-colors ${comment.likedBy?.includes(user?._id) ? 'text-yt-blue' : ''}`}
                                >
                                    <ThumbsUp size={14} fill={comment.likedBy?.includes(user?._id) ? "currentColor" : "none"} />
                                    <span className="text-xs font-medium">{comment.likes || 0}</span>
                                </button>
                                <button
                                    onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                                    className="text-xs font-medium hover:bg-yt-bg-hover px-3 py-1.5 rounded-full transition-colors"
                                >
                                    Reply
                                </button>
                            </div>

                            {/* Reply Input */}
                            {replyingTo === comment._id && (
                                <div className="mt-3 flex gap-3 animate-fade-in pl-2">
                                    <div className="w-6 h-6 rounded-full bg-yt-blue flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                        {user ? <img src={user.avatar} className="w-full h-full rounded-full object-cover" /> : 'G'}
                                    </div>
                                    <div className="flex-1 flex flex-col gap-2">
                                        <input
                                            type="text"
                                            placeholder="Add a reply..."
                                            className="bg-transparent border-b border-yt-border py-1 text-sm outline-none focus:border-yt-text focus:border-b-2 transition-all w-full"
                                            value={replyText}
                                            autoFocus
                                            onChange={(e) => setReplyText(e.target.value)}
                                        />
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => setReplyingTo(null)}
                                                className="text-xs px-3 py-1.5 hover:bg-yt-bg-hover rounded-full transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => handleReplySubmit(comment._id)}
                                                disabled={replySubmitting || !replyText.trim()}
                                                className="text-xs px-3 py-1.5 bg-yt-blue text-[#0f0f0f] font-bold rounded-full hover:bg-opacity-90 disabled:opacity-50"
                                            >
                                                Reply
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Replies List */}
                            {comment.replies && comment.replies.length > 0 && (
                                <div className="mt-2 pl-2">
                                    <button className="flex items-center gap-2 text-yt-blue text-sm font-bold mb-2 group">
                                        <CornerDownRight size={16} />
                                        {comment.replies.length} Replies
                                    </button>
                                    <div className="flex flex-col gap-3 pl-4 border-l-2 border-yt-bg-hover">
                                        {comment.replies.map((reply, idx) => (
                                            <div key={idx} className="flex gap-3">
                                                <img
                                                    src={reply.user?.avatar}
                                                    alt={reply.user?.name}
                                                    className="w-6 h-6 rounded-full flex-shrink-0 object-cover"
                                                />
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold text-yt-text">{reply.user?.name}</span>
                                                        <span className="text-[10px] text-yt-text-secondary">
                                                            {new Date(reply.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm">{reply.text}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommentSection;
