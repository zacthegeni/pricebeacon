import { fetchHtml } from './services/fetcher';
import { parseProductInfo } from './services/extractor';
import type { ScanResult } from './types';

/**
 * A server-side function to scan a single URL.
 * It fetches the HTML, extracts product information, and returns the result.
 */
export const scanUrl = async (url: string): Promise<ScanResult> => {
    try {
        console.log(`[API] Starting scan for: ${url}`);
        
        // 1. Fetch HTML from the URL
        const fetchResult = await fetchHtml(url);
        if (!fetchResult.success || !fetchResult.html) {
            return { success: false, error: fetchResult.error || "Failed to fetch HTML." };
        }

        console.log(`[API] HTML fetched successfully. Status: ${fetchResult.status}`);

        // 2. Parse the HTML to extract product info
        const extractedData = await parseProductInfo(fetchResult.html, url);

        console.log(`[API] Extraction complete. Confidence: ${extractedData.confidence}`);

        return {
            success: true,
            data: extractedData,
        };

    } catch (error) {
        console.error(`[API] Unexpected error during scan for ${url}:`, error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "An unknown error occurred.",
        };
    }
};
