import express from 'express';
import cors from 'cors';
import youtubedl from 'youtube-dl-exec';

const app = express();
// Use Render's PORT environment variable or default to 4000
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
  console.log('=== NEW REQUEST ===');
  console.log('Request body:', req.body);
  
  const { url, type } = req.body;
  
  console.log('Extracted URL:', url);
  console.log('Extracted type:', type);

  if (!url || typeof url !== 'string' || !url.startsWith('http')) {
    console.log('Invalid URL provided:', url);
    return res.status(400).json({ success: false, error: 'Invalid YouTube URL' });
  }

  try {
    console.log('Starting youtube-dl-exec...');
    console.log('URL to process:', url);
    
    const info = await youtubedl(url, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true
    });
    
    console.log('youtube-dl-exec completed successfully');
    console.log('Info received:', !!info);
    console.log('Info title:', info?.title || 'No title');

    // Check if the video is available
    if (!info || !info.title) {
      console.log('Video not found or not available');
      return res.status(404).json({ success: false, error: 'Video not found or not available' });
    }

    console.log('Video title:', info.title);
    console.log('Available formats:', info.formats ? info.formats.length : 'No formats');

    let downloadUrl = null;
    if (type === 'audio' && info.formats) {
      console.log('Looking for audio format...');
      const audioFormat = info.formats.find(f => f.acodec !== 'none' && f.vcodec === 'none' && f.url);
      if (audioFormat) {
        downloadUrl = audioFormat.url;
        console.log('Audio format found:', audioFormat.format_id);
      } else {
        console.log('No audio format found');
      }
    } else if (type === 'video' && info.formats) {
      console.log('Looking for video format...');
      // اختر أعلى جودة متاحة
      const bestFormat = info.formats.find(f => f.vcodec !== 'none' && f.acodec !== 'none' && f.url);
      if (bestFormat) {
        downloadUrl = bestFormat.url;
        console.log('Video format found:', bestFormat.format_id);
      } else {
        console.log('No video format found');
      }
    }

    if (!downloadUrl) {
      console.error('No valid download URL found');
      console.log('Available format types:', info.formats?.map(f => ({ id: f.format_id, acodec: f.acodec, vcodec: f.vcodec })).slice(0, 5));
      return res.status(500).json({ success: false, error: 'Could not extract download URL.' });
    }

    console.log('Download URL extracted successfully');
    return res.json({ success: true, downloadUrl });
  } catch (e) {
    console.error('=== ERROR OCCURRED ===');
    console.error('Error message:', e.message);
    console.error('Error stack:', e.stack);
    console.error('Error type:', e.constructor.name);
    
    // Handle specific youtube-dl errors
    if (e.message && (e.message.includes('This content isn\'t available') || e.message.includes("This content isn't available"))) {
      console.log('Returning 404: Content not available');
      return res.status(404).json({ success: false, error: 'هذا المحتوى غير متاح على YouTube. جرب رابط فيديو آخر.' });
    }
    
    if (e.message && e.message.includes('Video unavailable')) {
      console.log('Returning 404: Video unavailable');
      return res.status(404).json({ success: false, error: 'الفيديو غير متاح. جرب رابط آخر.' });
    }
    
    if (e.message && e.message.includes('Private video')) {
      console.log('Returning 404: Private video');
      return res.status(404).json({ success: false, error: 'هذا فيديو خاص. جرب رابط فيديو عام.' });
    }
    
    if (e.message && e.message.includes('age-restricted')) {
      console.log('Returning 404: Age restricted');
      return res.status(404).json({ success: false, error: 'هذا الفيديو مقيد بالعمر. جرب رابط آخر.' });
    }
    
    if (e.message && e.message.includes('spawn')) {
      console.log('Returning 500: Spawn error (youtube-dl not found)');
      return res.status(500).json({ success: false, error: 'YouTube downloader service is not available on this server' });
    }
    
    // Handle EACCES permission errors
    if (e.message && e.message.includes('EACCES')) {
      console.log('Returning 500: Permission error');
      return res.status(500).json({ success: false, error: 'Server does not have permission to access YouTube downloader' });
    }
    
    // Handle ENOENT errors (file not found)
    if (e.message && e.message.includes('ENOENT')) {
      console.log('Returning 500: File not found error');
      return res.status(500).json({ success: false, error: 'Required downloader components are missing on server' });
    }
    
    console.log('Returning 500: General error');
    return res.status(500).json({ success: false, error: 'حدث خطأ أثناء معالجة طلبك. تأكد من أن الرابط صحيح وجرب مرة أخرى.' });
  }
});

app.listen(PORT, () => {
  console.log(`YouTube Downloader backend running on http://localhost:${PORT}`);
});
