import React, { useState } from 'react';
import { Download, Youtube, Music, Video, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import Logo from './logo-01.svg';

interface DownloadResponse {
  success: boolean;
  downloadUrl?: string;
  error?: string;
  message?: string;
}

function App() {
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<DownloadResponse | null>(null);
  const [downloadType, setDownloadType] = useState<'video' | 'audio'>('video');

  const validateYouTubeUrl = (urlToValidate: string) => {
    if (!urlToValidate) return false;
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|music\.youtube\.com)\/.+$/;
    return youtubeRegex.test(urlToValidate);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    setResponse(null); // Reset response on new URL
    if (validateYouTubeUrl(newUrl)) {
      setUrlError('');
    } else if (newUrl.trim() !== '') {
      setUrlError('Please enter a valid YouTube URL');
    } else {
      setUrlError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateYouTubeUrl(url)) {
      setUrlError('Please enter a valid YouTube URL');
      return;
    }

    setIsLoading(true);
    setResponse(null);
    setUrlError('');

    try {
      const apiResponse = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url.trim(),
          type: downloadType,
        }),
      });

      const data: DownloadResponse = await apiResponse.json();
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
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${urlError ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
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
                <div className="flex rounded-lg border border-gray-300 p-1 bg-gray-100">
                  <button
                    type="button"
                    onClick={() => setDownloadType('video')}
                    className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out ${downloadType === 'video' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
                  >
                    <Video className="w-5 h-5 inline-block mr-2" />
                    Video
                  </button>
                  <button
                    type="button"
                    onClick={() => setDownloadType('audio')}
                    className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out ${downloadType === 'audio' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
                  >
                    <Music className="w-5 h-5 inline-block mr-2" />
                    Audio
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !!urlError || !url}
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Download
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="p-6 text-center">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4 mx-auto" />
              <p className="text-xl font-medium text-gray-800 mb-2">جاري المعالجة...</p>
              <p className="text-gray-600">
                يرجى الانتظار قليلاً بينما نجهز التنزيل.
              </p>
            </div>
          )}

          {/* Response Display */}
          {response && !isLoading && (
            <div className={`p-6 border-t ${response.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
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
                        className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        تحميل الآن
                      </a>
                      <p className="text-sm text-gray-500 mt-2">انقر على الزر أعلاه لتحميل الملف</p>
                    </div>
                  ) : (
                    <p className="text-red-600">{response.message || 'Could not find a download link.'}</p>
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">فشل التحميل</h3>
                  <p className="text-gray-600 mb-4">
                    {response.error || response.message || 'An unexpected error occurred.'}
                  </p>
                  <button
                    onClick={() => setResponse(null)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    المحاولة مرة أخرى
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
          <p className='text-sm text-gray-500 mt-2'>&copy;  2025 Create By <a href="https://www.linkedin.com/in/mugahed-motaz/?original_referer=https%3A%2F%2Fwww%2Egoogle%2Ecom%2F&originalSubdomain=sd" className="text-blue-600 hover:underline">Mugahed motaz</a></p>
          <img src={Logo} alt="" className='w-20 h-20 m-auto' />
        </div>
      </div>
    </div>
  );
}

export default App;