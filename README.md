# 🎣 PhishAware

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animations-6633CC?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

**PhishAware** is a modern, full-stack phishing simulation and security awareness platform. Designed for academic and corporate security training, it enables administrators to create, manage, and track simulated phishing campaigns while providing immersive educational experiences for users.

---

## ✨ Features

### 🏢 Administrator Dashboard
- **Campaign Management**: Create and schedule phishing simulations with ease.
- **Micro-animated Analytics**: Real-time tracking of email deliveries, link clicks, and simulated data submissions using Framer Motion.
- **Participant Details**: View granular interaction logs for every simulation participant.

### 🛡️ Simulation Engine
- **Realistic Landing Pages**: Authentic-looking login simulations (e.g., corporate portals) to test user awareness.
- **Interaction Tracking**: Non-intrusive logging of user behavior (clicks/submissions) using Firebase Firestore.
- **Automatic Redirection**: Seamless flow from the "hook" to educational content.

### 🎓 Educational Content
- **Responsive Landing Pages**: Beautifully designed landing pages that explain the simulation to the user.
- **Learning Points**: Clear, actionable lists of common phishing indicators (Red Flags) to look for.
- **Interactive Quizzes**: Reinforce security knowledge immediately after a simulation.

### 🤖 AI Ethics Assistant
- **Genkit Integration**: Built-in AI assistant powered by Google Gemini to analyze application features for ethical compliance.
- **Compliance Check**: Ensures simulations avoid unethical practices like real credential harvesting or hidden background tracking.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Backend-as-a-Service**: [Firebase](https://firebase.google.com/) (Firestore, Authentication)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **AI/ML**: [Genkit AI](https://firebase.google.com/docs/genkit) (Google AI SDK)
- **Emails**: [Nodemailer](https://nodemailer.com/) (SMTP support)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 22+
- A Firebase Project
- An SMTP server (like Gmail App Passwords)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shreya28-ui/phishaware.git
   cd phishaware/src
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env.local` file in the root directory and populate it with your credentials (see `.env.example` for reference).

   ```bash
   cp .env.example .env.local
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:9002](http://localhost:9002) in your browser.

---

## 🏗️ Project Structure

```text
/src
  /app           # Next.js App Router (Pages & API routes)
  /components    # Reusable UI components (shadcn + custom)
  /ai            # Genkit AI flows and prompts
  /firebase      # Firebase configuration and custom hooks
  /hooks         # Shared React hooks (toast, mobile detection)
  /lib           # Utility functions, types, and constants
  /public        # Static assets
```

---

## 🔒 Security & Ethics

PhishAware is built with a **Security-First** and **Ethics-First** mindset:
- **No Real Harvesting**: The platform is explicitly designed to track *that* a submission happened without storing sensitive user credentials.
- **Awareness over Punishment**: Focuses on immediate education (post-click landing pages) rather than punitive measures.
- **Compliance**: Integrated AI analysis helps maintain ethical boundaries for academic simulations.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

*Built with ❤️ by the PhishAware Team*
