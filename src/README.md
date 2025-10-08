# TX Predictive Intelligence

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.x-blue.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.x-blue.svg)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive, production-ready React frontend for TX Predictive Intelligence - a sophisticated trading SaaS platform featuring real-time market data, advanced pattern detection, paper trading, backtesting, sentiment analysis, and risk management.

## 🚀 Features

### Core Trading Features
- **Real-time Market Data** - Live price feeds with WebSocket connections
- **Interactive Candlestick Charts** - Advanced charting with technical indicators
- **Pattern Detection** - Automated candlestick pattern recognition and alerts
- **Paper Trading** - Risk-free trading simulation with portfolio tracking
- **Market Scanning** - Real-time market screening and opportunity detection
- **Backtesting Engine** - Strategy testing with historical data analysis
- **Sentiment Analysis** - Market sentiment tracking and analysis
- **Risk Management** - Comprehensive portfolio risk assessment tools

### Technical Features
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Dark Theme** - Minimalist dark UI with sky blue accents
- **Real-time Updates** - Socket.IO integration for live data
- **Offline Support** - Comprehensive fallback system with mock data
- **Error Handling** - Robust error boundaries and user feedback
- **Performance Optimized** - Fast loading and smooth interactions

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS v4 with custom design system
- **Build Tool**: Vite for fast development and optimized builds
- **UI Components**: Shadcn/ui component library
- **Charts**: Recharts for data visualization
- **Real-time**: Socket.IO client for WebSocket connections
- **Routing**: React Router for navigation
- **State Management**: React hooks and context
- **Icons**: Lucide React for consistent iconography

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/tx-predictive-intelligence.git
cd tx-predictive-intelligence
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration
VITE_API_BASE=https://tx-predictive-intelligence.onrender.com
VITE_SOCKET_BASE=https://tx-predictive-intelligence.onrender.com
```

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:5173` to view the application.

### Production Build
```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── alerts/         # Alert and notification components
│   │   ├── charts/         # Chart and visualization components
│   │   ├── layout/         # Layout components (Navbar, etc.)
│   │   ├── modals/         # Modal dialog components
│   │   └── ui/             # Shadcn/ui component library
│   ├── lib/                # Utility libraries and configuration
│   │   ├── api-client.ts   # API client with 42+ endpoints
│   │   ├── socket.ts       # WebSocket connection manager
│   │   ├── config.ts       # Application configuration
│   │   ├── env-check.ts    # Environment validation
│   │   └── mock-data.ts    # Fallback mock data
│   ├── pages/              # Application pages/routes
│   │   ├── Dashboard.tsx   # Main dashboard overview
│   │   ├── Charts.tsx      # Advanced charting interface
│   │   ├── PaperTrading.tsx # Trading simulation
│   │   ├── ScanControl.tsx # Market scanning controls
│   │   ├── Backtesting.tsx # Strategy backtesting
│   │   ├── Sentiment.tsx   # Sentiment analysis
│   │   └── Risk.tsx        # Risk management
│   └── styles/
│       └── globals.css     # Global styles and Tailwind config
├── public/                 # Static assets
├── docs/                   # Documentation files
└── scripts/                # Utility scripts
```

## 🔧 Environment Configuration

The application requires these environment variables:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_BASE` | Backend API URL | `http://localhost:5000` | Yes |
| `VITE_SOCKET_BASE` | WebSocket server URL | `http://localhost:5000` | Yes |

### Environment Files
- `.env.example` - Template with all available variables
- `.env.local` - Local development overrides (gitignored)
- `.env.production` - Production environment variables

## 📱 Application Pages

### Dashboard
- Market overview with real-time data
- Alert notifications and pattern detection
- Portfolio performance metrics
- Quick access to all features

### Charts
- Interactive candlestick charts
- Technical indicator overlays
- Pattern recognition visualization
- Multi-timeframe analysis

### Paper Trading
- Virtual trading environment
- Portfolio tracking and management
- Trade history and performance
- Risk-free strategy testing

### Scan Control
- Real-time market scanning
- Pattern-based screening
- Custom scan configuration
- Alert management

### Backtesting
- Historical strategy testing
- Performance analytics
- Risk-adjusted returns
- Strategy optimization

### Sentiment Analysis
- Market sentiment tracking
- News sentiment analysis
- Social media sentiment
- Sentiment-based signals

### Risk Management
- Portfolio risk assessment
- Value at Risk (VaR) calculations
- Risk metrics and analytics
- Risk monitoring alerts

## 🔌 API Integration

The frontend integrates with a comprehensive Flask backend through:

- **42+ API Endpoints** - Complete coverage of all trading features
- **WebSocket Connections** - Real-time data streaming
- **Authentication** - Secure user authentication and authorization
- **Error Handling** - Comprehensive error handling and user feedback
- **Fallback System** - Mock data when backend is unavailable

### Key API Endpoints

#### Market Data
- `GET /api/market-scan?type=trending|volume` - Top instruments
- `GET /api/market/<symbol>` - Current price data
- `GET /api/candles` - OHLCV candlestick data

#### Pattern Detection
- `POST /api/detect-enhanced` - Enhanced pattern detection
- `GET /api/pattern-stats` - Pattern statistics
- `GET /api/patterns/list` - Available patterns

#### Trading & Portfolio
- `GET /api/paper-trades` - Paper trading history
- `POST /api/paper-trades` - Execute paper trade
- `POST /api/close-position` - Close trading position

#### Scanning & Alerts
- `POST /api/scan/start` - Start live scanning
- `POST /api/scan/stop` - Stop scanning
- `GET /api/scan/status` - Current scan status

#### Analytics & Backtesting
- `GET /api/analytics/summary` - Analytics overview
- `POST /api/backtest` - Run backtesting
- `GET /api/trading-stats` - Trading performance stats

## 🛡️ Error Handling & Reliability

- **Environment Validation** - Startup checks for required configuration
- **API Error Handling** - Graceful handling of network and API errors
- **Fallback Data** - Mock data system for offline development
- **Error Boundaries** - React error boundaries for component isolation
- **User Feedback** - Toast notifications and error states
- **Loading States** - Skeleton loaders and progress indicators

## 🎨 Design System

The application uses a custom design system built on Tailwind CSS:

- **Color Palette** - Dark theme with sky blue accents
- **Typography** - Consistent font sizing and weights
- **Spacing** - Harmonious spacing scale
- **Components** - Reusable UI components
- **Icons** - Lucide React icon library
- **Responsive** - Mobile-first responsive design

## ⚡ Performance

- **Fast Loading** - Optimized bundle sizes and code splitting
- **Efficient Rendering** - React optimization techniques
- **Caching** - Strategic caching of API responses
- **Lazy Loading** - Component and route-based lazy loading
- **Image Optimization** - Optimized asset delivery

## 🔒 Security

- **API Keys** - Never exposed to frontend (handled by backend)
- **CORS** - Configured on backend for allowed origins
- **Input Validation** - All user inputs validated and sanitized
- **Paper Trading** - No real money transactions possible

## 🚀 Deployment

### Vercel (Recommended)
1. Connect repository to Vercel
2. Set environment variables in dashboard
3. Deploy automatically on push

### Other Platforms
1. Build production bundle: `npm run build`
2. Serve `dist/` directory with any static host
3. Configure environment variables
4. Ensure API CORS settings allow frontend domain

## 📚 Documentation

- [`QUICK_START.md`](./QUICK_START.md) - Quick setup guide
- [`PROJECT_OVERVIEW.md`](./PROJECT_OVERVIEW.md) - Detailed project overview
- [`TROUBLESHOOTING.md`](./TROUBLESHOOTING.md) - Common issues and solutions
- [`ERRORS_FIXED.md`](./ERRORS_FIXED.md) - Development error log
- [`guidelines/Guidelines.md`](./guidelines/Guidelines.md) - Development guidelines

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - Frontend framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Shadcn/ui](https://ui.shadcn.com/) - Beautiful and accessible components
- [Recharts](https://recharts.org/) - Composable charting library
- [Lucide](https://lucide.dev/) - Beautiful icon library

## 📞 Support

For support and questions:
- Create an issue in this repository
- Check the [Troubleshooting Guide](./TROUBLESHOOTING.md)
- Review the [Documentation](./docs/)

---

**TX Predictive Intelligence** - Empowering traders with intelligent market analysis and predictive capabilities.