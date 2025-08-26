# WellnessTracker

A comprehensive wellness tracking app built with React and Tailwind CSS. Track daily activities, monitor progress, and build healthy habits.

## 🚀 Features

- Mock authentication with localStorage persistence
- Interactive dashboard with charts and metrics
- CRUD operations for wellness entries
- Data visualization with Recharts
- Dark/Light mode with system preference detection
- Responsive mobile-first design
- CSV export functionality
- Offline local storage

## 📋 Prerequisites

- Node.js 14.0+
- npm or yarn

## 🛠 Installation

```bash
mkdir wellness-tracker && cd wellness-tracker
npm init -y
npm install react react-dom react-scripts recharts lucide-react
npm install -D tailwindcss autoprefixer postcss
npx tailwindcss init -p
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── lib/                # Auth, storage, and mock data
├── routes/             # Page components
├── App.jsx
└── index.js
```

## 🎯 Quick Start

```bash
npm run dev
```

Demo account: `demo@wellness.com` / `demo123`

## 📊 Usage

- **Add entries**: Track steps, sleep hours, mood, and notes
- **View progress**: Dashboard with charts and summary cards
- **Manage data**: Edit, delete, export, and filter entries

## 🚀 Deployment

```bash
npm run build
```

Deploy the `build/` folder to any static hosting service.

## 📝 License

MIT License

Happy Wellness Tracking! 🌟