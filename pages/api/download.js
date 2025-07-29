import youtubedl from 'youtube-dl-exec';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

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
      ]
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
}
