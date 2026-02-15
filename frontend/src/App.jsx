import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from './context/UserContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Watch from './pages/Watch';
import Channel from './pages/Channel';
import Search from './pages/Search';
import Trending from './pages/Trending';
import Library from './pages/Library';
import AdminDashboard from './pages/Admin/Dashboard';
import VideoManagement from './pages/Admin/Videos';
import CategoryManagement from './pages/Admin/Categories';
import PostManagement from './pages/Admin/Posts';
import ChannelManagement from './pages/Admin/Channels';
import Users from './pages/Admin/Users';
import Subscriptions from './pages/Subscriptions';
import History from './pages/History';
import LikedVideos from './pages/LikedVideos';

import { SidebarProvider } from './context/SidebarContext';
import { ThemeProvider } from './context/ThemeContext';
import Settings from './pages/Settings';
import YourData from './pages/YourData';
import Purchases from './pages/Purchases';
import Help from './pages/Help';
import Feedback from './pages/Feedback';
import Playlists from './pages/Playlists';
import PlaylistDetail from './pages/PlaylistDetail';

function App() {
    const { isAdmin } = useUser();
    return (
        <ThemeProvider>
            <SidebarProvider>
                <Router>
                    <div className="flex flex-col h-screen overflow-hidden">
                        <Header />
                        <div className="flex flex-1 overflow-hidden">
                            <Sidebar />
                            <main className="flex-1 overflow-y-auto bg-yt-bg pb-10">
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/watch/:id" element={<Watch />} />
                                    <Route path="/channel/:id" element={<Channel />} />
                                    <Route path="/search" element={<Search />} />
                                    <Route path="/trending" element={<Trending />} />
                                    <Route path="/library" element={<Library />} />
                                    <Route path="/subscriptions" element={<Subscriptions />} />
                                    <Route path="/history" element={<History />} />
                                    <Route path="/liked" element={<LikedVideos />} />
                                    <Route path="/settings" element={<Settings />} />
                                    <Route path="/your-data" element={<YourData />} />
                                    <Route path="/purchases" element={<Purchases />} />
                                    <Route path="/help" element={<Help />} />
                                    <Route path="/feedback" element={<Feedback />} />
                                    <Route path="/playlists" element={<Playlists />} />
                                    <Route path="/playlist/:id" element={<PlaylistDetail />} />

                                    {/* Admin Routes - Protected */}
                                    <Route
                                        path="/admin"
                                        element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />}
                                    />
                                    <Route
                                        path="/admin/videos"
                                        element={isAdmin ? <VideoManagement /> : <Navigate to="/" />}
                                    />
                                    <Route
                                        path="/admin/users"
                                        element={isAdmin ? <Users /> : <Navigate to="/" />}
                                    />
                                    <Route
                                        path="/admin/categories"
                                        element={isAdmin ? <CategoryManagement /> : <Navigate to="/" />}
                                    />
                                    <Route
                                        path="/admin/posts"
                                        element={isAdmin ? <PostManagement /> : <Navigate to="/" />}
                                    />
                                    <Route
                                        path="/admin/channels"
                                        element={isAdmin ? <ChannelManagement /> : <Navigate to="/" />}
                                    />
                                </Routes>
                            </main>
                        </div>
                    </div>
                </Router>
            </SidebarProvider>
        </ThemeProvider>
    );
}

export default App;
