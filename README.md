# OPFFARMY - YouTube Clone (Full Stack)

A premium, feature-rich YouTube clone built with React, Tailwind CSS, and Express.js. Designed for clean architecture and easy deployment to Vercel with MongoDB Atlas.

## ✨ Features

- **Responsive UI**: Custom dark theme with YouTube's exact color palette.
- **Video Player**: Custom-built HTML5 player with progress tracking and full-screen support.
- **Dynamic Content**: Category filtering, trending videos, and real-time search.
- **Social Features**: Interactive comment sections, likes/dislikes, and channel views.
- **Admin Panel**: Full statistics dashboard, video moderation, and category management.
- **Clean Backend**: Serverless-ready Express.js API with Mongoose and MongoDB Atlas integration.

## 🚀 Quick Start

### 1. Prerequisites
- Node.js installed.
- A MongoDB Atlas account (free tier works perfectly).

### 2. Database Setup
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Get your connection string.
3. Replace the `MONGODB_URI` in `backend/.env`.

### 3. Backend Setup
```bash
cd backend
npm install
npm run seed  # This will populate your database with 24 demo videos
npm run dev   # Starts on http://localhost:5000
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev   # Starts on http://localhost:3000
```

## 🌍 Deployment

This project is optimized for **Vercel**:

1. **Backend**: Push the `backend/` folder or the entire repo. Connect to Vercel, set the `MONGODB_URI` environment variable.
2. **Frontend**: Connect the `frontend/` folder. Vercel will automatically detect the Vite config and build it.

## 📁 Project Structure

- `frontend/`: React + Vite + Tailwind (Pages, Components, API utils)
- `backend/`: Express.js + Mongoose (Models, Routes, Seed script)
- `prisma/`: (Legacy) Previous SQLite setup.
