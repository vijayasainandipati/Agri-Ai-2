# AgriAI - AI-Powered Agricultural Solutions

A comprehensive web application providing AI-powered solutions for modern agriculture, including crop information, disease detection, weather alerts, and more.

## Features

- 🌱 **Crop Information System** - Detailed database of crops with growing guides
- 🔍 **Disease Detection** - AI-powered plant disease identification
- 🌤️ **Weather & Irrigation Alerts** - Real-time weather monitoring and irrigation recommendations
- 💰 **Subsidies & Loans** - Government scheme information and applications
- 📈 **Market Price Predictor** - Price trend analysis and selling recommendations
- 🤖 **Kisan Voice Assistant** - Multilingual farming assistant
- 📰 **Agricultural News** - Latest updates in agriculture
- 🌾 **Crop Suggestions** - AI-powered crop recommendations based on location

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **AI Integration**: Google AI (Genkit)
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project setup

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vijayasainandipati/Agri-Ai-2.git
   cd Agri-Ai-2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   GOOGLE_AI_API_KEY=your_google_ai_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:9002](http://localhost:9002)

## Project Structure

```
src/
├── ai/                    # AI flows and configurations
├── app/                   # Next.js app router pages
├── components/            # Reusable UI components
├── context/              # React context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
└── public/               # Static assets
```

## Available Scripts

- `npm run dev` - Start development server on port 9002
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Vijaya Sai Nandipati**
- GitHub: [@vijayasainandipati](https://github.com/vijayasainandipati)

## Acknowledgments

- Next.js team for the amazing framework
- Firebase for backend services
- Google AI for AI capabilities
- Tailwind CSS for styling utilities
- Radix UI for accessible components

---

© 2025 Vijaya Sai Nandipati. All rights reserved. 