// Fix: The triple-slash reference directive must be at the very top of the file for the TypeScript compiler to correctly load Node.js types. This resolves errors with 'process.exit' and missing node type definitions.
/// <reference types="node" />

// Fix: Import PrismaClient from @prisma/client, and enums from the shared types file for consistency with the rest of the backend.
// Fix: Use require for PrismaClient to bypass potential TypeScript module resolution issues.
const { PrismaClient } = require('@prisma/client');
import { StockState, TrackedUrlStatus } from '../src/types';

const prisma = new PrismaClient();

const MOCK_PROJECTS_DATA = [
  { id: 'proj_1', name: 'Fashion Retail Watch', domain: 'example-competitor.com' },
  { id: 'proj_2', name: 'Electronics Tracker', domain: 'tech-rival.co.uk' },
];

const MOCK_TRACKED_URLS_DATA = [
  {
    id: 'url_1',
    projectId: 'proj_1',
    url: 'https://example-competitor.com/products/classic-t-shirt',
    title: 'Classic Cotton T-Shirt',
    currency: '£',
    lastPrice: 24.99,
    wasPrice: 29.99,
    stockState: StockState.InStock,
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
    thumbnailUrl: 'https://placehold.co/40x40/e2e8f0/475569?text=👢',
    priceChange: 3.45,
    parseConfidence: 0.75,
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
    thumbnailUrl: 'https://placehold.co/40x40/e2e8f0/475569?text=🧣',
    priceChange: -28.89,
    parseConfidence: 0.82,
    status: TrackedUrlStatus.Error,
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
    thumbnailUrl: 'https://placehold.co/40x40/e0f2fe/0891b2?text=⌚',
    priceChange: 1.5,
    parseConfidence: 0.65,
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
    thumbnailUrl: 'https://placehold.co/40x40/e0f2fe/0891b2?text=💻',
    priceChange: 0,
    parseConfidence: 0,
    status: TrackedUrlStatus.Pending,
    tags: ['New Release', 'Laptop'],
  },
];


async function main() {
  console.log('Start seeding...');

  // Clean up existing data
  await prisma.trackedUrl.deleteMany();
  await prisma.project.deleteMany();
  console.log('Deleted existing data.');

  // Create projects
  for (const projectData of MOCK_PROJECTS_DATA) {
    await prisma.project.create({
      data: projectData,
    });
  }
  console.log(`Created ${MOCK_PROJECTS_DATA.length} projects.`);

  // Create tracked URLs
  for (const urlData of MOCK_TRACKED_URLS_DATA) {
    await prisma.trackedUrl.create({
      data: {
        ...urlData,
        lastSeenAt: new Date()
      },
    });
  }
  console.log(`Created ${MOCK_TRACKED_URLS_DATA.length} tracked URLs.`);
  
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });