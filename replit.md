# UVify - Real-time UV Monitoring System

## Overview
UVify is a React-based frontend application for monitoring UV radiation levels in real-time. The application provides a beautiful dashboard for viewing current UV index readings, historical data, and safety recommendations.

## Project Architecture

### Technology Stack
- **Frontend Framework**: React 19.1.1 with React Router for navigation
- **Build Tool**: Vite 7.1.7 with HMR (Hot Module Replacement)
- **Styling**: Tailwind CSS 4.1.14 with custom gradients
- **Icons**: Lucide React
- **Backend API**: External service at https://uvify-backend.onrender.com

### Project Structure
\`\`\`
├── src/
│   ├── components/
│   │   └── UVGauge.jsx          # UV index gauge visualization
│   ├── pages/
│   │   ├── Dashboard.jsx        # Main dashboard layout with navigation
│   │   ├── Latest.jsx           # Current UV reading page
│   │   ├── History.jsx          # Historical UV data page
│   │   ├── Login.jsx            # Admin login page
│   │   ├── Profile.jsx          # User profile page
│   │   └── Settings.jsx         # Settings page
│   ├── App.jsx                  # Legacy app component
│   ├── main.jsx                 # App entry point with routing
│   └── index.css                # Global styles
├── public/
│   └── alert.mp3.wav            # UV alert sound
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind CSS configuration
└── package.json                 # Dependencies
\`\`\`

### Key Features
1. **Real-time UV Monitoring**: Displays current UV index with visual gauge and color-coded levels
2. **Historical Data**: Shows past UV readings in table format
3. **Safety Alerts**: Audio and visual alerts when UV index is high (≥6)
4. **User Authentication**: Admin login system with profile management
5. **Responsive Design**: Mobile-friendly interface with gradient backgrounds
6. **Auto-refresh**: Data updates every 5 seconds
7. **Connection Status**: Shows ESP32 device connection status

### UV Index Levels
- **0-2**: Low (Green)
- **3-5**: Moderate (Yellow)
- **6-7**: High (Orange)
- **8-10**: Very High (Red)
- **11+**: Extreme (Purple)

## Development Setup

### Environment Configuration
- **Port**: 5000 (required for Replit)
- **Host**: 0.0.0.0 (allows proxy connections)
- **HMR**: Configured for Replit's WebSocket proxy

### Running the Application
\`\`\`bash
npm run dev
\`\`\`
The app will be available at http://localhost:5000

### Build for Production
\`\`\`bash
npm run build
\`\`\`

## API Integration
The application connects to an external backend API for UV data:
- **Base URL**: https://uvify-backend.onrender.com
- **Endpoints**:
  - `GET /latest` - Get latest UV reading
  - `GET /history` - Get historical UV data
  - `POST /login` - Admin authentication
  - `POST /signup` - User registration
  - `GET /profile/:userId` - Get user profile
  - `PUT /profile/:userId` - Update user profile

## Recent Changes (October 11, 2025)
- ✅ Configured Vite for Replit environment (0.0.0.0:5000)
- ✅ Set up HMR with proper WebSocket configuration
- ✅ Created workflow for development server
- ✅ Added project documentation (replit.md)
- ✅ Configured deployment settings

## User Preferences
- No specific preferences recorded yet

## Deployment
The application is configured for deployment on Replit with autoscale for optimal performance.
