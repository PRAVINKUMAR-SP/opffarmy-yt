import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('yt_user');
        return saved ? JSON.parse(saved) : null;
    });

    const getAvatar = (name) => {
        return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=008cff,ff5c5c,ffd644,1cd760&fontFamily=ArialBold&fontSize=40`;
    };

    const register = async (name, email, password) => {
        try {
            const userSession = await api.register({ name, email, password });
            setUser(userSession);
            localStorage.setItem('yt_user', JSON.stringify(userSession));
            return userSession;
        } catch (err) {
            throw err;
        }
    };

    const loginWithCredentials = async (email, password) => {
        try {
            const userSession = await api.login({ email, password });
            setUser(userSession);
            localStorage.setItem('yt_user', JSON.stringify(userSession));
            return userSession;
        } catch (err) {
            throw err;
        }
    };

    const login = async (role = 'user') => {
        const demoEmail = role === 'admin' ? 'pravin007ptk@gmail.com' : 'user@demo.com';
        const demoPassword = role === 'admin' ? 'pravin007@' : 'password123';
        const demoName = role === 'admin' ? 'Pravin' : 'Guest User';

        try {
            // Try to login first
            let userSession;
            try {
                userSession = await api.login({ email: demoEmail, password: demoPassword });
            } catch (err) {
                // Only try to register if it's an "Invalid email or password" error (not found)
                // If it's a 400 error (bad request), something else is wrong
                if (err.message.includes('Invalid email or password')) {
                    userSession = await api.register({
                        name: demoName,
                        email: demoEmail,
                        password: demoPassword,
                        role: role
                    });
                } else {
                    throw err;
                }
            }
            setUser(userSession);
            localStorage.setItem('yt_user', JSON.stringify(userSession));
        } catch (err) {
            console.error('Demo Login Error:', err);
            // Absolute fallback to mock ONLY if API is totally unreachable or other errors occur
            const guestUser = {
                name: demoName,
                email: demoEmail,
                handle: role === 'admin' ? '@admin_demo' : `@guest_${Math.floor(Math.random() * 1000)}`,
                role: role,
                avatar: getAvatar(demoName)
            };
            setUser(guestUser);
            localStorage.setItem('yt_user', JSON.stringify(guestUser));
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('yt_user');
    };

    return (
        <UserContext.Provider value={{
            user,
            setUser,
            register,
            loginWithCredentials,
            login,
            logout,
            isAdmin: user?.role === 'admin'
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
