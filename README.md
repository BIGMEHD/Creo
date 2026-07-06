# Creo 🎥

Creo is a modern, bilingual (**English/Persian**), offline-first YouTube Channel Management dashboard. It is designed to streamline a creator's workflow from raw inspiration to published videos. 

Created by **BigmehD**, this tool provides everything an active creator needs to manage their channel's growth, scripts, schedule, and ideas in a sleek, highly polished, dark-mode/light-mode cohesive design.

🔗 **Visit the creator's YouTube Channel**: [BigmehD-XD on YouTube](https://youtube.com/@BigmehD-XD)

---

## ✨ Features

- **💡 Idea Vault**: Capture raw ideas, write hooks, set priorities, and link related scripts or reference URLs.
- **📝 Script Writer**: A full-featured editor designed for scriptwriting. Organize content into Hook, Intro, Main Points, CTA, and Outro. Features automated word count and estimated video runtime estimators.
- **📊 Channel Analytics**: High-fidelity dashboard visualizing subscriber growth, views, watch time, and revenue. Track target metrics and evaluate individual video performance.
- **📅 Content Calendar**: Interactive scheduling board that tracks videos through custom creation stages (`Idea`, `Scripting`, `Ready to Film`, `Filmed`, `Editing`, and `Published`).
- **🎯 Goal Tracker**: Set and monitor customized milestones across Subscribers, Upload Frequency, and Revenue. Includes persistent streak counters to motivate daily production habits.
- **🌍 Full Bilingual Localization**: Instant, fluid layout and vocabulary translation between English (LTR) and Persian/Farsi (RTL) systems.
- **🔒 Offline-First & Privacy Preserving**: Zero external server database dependencies. All custom content, ideas, scripts, and logs are persisted instantly and securely in your browser's standard Local Storage.

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State & Storage**: [Zustand](https://github.com/pmndrs/zustand) with offline `persist` storage middleware
- **Animations**: [Motion](https://motion.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Quick Start

Follow these simple steps to run the project locally:

### 1. Clone the repository
```bash
git clone https://github.com/BigmehD-XD/creo.git
cd creo
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```
The server will start locally on `http://localhost:3000`.

### 4. Build for Production
To generate optimized static assets for deployment:
```bash
npm run build
```
The production bundle will be placed inside the `dist/` folder.

---

## 💎 Design Concept
Creo utilizes a sleek, dark slate and minimal light-gray layout. The typography centers around clean display sans-serifs, custom card containers, precise layout margins, and a gorgeous, responsive player-inspired vector logo in **Creator Red** representing modern digital production.

---

## 👤 Created By
This project is created and maintained by **[BigmehD](https://youtube.com/@BigmehD-XD)**. Feel free to explore, customize, and subscribe for tech-forward videos and creator deep-dives!
