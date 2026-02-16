import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [isCCModalOpen, setIsCCModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const openUpload = () => setIsUploadModalOpen(true);
    const closeUpload = () => setIsUploadModalOpen(false);

    const openPost = () => setIsPostModalOpen(true);
    const closePost = () => setIsPostModalOpen(false);

    const openCC = () => setIsCCModalOpen(true);
    const closeCC = () => setIsCCModalOpen(false);

    const openLogin = () => setIsLoginModalOpen(true);
    const closeLogin = () => setIsLoginModalOpen(false);

    return (
        <ModalContext.Provider value={{
            isUploadModalOpen, openUpload, closeUpload,
            isPostModalOpen, openPost, closePost,
            isCCModalOpen, openCC, closeCC,
            isLoginModalOpen, setIsLoginModalOpen, openLogin, closeLogin
        }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModals = () => useContext(ModalContext);
