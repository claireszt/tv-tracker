# 📺 TV Tracker

**TV Tracker** is a web application built with **Next.js** and **Prisma** that helps users track their watched TV episodes using data from **TheTVDB API**.

## 🚀 Features

## 🏗 Tech Stack

### ⚙️ Backend

- **Next.js** → API routes for server-side logic
- **Prisma ORM** → Database interactions
- **PostgreSQL** → Database
- **Docker** → Containerized development and production environment

### 🎨 Frontend

- **React** → User Interface with Next.js
- **Tailwind CSS** → Styling framework

### 🚀 DevOps & CI/CD

- **GitHub Actions** → Automated testing, building, and deployment
- **Husky & Commitlint** → Enforced commit message standards

## 🛠 Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/tv-tracker.git
cd tv-tracker
```

### 2️⃣ Set Up Environment Variables

Create a `.env` file with your database URL and API key:

```env
DATABASE_URL="your-database-url"
NEXT_PUBLIC_TVDB_API_KEY="your-tvdb-api-key"
```

### 3️⃣ Start the Application

```bash
docker-compose up --build
```

### 4️⃣ Apply Prisma Migrations

```bash
npx prisma migrate dev --name init
```

Visit `http://localhost:3000` to view the app.

## 📄 License

MIT License © 2025 Claire
