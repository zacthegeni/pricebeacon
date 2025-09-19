import { StockState } from '../types';
import type { ExtractedProductInfo } from '../types';

/**
 * Parses product information from HTML content using a deterministic approach.
 * This version does not fall back to AI.
 * @param html The HTML content of the product page.
 * @param url The original URL of the page.
 * @returns The extracted product information.
 */
export const parseProductInfo = async (html: string, url: string): Promise<ExtractedProductInfo> => {
    console.log('[Extractor] Starting deterministic parsing...');
    
    // 1. Try to find structured data (JSON-LD) - Highest confidence
    try {
        const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
        if (jsonLdMatch && jsonLdMatch[1]) {
            const jsonData = JSON.parse(jsonLdMatch[1]);
            // Find the Product object in the JSON-LD data
            const productData = Array.isArray(jsonData['@graph']) 
                ? jsonData['@graph'].find((item: any) => item['@type'] === 'Product') 
                : (jsonData['@type'] === 'Product' ? jsonData : null);

            if (productData && productData.offers) {
                const offer = Array.isArray(productData.offers) ? productData.offers[0] : productData.offers;
                if(offer.price && offer.priceCurrency) {
                    console.log('[Extractor] Found product info in JSON-LD.');
                    return {
                        title: productData.name || 'Untitled',
                        price: parseFloat(offer.price),
                        currency: '£', // Map GBP to symbol
                        stockState: offer.availability?.includes('InStock') ? StockState.InStock : StockState.OutOfStock,
                        imageUrl: productData.image || '',
                        confidence: 0.95,
                        source: 'structured',
                    };
                }
            }
        }
    } catch (e) {
        console.warn('[Extractor] Could not parse JSON-LD data:', e);
    }
    
    // 2. Heuristics could be added here as a fallback (e.g., regex, cheerio scraping)
    console.log('[Extractor] Deterministic parsing failed. AI fallback is disabled.');

    // 3. Throw an error as the AI fallback has been removed.
    throw new Error("Could not find structured product data (JSON-LD) on the page. AI extraction is disabled.");
};