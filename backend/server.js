import express from 'express';
import cors from 'cors';
import youtubedl from 'youtube-dl-exec';

const app = express();
const PORT = process.env.PORT || 4000;

// Enable CORS for all origins (you can restrict this in production)
app.use(cors());
app.use(express.json());

// Endpoint to handle download requests
const cleanYoutubeUrl = (url) => {
  const videoIdMatch = url.match(/(?:https?):\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|music\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/);
  if (videoIdMatch && videoIdMatch[1]) {
    return `https://www.youtube.com/watch?v=${videoIdMatch[1]}`;
  }
  return url; // Return original url if no match
};

app.post('/api/download', async (req, res) => {
  const { url: originalUrl, type } = req.body;
  const url = cleanYoutubeUrl(originalUrl);

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
      geoBypass: true,
      forceIpV4: true
    });

    let downloadUrl = null;
    if (type === 'audio' && info.formats) {
      // Prefer m4a audio format
      const audioFormat = info.formats.find(f => f.ext === 'm4a' && f.acodec !== 'none' && f.vcodec === 'none' && f.url);
      downloadUrl = audioFormat ? audioFormat.url : info.formats.find(f => f.acodec !== 'none' && f.vcodec === 'none' && f.url)?.url;

    } else if (type === 'video' && info.formats) {
      // Prefer merged formats (video+audio) up to 720p as they are readily available
      const bestFormat = info.formats.find(f => f.format_note === '720p' && f.vcodec !== 'none' && f.acodec !== 'none' && f.url) ||
                         info.formats.find(f => f.format_note === '480p' && f.vcodec !== 'none' && f.acodec !== 'none' && f.url) ||
                         info.formats.find(f => f.format_note === '360p' && f.vcodec !== 'none' && f.acodec !== 'none' && f.url);

      downloadUrl = bestFormat ? bestFormat.url : info.url;
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
