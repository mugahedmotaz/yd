import express from 'express';
import cors from 'cors';
import youtubedl from 'youtube-dl-exec';

const app = express();
const PORT = process.env.PORT || 4000;

// Enable CORS for all origins (you can restrict this in production)
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost and common development origins
    if (
      origin.startsWith('http://localhost') || 
      origin.startsWith('https://localhost') ||
      origin.startsWith('http://127.0.0.1') ||
      origin.startsWith('https://127.0.0.1') ||
      origin.includes('vercel.app') ||
      origin.includes('netlify.app')
    ) {
      return callback(null, true);
    }
    
    // For production, you might want to check against environment variables
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
    if (allowedOrigins.some(allowed => origin.includes(allowed))) {
      return callback(null, true);
    }
    
    // Reject the request
    callback(new Error('Not allowed by CORS'));
  }
}));
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'YouTube Downloader Backend is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});

// Endpoint to handle download requests
app.post('/api/download', async (req, res) => {
  const { url, type } = req.body;

  if (!url || typeof url !== 'string' || !url.startsWith('http')) {
    return res.status(400).json({ success: false, error: 'Invalid YouTube URL' });
  }

  try {
    const info = await youtubedl(url, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      addHeader: [
        'referer:youtube.com',
        'user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
      ],
      youtubeDl: 'yt-dlp' // استخدم yt-dlp بدل youtube-dl
    });

    let downloadUrl = null;
    if (type === 'audio' && info.formats) {
      const audioFormat = info.formats.find(f => f.acodec !== 'none' && f.vcodec === 'none' && f.url);
      if (audioFormat) downloadUrl = audioFormat.url;
    } else if (type === 'video' && info.formats) {
      // اختر أعلى جودة متاحة
      const bestFormat = info.formats.find(f => f.vcodec !== 'none' && f.acodec !== 'none' && f.url);
      if (bestFormat) downloadUrl = bestFormat.url;
    }

    if (!downloadUrl) {
      console.error('No valid download URL found', info);
      return res.status(500).json({ success: false, error: 'Could not extract download URL.' });
    }

    return res.json({ success: true, downloadUrl });
  } catch (e) {
    console.error('Error in /api/download:', e);
    return res.status(500).json({ success: false, error: String(e) });
  }
});

app.listen(PORT, () => {
  console.log(`YouTube Downloader backend running on http://localhost:${PORT}`);
});
