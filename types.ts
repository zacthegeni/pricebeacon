export enum StockState {
  InStock = 'in',
  OutOfStock = 'out',
  Unknown = 'unknown',
}

export enum TrackedUrlStatus {
  Ok = 'ok',
  Error = 'error',
  Pending = 'pending',
}

export interface Project {
  id: string;
  name: string;
  domain: string;
}

export interface User {
  name: string;
  email: string;
  initial: string;
}

export interface Observation {
  observedAt: string;
  price: number;
  stockState: StockState;
}

export interface TrackedUrl {
  id: string;
  projectId: string;
  url: string;
  title: string;
  currency: string;
  lastPrice: number;
  wasPrice?: number;
  stockState: StockState;
  lastSeenAt: string;
  priceHistory: Observation[];
  thumbnailUrl?: string;
  priceChange?: number; // percentage change
  parseConfidence?: number; // 0 to 1
  status: TrackedUrlStatus;
  tags?: string[];
  httpStatus?: number;
}

// --- Shared API Types ---

export interface ExtractedProductInfo {
    title: string;
    price: number;
    currency: string;
    stockState: StockState;
    imageUrl: string;
    confidence: number;
    source: 'structured' | 'heuristic' | 'ai';
}

export interface ScanResult {
    success: boolean;
    data?: ExtractedProductInfo;
    error?: string;
}
