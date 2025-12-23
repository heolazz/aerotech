export enum DroneCategory {
  PHOTOGRAPHY = 'Photography',
  AGRICULTURE = 'Agriculture',
  RACING = 'Racing',
  INDUSTRIAL = 'Industrial'
}

export interface Drone {
  id: string;
  name: string;
  category: DroneCategory;
  price: number;
  image: string;
  description: string;
  specs: {
    range: string;
    battery: string;
    camera: string;
    weight?: string;
    dimensions?: string;
    flightController?: string;
  };
}

export enum OrderStatus {
  PENDING = 'Menunggu Konfirmasi',
  PROCESSING = 'Sedang Diproses',
  SHIPPED = 'Dalam Pengiriman',
  DELIVERED = 'Terkirim',
  CANCELLED = 'Dibatalkan'
}

export interface Order {
  id: string;
  customerName: string;
  items: Array<{
    droneId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: OrderStatus;
  date: string;
  type: 'CATALOG' | 'CUSTOM';
  customDetails?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}