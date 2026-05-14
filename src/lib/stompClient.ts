import { Client, type IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const API_BASE_URL = rawApiBaseUrl
  ? rawApiBaseUrl.replace(/\/+$/, '')
  : '';
const rawWsBaseUrl = import.meta.env.VITE_WS_BASE_URL?.trim();
const WS_BASE_URL = rawWsBaseUrl
  ? rawWsBaseUrl.replace(/\/+$/, '')
  : API_BASE_URL;

type ConnectListener = () => void;


class StompClientManager {
  private client: Client;
  private static instance: StompClientManager | null = null;
  private connectListeners: Set<ConnectListener> = new Set();

  private constructor() {
    this.client = new Client({
      // Igual que REST: por defecto usa mismo origen para evitar bloqueos loopback en clientes remotos.
      webSocketFactory: () => new SockJS(`${WS_BASE_URL || ''}/ws`),
      reconnectDelay: 5_000,
      debug: import.meta.env.DEV ? (msg) => console.debug('[STOMP]', msg) : () => {},
    });

    // Despachar a todos los listeners registrados
    this.client.onConnect = () => {
      this.connectListeners.forEach((fn) => fn());
    };
  }

  static getInstance(): StompClientManager {
    if (!StompClientManager.instance) {
      StompClientManager.instance = new StompClientManager();
    }
    return StompClientManager.instance;
  }

  /** Activa la conexión STOMP */
  activate(): void {
    if (!this.client.active) {
      this.client.activate();
    }
  }

  /** Desactiva la conexión STOMP */
  deactivate(): void {
    if (this.client.active) {
      void this.client.deactivate();
    }
  }

  /** Registra un listener que se invoca al conectar. Devuelve función para desregistrar. */
  addConnectListener(listener: ConnectListener): () => void {
    this.connectListeners.add(listener);
    // Si ya está conectado, invocar inmediatamente
    if (this.client.connected) {
      listener();
    }
    return () => {
      this.connectListeners.delete(listener);
    };
  }

  /** Suscripción a un destino. Devuelve función de unsub. */
  subscribe(destination: string, callback: (message: IMessage) => void): () => void {
    const sub = this.client.subscribe(destination, callback);
    return () => sub.unsubscribe();
  }

  /** Publica un mensaje a un destino si la conexión está lista. */
  publish(destination: string, body: Record<string, unknown>): boolean {
    if (!this.client.connected) {
      if (import.meta.env.DEV) {
        console.warn('[STOMP] Publish skipped without active connection', destination);
      }
      return false;
    }

    this.client.publish({ destination, body: JSON.stringify(body) });
    return true;
  }

  /** Registra callback para errores de STOMP */
  onStompError(callback: (frame: { headers: Record<string, string>; body: string }) => void): void {
    this.client.onStompError = callback;
  }

  /** True si el cliente STOMP está conectado */
  get connected(): boolean {
    return this.client.connected;
  }
}

export const stompClient = StompClientManager.getInstance();
