const API_BASE = import.meta.env.VITE_API_URL || '';

const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || data.error || 'Something went wrong');
    }
    return data;
};

const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem('yt_user') || '{}');
    return user.token ? { 'Authorization': `Bearer ${user.token}` } : {};
};

const api = {
    // Videos
    getVideos: (params = {}) => {
        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v != null)
        );
        const query = new URLSearchParams(filteredParams).toString();
        return fetch(`${API_BASE}/api/videos?${query}`).then(handleResponse);
    },
    getTrendingVideos: () =>
        fetch(`${API_BASE}/api/videos/trending`).then(handleResponse),
    recordVideoView: (videoId, userId) =>
        fetch(`${API_BASE}/api/videos/${videoId}/view`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
        }).then(handleResponse),
    getVideo: (id) =>
        fetch(`${API_BASE}/api/videos/${id}`).then(handleResponse),
    createVideo: (data) =>
        fetch(`${API_BASE}/api/videos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(data),
        }).then(handleResponse),
    updateVideo: (id, data) =>
        fetch(`${API_BASE}/api/videos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(data),
        }).then(handleResponse),
    deleteVideo: (id) =>
        fetch(`${API_BASE}/api/videos/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        }).then(handleResponse),
    likeVideo: (id) =>
        fetch(`${API_BASE}/api/videos/${id}/like`, {
            method: 'POST',
            headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' }
        }).then(handleResponse),
    dislikeVideo: (id) =>
        fetch(`${API_BASE}/api/videos/${id}/dislike`, {
            method: 'POST',
            headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' }
        }).then(handleResponse),
    saveVideo: (id, userId) =>
        fetch(`${API_BASE}/api/videos/${id}/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify({ userId }),
        }).then(handleResponse),
    getSavedVideos: (userId) =>
        fetch(`${API_BASE}/api/videos/saved/${userId}`).then(handleResponse),
    reportVideo: (videoId, userId) =>
        fetch(`${API_BASE}/api/videos/${videoId}/report`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify({ userId }),
        }).then(handleResponse),

    // Channels
    getChannels: () =>
        fetch(`${API_BASE}/api/channels`).then(handleResponse),
    getChannel: (id) =>
        fetch(`${API_BASE}/api/channels/${id}`).then(handleResponse),
    createChannel: (data) =>
        fetch(`${API_BASE}/api/channels`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(data),
        }).then(handleResponse),
    updateChannel: (id, data) =>
        fetch(`${API_BASE}/api/channels/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(data),
        }).then(handleResponse),
    deleteChannel: (id) =>
        fetch(`${API_BASE}/api/channels/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        }).then(handleResponse),

    // Comments
    getComments: (videoId) =>
        fetch(`${API_BASE}/api/comments/${videoId}`).then(handleResponse),
    addComment: (data) =>
        fetch(`${API_BASE}/api/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(data),
        }).then(handleResponse),
    likeComment: (id, userId) =>
        fetch(`${API_BASE}/api/comments/${id}/like`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify({ userId }),
        }).then(handleResponse),
    replyToComment: (id, data) =>
        fetch(`${API_BASE}/api/comments/${id}/reply`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(data),
        }).then(handleResponse),
    likeVideo: (id, userId) =>
        fetch(`${API_BASE}/api/videos/${id}/like`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify({ userId }),
        }).then(handleResponse),
    likePost: (id, userId) =>
        fetch(`${API_BASE}/api/posts/${id}/like`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify({ userId }),
        }).then(handleResponse),
    subscribe: (userId, channelId) =>
        fetch(`${API_BASE}/api/subscriptions/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify({ userId, channelId }),
        }).then(handleResponse),
    checkSubscription: (userId, channelId) =>
        fetch(`${API_BASE}/api/subscriptions/check/${userId}/${channelId}`).then(handleResponse),
    getUserSubscriptions: (userId) =>
        fetch(`${API_BASE}/api/subscriptions/${userId}`).then(handleResponse),

    // Categories
    getCategories: () =>
        fetch(`${API_BASE}/api/categories`).then(handleResponse),
    createCategory: (data) =>
        fetch(`${API_BASE}/api/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(data),
        }).then(handleResponse),
    updateCategory: (id, data) =>
        fetch(`${API_BASE}/api/categories/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(data),
        }).then(handleResponse),
    deleteCategory: (id) =>
        fetch(`${API_BASE}/api/categories/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        }).then(handleResponse),

    // Search
    search: (q) =>
        fetch(`${API_BASE}/api/search?q=${encodeURIComponent(q)}`).then(handleResponse),
    getSearchSuggestions: (q) =>
        fetch(`${API_BASE}/api/search/suggestions?q=${encodeURIComponent(q)}`).then(handleResponse),

    // Admin
    getAdminStats: () =>
        fetch(`${API_BASE}/api/admin/stats`, { headers: getAuthHeaders() }).then(handleResponse),
    getAdminVideos: () =>
        fetch(`${API_BASE}/api/admin/videos`, { headers: getAuthHeaders() }).then(handleResponse),
    getAdminChannels: () =>
        fetch(`${API_BASE}/api/admin/channels`, { headers: getAuthHeaders() }).then(handleResponse),
    getAdminUsers: () =>
        fetch(`${API_BASE}/api/admin/users`, { headers: getAuthHeaders() }).then(handleResponse),

    // Posts
    getPosts: () =>
        fetch(`${API_BASE}/api/posts`).then(handleResponse),
    getPostsByChannel: (channelId) =>
        fetch(`${API_BASE}/api/posts?channel=${channelId}`).then(handleResponse),
    createPost: (data) =>
        fetch(`${API_BASE}/api/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(data),
        }).then(handleResponse),
    deletePost: (id) =>
        fetch(`${API_BASE}/api/posts/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        }).then(handleResponse),

    // Auth
    register: (data) =>
        fetch(`${API_BASE}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }).then(handleResponse),
    login: (data) =>
        fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }).then(handleResponse),
    uploadFile: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return fetch(`${API_BASE}/api/upload`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: formData,
        }).then(handleResponse);
    },

    // History
    getUserHistory: (userId) =>
        fetch(`${API_BASE}/api/history/${userId}`, { headers: getAuthHeaders() }).then(handleResponse),
    clearHistory: (userId) =>
        fetch(`${API_BASE}/api/history/${userId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        }).then(handleResponse),
    removeFromHistory: (userId, videoId) =>
        fetch(`${API_BASE}/api/history/${userId}/${videoId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        }).then(handleResponse),
    // Playlists
    getUserPlaylists: (userId) =>
        fetch(`${API_BASE}/api/playlists/user/${userId}`).then(handleResponse),
    getPlaylist: (id) =>
        fetch(`${API_BASE}/api/playlists/${id}`).then(handleResponse),
    createPlaylist: (data) =>
        fetch(`${API_BASE}/api/playlists`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(data),
        }).then(handleResponse),
    addVideoToPlaylist: (playlistId, videoId) =>
        fetch(`${API_BASE}/api/playlists/${playlistId}/add`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify({ videoId }),
        }).then(handleResponse),
    removeVideoFromPlaylist: (playlistId, videoId) =>
        fetch(`${API_BASE}/api/playlists/${playlistId}/remove`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify({ videoId }),
        }).then(handleResponse),
    deletePlaylist: (id) =>
        fetch(`${API_BASE}/api/playlists/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        }).then(handleResponse),
};

export default api;
