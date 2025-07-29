import React, { useState, useEffect } from 'react';
import { Download, Youtube, Music, Video, Loader2, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import Logo from './logo-01.svg';
interface DownloadResponse {
  success: boolean;
  downloadUrl?: string;
  message?: string;
  error?: string;
}

interface VideoFormat {
  quality: string;
  resolution: string;
  filesize?: number;
  url: string;
}

interface VideoInfoResponse {
  success: boolean;
  title?: string;
  thumbnail?: string;
  duration?: number;
  videoFormats?: VideoFormat[];
  error?: string;
}

function App() {
  const [url, setUrl] = useState('');
  const [downloadType, setDownloadType] = useState<'video' | 'audio'>('video');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<DownloadResponse | null>(null);
  const [urlError, setUrlError] = useState('');
  const [quality, setQuality] = useState('720');
  const [videoInfo, setVideoInfo] = useState<VideoInfoResponse | null>(null);
  const [isFetchingInfo, setIsFetchingInfo] = useState(false);

  const qualityOptions = [
    { value: '144', label: '144p' },
    { value: '240', label: '240p' },
    { value: '360', label: '360p' },
    { value: '480', label: '480p' },
    { value: '720', label: '720p (HD)' },
    { value: '1080', label: '1080p (Full HD)' },
    { value: 'best', label: 'أعلى جودة متاحة' },
  ];

  const validateYouTubeUrl = (url: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)[a-zA-Z0-9_-]{11}.*$/;
    return youtubeRegex.test(url);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    setUrlError('');
    setResponse(null);
    setVideoInfo(null);
    
    if (newUrl && !validateYouTubeUrl(newUrl)) {
      setUrlError('Please enter a valid YouTube URL');
      return;
    }
    
    // If URL is valid, fetch video info
    if (newUrl && validateYouTubeUrl(newUrl)) {
      fetchVideoInfo(newUrl);
    }
  };
  
  const fetchVideoInfo = async (videoUrl: string) => {
    setIsFetchingInfo(true);
    try {
      const res = await fetch('/api/video-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: videoUrl }),
      });
      
      const data: VideoInfoResponse = await res.json();
      setVideoInfo(data);
    } catch (error) {
      console.error('Error fetching video info:', error);
    } finally {
      setIsFetchingInfo(false);
    }
  };
  
  // Reset video info when download type changes
  useEffect(() => {
    if (videoInfo) {
      setVideoInfo(null);
    }
  }, [downloadType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setUrlError('Please enter a YouTube URL');
      return;
    }
    
    if (!validateYouTubeUrl(url)) {
      setUrlError('Please enter a valid YouTube URL');
      return;
    }

    // If downloading video, check if we have video info
    if (downloadType === 'video' && !videoInfo?.success) {
      setResponse({
        success: false,
        error: 'Please wait for video information to load before downloading.',
      });
      return;
    }

    setIsLoading(true);
    setResponse(null);

    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url.trim(),
          type: downloadType,
          quality: downloadType === 'video' ? quality : undefined,
        }),
      });

      const data: DownloadResponse = await response.json();
      setResponse(data);
    } catch (error) {
      setResponse({
        success: false,
        error: 'Failed to connect to the download service. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setUrl('');
    setDownloadType('video');
    setResponse(null);
    setUrlError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 rounded-full mb-4 shadow-lg">
            <Youtube className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">YouTube Downloader</h1>
          <p className="text-gray-600">Download your favorite videos and audio tracks</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* URL Input */}
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube URL
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="url"
                    value={url}
                    onChange={handleUrlChange}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      urlError ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    disabled={isLoading}
                  />
                  <Youtube className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                </div>
                {urlError && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {urlError}
                  </p>
                )}
              </div>

              {/* Download Type Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Download Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDownloadType('video')}
                    className={`flex items-center justify-center px-4 py-2 rounded-lg border transition-colors ${
                      downloadType === 'video' 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                    disabled={isLoading}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Video
                  </button>
                  <button
                    type="button"
                    onClick={() => setDownloadType('audio')}
                    className={`flex items-center justify-center px-4 py-2 rounded-lg border transition-colors ${
                      downloadType === 'audio' 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                    disabled={isLoading}
                  >
                    <Music className="w-4 h-4 mr-2" />
                    Audio
                  </button>
                </div>
              </div>

              {/* Video Info */}
              {videoInfo && videoInfo.success && downloadType === 'video' && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start mb-3">
                    <img 
                      src={videoInfo.thumbnail} 
                      alt={videoInfo.title} 
                      className="w-24 h-16 object-cover rounded mr-3"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900 line-clamp-2">{videoInfo.title}</h3>
                      <p className="text-sm text-gray-500">
                        Duration: {Math.floor((videoInfo.duration || 0) / 60)}:{String(Math.floor((videoInfo.duration || 0) % 60)).padStart(2, '0')}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الجودات المتاحة:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {videoInfo.videoFormats?.map((format, index) => (
                        <span 
                          key={index} 
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                        >
                          {format.quality}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Quality Selector */}
              {downloadType === 'video' && (
                <div className="mb-4">
                  <label htmlFor="quality" className="block text-sm font-medium text-gray-700 mb-2">
                    اختر الجودة
                  </label>
                  <select
                    id="quality"
                    value={quality}
                    onChange={e => setQuality(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300"
                    disabled={isLoading || !videoInfo?.success}
                  >
                    {qualityOptions.map(opt => (
                      <option key={opt.value} value={opt.value} disabled={!videoInfo?.success}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {isFetchingInfo && (
                    <p className="mt-2 text-sm text-blue-600 flex items-center">
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      جاري جلب معلومات الفيديو...
                    </p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !!urlError || !url.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Download {downloadType === 'video' ? 'Video' : 'Audio'}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Response Section */}
          {response && (
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              {response.success ? (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Download Ready!</h3>
                  <p className="text-gray-600 mb-4">Your {downloadType} has been processed successfully.</p>
                  
                  {response.downloadUrl ? (
                    <div className="space-y-3">
                      <a
                        href={response.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Download File
                      </a>
                      <button
                        onClick={resetForm}
                        className="block w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        Download another file
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">{response.message}</p>
                      <button
                        onClick={resetForm}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                      >
                        Try Another
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Download Failed</h3>
                  <p className="text-gray-600 mb-4">
                    {response.error || response.message || 'An unexpected error occurred.'}
                  </p>
                  <button
                    onClick={() => setResponse(null)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Supports YouTube videos and playlists
          </p>
          <p className='text-sm text-gray-500 mt-2'>&copy;  2025 Create By <a href="https://www.linkedin.com/in/mugahed-motaz/?original_referer=https%3A%2F%2Fwww%2Egoogle%2Ecom%2F&originalSubdomain=sd">Mugahed motaz</a></p>
        <img src={Logo} alt="" className='w-20 h-20 m-auto'/>
        </div>
      </div>
    </div>
  );
}

export default App;