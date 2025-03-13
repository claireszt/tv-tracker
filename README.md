# 📺 TV Tracker

**TV Tracker** is a web application built with **Next.js** and **Prisma** that helps users track their watched TV episodes using data from **TheTVDB API**.

## 🚀 Features

### 📋 Watchlist Management

- ✅ **Add & Remove TV shows** to your watchlist
- ✅ **Track progress** with a percentage of watched episodes per show

### 🎬 Episode Tracking

- ✅ **Mark episodes as watched/unwatched**
- ✅ **Toggle episode status** directly from the episode list
- ✅ **Real-time progress bar updates** based on watched episodes

### 🔍 Search & Show Details

- ✅ **Search TV shows** using TheTVDB API
- ✅ **View detailed show pages** with synopsis, seasons, and episodes

### 🔐 Authentication & User Management

- ✅ **Sign up and login** with email & password
- ✅ **Session persistence** via NextAuth

## 🏗 Tech Stack

### ⚙️ Backend

- **Next.js** → API routes for server-side logic
- **Prisma ORM** → Database interactions
- **PostgreSQL** → Database (Neon for production, Docker for local dev)
- **NextAuth** → Authentication
- **Docker** → Containerized development and production environment

### 🎨 Frontend

- **React** → User Interface with Next.js
- **Tailwind CSS** → Styling framework

### 🚀 DevOps & CI/CD

- **Vercel** → Deployment and hosting
- **GitHub Actions** → Automated testing, building, and deployment
- **Prisma Migrations** → Auto-applies on deploy
