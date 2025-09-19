import type { Project, TrackedUrl } from './types';
import { StockState, TrackedUrlStatus } from './types';

export const MOCK_PROJECTS: Project[] = [
  { id: 'proj_1', name: 'Fashion Retail Watch', domain: 'example-competitor.com' },
  { id: 'proj_2', name: 'Electronics Tracker', domain: 'tech-rival.co.uk' },
];

const generatePriceHistory = (basePrice: number, days: number): { observedAt: string; price: number; stockState: StockState }[] => {
  const history = [];
  let currentPrice = basePrice;
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    if (i < 28 && Math.random() > 0.85) { // Change price less frequently
      const changePercent = (Math.random() - 0.4) * 0.15; // -4% to +6%
      currentPrice = parseFloat((currentPrice * (1 + changePercent)).toFixed(2));
    }
    
    const stockState = Math.random() > 0.2 ? StockState.InStock : StockState.OutOfStock;

    history.push({
      observedAt: date.toISOString(),
      price: currentPrice,
      stockState,
    });
  }
  return history;
};

// Added to simulate fetching the real page content
export const MOCK_HTML_CURRYS = `
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


export const MOCK_TRACKED_URLS: TrackedUrl[] = [
  {
    id: 'url_1',
    projectId: 'proj_1',
    url: 'https://example-competitor.com/products/classic-t-shirt',
    title: 'Classic Cotton T-Shirt',
    currency: '£',
    lastPrice: 24.99,
    wasPrice: 29.99,
    stockState: StockState.InStock,
    lastSeenAt: new Date().toISOString(),
    priceHistory: generatePriceHistory(29.99, 30),
    thumbnailUrl: 'https://placehold.co/40x40/e2e8f0/475569?text=👕',
    priceChange: -16.67,
    parseConfidence: 0.98,
    status: TrackedUrlStatus.Ok,
    tags: ['Hero', 'Top Seller'],
  },
  {
    id: 'url_2',
    projectId: 'proj_1',
    url: 'https://example-competitor.com/products/slim-fit-jeans',
    title: 'Slim Fit Denim Jeans',
    currency: '£',
    lastPrice: 75.00,
    stockState: StockState.InStock,
    lastSeenAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    priceHistory: generatePriceHistory(75.00, 30),
    thumbnailUrl: 'https://placehold.co/40x40/e2e8f0/475569?text=👖',
    priceChange: 0,
    parseConfidence: 0.95,
    status: TrackedUrlStatus.Ok,
    tags: ['Core'],
  },
  {
    id: 'url_3',
    projectId: 'proj_1',
    url: 'https://example-competitor.com/products/leather-boots',
    title: 'Artisan Leather Boots',
    currency: '£',
    lastPrice: 165.00,
    stockState: StockState.OutOfStock,
    lastSeenAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    priceHistory: generatePriceHistory(159.50, 30),
    thumbnailUrl: 'https://placehold.co/40x40/e2e8f0/475569?text=👢',
    priceChange: 3.45,
    parseConfidence: 0.75, // Low confidence example
    status: TrackedUrlStatus.Ok,
    tags: ['High Margin'],
  },
  {
    id: 'url_4',
    projectId: 'proj_1',
    url: 'https://example-competitor.com/products/wool-scarf--final-sale',
    title: 'Merino Wool Scarf (Final Sale)',
    currency: '£',
    lastPrice: 32.00,
    stockState: StockState.InStock,
    lastSeenAt: new Date().toISOString(),
    priceHistory: generatePriceHistory(45.00, 30),
    thumbnailUrl: 'https://placehold.co/40x40/e2e8f0/475569?text=🧣',
    priceChange: -28.89,
    parseConfidence: 0.82,
    status: TrackedUrlStatus.Error, // Error example
    tags: ['MAP', 'Sale'],
  },
  {
    id: 'url_5',
    projectId: 'proj_2',
    url: 'https://tech-rival.co.uk/products/xyz-phone-15-pro',
    title: 'XYZ Phone 15 Pro',
    currency: '£',
    lastPrice: 999.00,
    stockState: StockState.InStock,
    lastSeenAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    priceHistory: generatePriceHistory(999.00, 30),
    thumbnailUrl: 'https://placehold.co/40x40/e0f2fe/0891b2?text=📱',
    priceChange: 0,
    parseConfidence: 0.99,
    status: TrackedUrlStatus.Ok,
    tags: ['Hero', 'Bundle'],
  },
  {
    id: 'url_6',
    projectId: 'proj_2',
    url: 'https://tech-rival.co.uk/products/noise-cancelling-headphones-x2',
    title: 'Noise Cancelling Headphones X2',
    currency: '£',
    lastPrice: 249.00,
    wasPrice: 279.00,
    stockState: StockState.InStock,
    lastSeenAt: new Date().toISOString(),
    priceHistory: generatePriceHistory(279.00, 30),
    thumbnailUrl: 'https://placehold.co/40x40/e0f2fe/0891b2?text=🎧',
    priceChange: -10.75,
    parseConfidence: 0.96,
    status: TrackedUrlStatus.Ok,
  },
  {
    id: 'url_7',
    projectId: 'proj_2',
    url: 'https://tech-rival.co.uk/products/smart-watch-gen-5',
    title: 'Smart Watch Gen 5',
    currency: '£',
    lastPrice: 349.00,
    stockState: StockState.Unknown,
    lastSeenAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    priceHistory: generatePriceHistory(349.00, 30),
    thumbnailUrl: 'https://placehold.co/40x40/e0f2fe/0891b2?text=⌚',
    priceChange: 1.5,
    parseConfidence: 0.65, // Low confidence example
    status: TrackedUrlStatus.Ok,
    tags: ['New'],
  },
  {
    id: 'url_8',
    projectId: 'proj_2',
    url: 'https://www.currys.co.uk/products/microsoft-13-surface-laptop-copilot-pc-snapdragon-x-plus-256-gb-ssd-platinum-10280114.html',
    title: 'Microsoft 13" Surface Laptop Copilot+ PC',
    currency: '?',
    lastPrice: 0,
    stockState: StockState.Unknown,
    lastSeenAt: new Date().toISOString(),
    priceHistory: [],
    thumbnailUrl: 'https://placehold.co/40x40/e0f2fe/0891b2?text=💻',
    priceChange: 0,
    parseConfidence: 0,
    status: TrackedUrlStatus.Pending,
    tags: ['New Release', 'Laptop'],
  },
];
