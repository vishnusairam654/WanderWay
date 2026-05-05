# 🌍 WanderWay — AI-Powered Travel Planner

> Plan smarter trips with interactive maps, AI recommendations, and real-time route visualization.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-ram654.dev-blue?style=for-the-badge)](https://ram654.dev)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## ✨ What It Does

WanderWay is a full-stack travel planning application that combines **interactive Mapbox maps**, an **AI chat assistant**, and a **clean drag-and-drop planner UI** — making it easy to plan and visualize multi-stop trips in minutes.

Whether you're mapping out a weekend road trip or a month-long backpacking route, WanderWay gives you the tools to plan it all in one place.

---

## 🚀 Key Features

| Feature | Description |
|---|---|
| 🗺️ **Interactive Trip Map** | Mapbox-powered map with route polylines and travel mode selection (driving, walking, cycling) |
| 🤖 **AI Chat Assistant** | Ask travel questions and get smart suggestions powered by Groq / Llama 3.3 (streamed via SSE) |
| 📍 **Geocoding Search** | Autocomplete location search using Mapbox Geocoding API |
| 🧭 **Trip Planner** | Add, reorder, and manage stops with a polished drag-and-drop interface |
| 🎨 **Custom MUI Theme** | Cohesive design system with a golden yellow, coral, and forest green palette |

---

## 🛠️ Tech Stack

**Frontend**
- Next.js 15 (App Router)
- Material UI (MUI v5) with custom theme
- Mapbox GL JS
- Fraunces + Plus Jakarta Sans fonts

**Backend / AI**
- Groq API (Llama 3.3) — streaming AI responses
- Server-Sent Events (SSE) for real-time output
- Next.js API Routes

**Dev Tools**
- TypeScript
- ESLint + Prettier
- Vercel (Deployment)

---

## 📸 Screenshots

<img width="1901" height="906" alt="Screenshot 2026-05-05 184834" src="https://github.com/user-attachments/assets/53b8d946-aae7-4e2e-84fa-fd6d83eaa8ad" />

---


https://github.com/user-attachments/assets/7d4fa720-d1c9-4464-9db4-2735aa50cdd4




---

## ⚙️ Getting Started

### Prerequisites
- Node.js 18+
- Mapbox API Key
- Groq API Key

### Installation

```bash
git clone https://github.com/vishnusairam654/wanderway.git
cd wanderway
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
GROQ_API_KEY=your_groq_api_key
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📂 Project Structure

```
wanderway/
├── app/
│   ├── api/          # AI chat & geocoding API routes
│   ├── components/   # Navbar, TripMap, Planner, ChatAssistant
│   └── theme/        # MUI custom theme config
├── public/
└── .env.local
```

---

## 👤 Author

**Vishnu Sai Ram**
- 🌐 [ram654.dev](https://ram654.dev)
- 💼 [LinkedIn](https://linkedin.com/in/vishnu654)
- 🐙 [GitHub](https://github.com/vishnusairam654)

---

> ⭐ If you found this project interesting, consider giving it a star!
