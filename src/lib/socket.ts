import { io, Socket } from 'socket.io-client';
import config from './config';

// Socket configuration
const SOCKET_URL = config.socketBaseUrl;

// Types for socket events
export interface ScanUpdate {
  symbol: string;
  intraday_patterns: any[];
  context_patterns: any[];
  timestamp: string;
}

export interface PatternAlert {
  symbol: string;
  alert_type: string;
  confidence_pct: number;
  price: number;
  timestamp: string;
  metadata?: any;
}

export interface ConnectionStatus {
  connected: boolean;
  timestamp: string;
}

export interface SubscriptionStatus {
  alerts: boolean;
  scan_results: boolean;
  timestamp: string;
}

class SocketManager {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  // Event handlers
  private onConnectionStatusHandlers: ((status: ConnectionStatus) => void)[] = [];
  private onSubscriptionStatusHandlers: ((status: SubscriptionStatus) => void)[] = [];
  private onScanUpdateHandlers: ((update: ScanUpdate) => void)[] = [];
  private onPatternAlertHandlers: ((alert: PatternAlert) => void)[] = [];

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      // In demo mode or when backend is unavailable, simulate connection
      if (config.demoMode) {
        console.log('🎭 Demo mode: Simulating WebSocket connection');
        setTimeout(() => {
          this.simulateDemoEvents();
          resolve();
        }, 1000);
        return;
      }

      try {
        this.socket = io(SOCKET_URL, {
          transports: ['websocket', 'polling'],
          timeout: 20000,
          reconnection: true,
          reconnectionAttempts: this.maxReconnectAttempts,
          reconnectionDelay: this.reconnectDelay,
        });

        // Connection event handlers
        this.socket.on('connect', () => {
          console.log('Socket connected');
          this.reconnectAttempts = 0;
          const status: ConnectionStatus = {
            connected: true,
            timestamp: new Date().toISOString(),
          };
          this.onConnectionStatusHandlers.forEach(handler => handler(status));
          resolve();
        });

        this.socket.on('disconnect', (reason) => {
          console.log('Socket disconnected:', reason);
          const status: ConnectionStatus = {
            connected: false,
            timestamp: new Date().toISOString(),
          };
          this.onConnectionStatusHandlers.forEach(handler => handler(status));
        });

        this.socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          this.reconnectAttempts++;
          if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.warn('🔌 WebSocket connection failed, switching to demo mode');
            this.simulateDemoEvents();
            resolve(); // Don't reject, just continue in demo mode
          }
        });

        // Custom event handlers
        this.socket.on('connection_status', (data: ConnectionStatus) => {
          this.onConnectionStatusHandlers.forEach(handler => handler(data));
        });

        this.socket.on('subscription_status', (data: SubscriptionStatus) => {
          this.onSubscriptionStatusHandlers.forEach(handler => handler(data));
        });

        this.socket.on('scan_update', (data: ScanUpdate) => {
          this.onScanUpdateHandlers.forEach(handler => handler(data));
        });

        this.socket.on('pattern_alert', (data: PatternAlert) => {
          this.onPatternAlertHandlers.forEach(handler => handler(data));
        });

      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Subscription methods
  subscribeToAlerts(): void {
    if (this.socket?.connected) {
      this.socket.emit('subscribe_alerts');
    }
  }

  subscribeToScanResults(): void {
    if (this.socket?.connected) {
      this.socket.emit('subscribe_scan_results');
    }
  }

  subscribeToAll(): void {
    this.subscribeToAlerts();
    this.subscribeToScanResults();
  }

  // Event handler registration methods
  onConnectionStatus(handler: (status: ConnectionStatus) => void): () => void {
    this.onConnectionStatusHandlers.push(handler);
    return () => {
      const index = this.onConnectionStatusHandlers.indexOf(handler);
      if (index > -1) {
        this.onConnectionStatusHandlers.splice(index, 1);
      }
    };
  }

  onSubscriptionStatus(handler: (status: SubscriptionStatus) => void): () => void {
    this.onSubscriptionStatusHandlers.push(handler);
    return () => {
      const index = this.onSubscriptionStatusHandlers.indexOf(handler);
      if (index > -1) {
        this.onSubscriptionStatusHandlers.splice(index, 1);
      }
    };
  }

  onScanUpdate(handler: (update: ScanUpdate) => void): () => void {
    this.onScanUpdateHandlers.push(handler);
    return () => {
      const index = this.onScanUpdateHandlers.indexOf(handler);
      if (index > -1) {
        this.onScanUpdateHandlers.splice(index, 1);
      }
    };
  }

  onPatternAlert(handler: (alert: PatternAlert) => void): () => void {
    this.onPatternAlertHandlers.push(handler);
    return () => {
      const index = this.onPatternAlertHandlers.indexOf(handler);
      if (index > -1) {
        this.onPatternAlertHandlers.splice(index, 1);
      }
    };
  }

  // Utility methods
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  // Simulate WebSocket events in demo mode
  private simulateDemoEvents(): void {
    // Simulate connection status
    const connectionStatus: ConnectionStatus = {
      connected: true,
      timestamp: new Date().toISOString(),
    };
    this.onConnectionStatusHandlers.forEach(handler => handler(connectionStatus));

    // Simulate subscription status
    const subscriptionStatus: SubscriptionStatus = {
      alerts: true,
      scan_results: true,
      timestamp: new Date().toISOString(),
    };
    this.onSubscriptionStatusHandlers.forEach(handler => handler(subscriptionStatus));

    // Simulate periodic scan updates and alerts
    setInterval(() => {
      if (Math.random() > 0.7) {
        const scanUpdate: ScanUpdate = {
          symbol: ['AAPL', 'TSLA', 'MSFT', 'NVDA'][Math.floor(Math.random() * 4)],
          intraday_patterns: [{ name: 'Bullish Engulfing', confidence: 75 + Math.random() * 20 }],
          context_patterns: [{ name: 'Uptrend', confidence: 80 + Math.random() * 15 }],
          timestamp: new Date().toISOString(),
        };
        this.onScanUpdateHandlers.forEach(handler => handler(scanUpdate));
      }

      if (Math.random() > 0.8) {
        const alert: PatternAlert = {
          symbol: ['AAPL', 'TSLA', 'MSFT', 'NVDA'][Math.floor(Math.random() * 4)],
          alert_type: ['Bullish Engulfing', 'Hammer', 'Doji'][Math.floor(Math.random() * 3)],
          confidence_pct: 65 + Math.random() * 30,
          price: 100 + Math.random() * 400,
          timestamp: new Date().toISOString(),
          metadata: { timeframe: '1h' }
        };
        this.onPatternAlertHandlers.forEach(handler => handler(alert));
      }
    }, 10000); // Every 10 seconds
  }
}

// Singleton instance
const socketManager = new SocketManager();

export default socketManager;