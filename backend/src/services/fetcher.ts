
interface FetchResult {
    success: boolean;
    html?: string;
    status?: number;
    finalUrl?: string;
    error?: string;
}

// In a real application, this would not be stored here.
// It's placed here to keep the backend self-contained for the demo.
const MOCK_HTML_CURRYS = `
<!DOCTYPE html>
<html>
<head>
    <title>Microsoft 13" Surface Laptop Copilot+ PC - Snapdragon X Plus, 256 GB SSD, Platinum | Currys</title>
    <script type="application/ld+json">
    {
      "@context": "http://schema.org/",
      "@type": "Product",
      "name": "Microsoft 13\\" Surface Laptop Copilot+ PC - Snapdragon X Plus, 256 GB SSD, Platinum",
      "image": "https://media.currys.biz/i/currysprod/10280114.jpg",
      "description": "This Microsoft Surface Laptop is a Copilot+ PC - that means it's built for AI.",
      "sku": "10280114",
      "offers": {
        "@type": "Offer",
        "priceCurrency": "GBP",
        "price": "1049.00",
        "availability": "http://schema.org/InStock",
        "url": "https://www.currys.co.uk/products/microsoft-13-surface-laptop-copilot-pc-snapdragon-x-plus-256-gb-ssd-platinum-10280114.html"
      }
    }
    </script>
</head>
<body>
    <div class="product-price">
        <span class="price-value">£1,049.00</span>
    </div>
    <button class="add-to-basket">Add to basket</button>
</body>
</html>
`;


/**
 * Simulates fetching the HTML content of a URL from the server.
 * In a real application, this would use a library like 'node-fetch' or 'axios'
 * with proper error handling, timeouts, and user-agent rotation.
 * @param url The URL to fetch.
 * @returns A promise that resolves with the fetch result.
 */
export const fetchHtml = async (url: string): Promise<FetchResult> => {
    console.log(`[Fetcher] Simulating fetch for: ${url}`);
    
    // For demonstration, we'll use a hardcoded HTML for the specific Currys URL.
    if (url.includes('currys.co.uk')) {
        return new Promise(resolve => {
            setTimeout(() => {
                console.log('[Fetcher] Returning mock HTML for Currys.');
                resolve({
                    success: true,
                    html: MOCK_HTML_CURRYS,
                    status: 200,
                    finalUrl: url,
                });
            }, 1500); // Simulate network latency
        });
    }

    // For any other URL, simulate a failure.
    return Promise.resolve({
        success: false,
        error: "URL not whitelisted for mock fetching. Only the Currys.co.uk link is supported in this demo.",
        status: 404,
    });
};
