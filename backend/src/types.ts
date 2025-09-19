// --- Enums ---
export enum StockState {
  InStock = 'in',
  OutOfStock = 'out',
  Unknown = 'unknown',
}

// Fix: Add missing TrackedUrlStatus enum.
export enum TrackedUrlStatus {
  Ok = 'ok',
  Error = 'error',
  Pending = 'pending',
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