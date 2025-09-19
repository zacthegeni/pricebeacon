import express from 'express';
// Fix: Use a standard ES module import for 'cors'. The 'import = require' syntax is not allowed when targeting ECMAScript modules and was causing type errors with Express.
import cors from 'cors';
import 'dotenv/config';
// Fix: Use require for PrismaClient to bypass potential TypeScript module resolution issues.
const { PrismaClient } = require('@prisma/client');
import { scanUrl } from './api';
import { StockState, TrackedUrlStatus } from './types';

const app: express.Application = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3001;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('PriceBeacon Backend is running!');
});

app.post('/api/scan-url', async (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ success: false, error: 'URL is required' });
  }

  try {
    const result = await scanUrl(url);
    if (!result.success) {
      return res.status(200).json(result);
    }
    res.status(200).json(result);
  } catch (error) {
    console.error(`[Express] Unhandled error for POST /api/scan-url:`, error);
    res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'An internal server error occurred' 
    });
  }
});

// --- Real Database Endpoints ---

app.get('/api/projects', async (req, res) => {
  try {
    const projects = await prisma.project.findMany();
    res.json(projects);
  } catch (error) {
     console.error(`[Express] Error fetching projects:`, error);
     res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

app.get('/api/projects/:projectId/urls', async (req, res) => {
  const { projectId } = req.params;
  try {
    const urls = await prisma.trackedUrl.findMany({
      where: { projectId },
    });
    res.json(urls);
  } catch (error) {
      console.error(`[Express] Error fetching URLs for project ${projectId}:`, error);
      res.status(500).json({ error: 'Failed to fetch URLs' });
  }
});

app.post('/api/urls', async (req, res) => {
  const { urls, projectId } = req.body;
  if (!urls || !Array.isArray(urls) || !projectId) {
      return res.status(400).json({ error: 'Invalid request body' });
  }
  
  try {
    const newTrackedUrlsData = urls.map((url: string) => ({
      id: `url_${Math.random().toString(36).substr(2, 9)}`,
      projectId,
      url,
      title: 'New Imported URL',
      currency: '?',
      lastPrice: 0,
      stockState: StockState.Unknown,
      lastSeenAt: new Date(),
      status: TrackedUrlStatus.Pending,
    }));
    
    await prisma.trackedUrl.createMany({
        data: newTrackedUrlsData
    });
    
    res.status(201).json(newTrackedUrlsData);

  } catch (error) {
      console.error(`[Express] Error creating URLs for project ${projectId}:`, error);
      res.status(500).json({ error: 'Failed to import URLs' });
  }
});


app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});