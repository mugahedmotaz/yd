import React, { useState } from 'react';
import { Download, Youtube, Music, Video, Loader2, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import Logo from './logo-01.svg';
interface DownloadResponse {
  success: boolean;
  downloadUrl?: string;
  message?: string;
  error?: string;
}

function App() {
  const [url, setUrl] = useState('');
  const [downloadType, setDownloadType] = useState<'video' | 'audio'>('video');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<DownloadResponse | null>(null);
  const [urlError, setUrlError] = useState('');

  const validateYouTubeUrl = (url: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)[a-zA-Z0-9_-]{11}.*$/;
    return youtubeRegex.test(url);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    setUrlError('');
    setResponse(null);

    if (newUrl && !validateYouTubeUrl(newUrl)) {
      setUrlError('Please enter a valid YouTube URL');
    }
  };

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

    setIsLoading(true);
    setResponse(null);

    try {
      const response = await fetch("https://mugahed-download.onrender.com/api/download", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url.trim(),
          type: downloadType,
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
                    autoComplete='off'
                    onChange={handleUrlChange}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${urlError ? 'border-red-300 bg-red-50' : 'border-gray-300'
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
                <label htmlFor="downloadType" className="block text-sm font-medium text-gray-700 mb-2">
                  Download Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDownloadType('video')}
                    disabled={isLoading}
                    className={`flex items-center justify-center py-3 px-4 rounded-lg border-2 transition-all ${downloadType === 'video'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                  >
                    <Video className="w-5 h-5 mr-2" />
                    Video
                  </button>
                  <button
                    type="button"
                    onClick={() => setDownloadType('audio')}
                    disabled={isLoading}
                    className={`flex items-center justify-center py-3 px-4 rounded-lg border-2 transition-all ${downloadType === 'audio'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                  >
                    <Music className="w-5 h-5 mr-2" />
                    Audio
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !!urlError || !url.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    جاري المعالجة...
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

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-xl font-medium text-gray-800 mb-2">جاري المعالجة...</p>
              <p className="text-gray-600 text-center max-w-md">
                يتم الآن إعداد الملف المطلوب<br/> يرجى الانتظار قليلاً بينما نجهز التنزيل   للاستخدام.
              </p>
            </div>
          )}

          {/* Response Display */}
          {response && !isLoading && (
            <div className={`mt-6 p-4 rounded-lg border ${response.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              {response.success ? (
                <div className="text-center">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">جاهز للتحميل!</h3>
                  <p className="text-gray-600 mb-4">تمت معالجة {downloadType === 'video' ? 'الفيديو' : 'الصوت'} بنجاح.</p>
                  {response.downloadUrl ? (
                    <div className="space-y-3">
                      <a
                        href={response.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        تحميل الآن
                        <ExternalLink className="w-4 h-4 mr-2" />
                      </a>
                      <p className="text-sm text-gray-500 mt-2">انقر على الزر أعلاه لتحميل الملف</p>
                    </div>
                  ) : (
                    <p className="text-gray-600">{response.message}</p>
                  )}
                  <button
                    onClick={resetForm}
                    className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors font-medium"
                  >
                    تحميل ملف آخر
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">خطأ</h3>
                  <p className="text-gray-600">{response.error}</p>
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
          <img src={Logo} alt="" className='w-20 h-20 m-auto' />
        </div>
      </div>
    </div>
  );
}

export default App;