'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Url {
  id: number;
  originalUrl: string;
  slug: string;
  visitCount: number;
  created_at: string;
  shortUrl: string;
}

interface User {
  id: number;
  email: string;
}

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export default function Dashboard() {
  const [urls, setUrls] = useState<Url[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [shortenUrlLoading, setShortenUrlLoading] = useState(false);
  const [shortenUrlError, setShortenUrlError] = useState('');
  const [shortenUrlSuccess, setShortenUrlSuccess] = useState('');
  const [shortenUrlInput, setShortenUrlInput] = useState('');
  const [shortenUrlResult, setShortenUrlResult] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
    fetchUrls();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      router.push('/login');
    }
  };

  const fetchUrls = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/urls', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch URLs');
      }

      const data = await response.json();
      setUrls(data.urls || data); // Handle both paginated and simple responses
    } catch (error) {
      setError('Failed to load URLs');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      alert('URL copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const handleDeleteUrl = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this URL?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/urls/${slug}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete URL');
      }

      // Refresh the URLs list
      fetchUrls();
    } catch (error) {
      setError('Failed to delete URL');
    }
  };

  // New: handle URL shortener form
  const handleShortenUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setShortenUrlLoading(true);
    setShortenUrlError('');
    setShortenUrlSuccess('');
    setShortenUrlResult(null);

    // Validate URL
    try {
      new URL(shortenUrlInput);
    } catch {
      setShortenUrlError('Please enter a valid URL (e.g., https://example.com)');
      setShortenUrlLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/urls', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ originalUrl: shortenUrlInput }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/login');
          return;
        }
        throw new Error(data.message || 'Failed to shorten URL');
      }
      setShortenUrlSuccess("Success! Here's your short URL:");
      setShortenUrlResult(data.shortUrl);
      setShortenUrlInput(data.originalUrl);
      // Refresh dashboard list
      fetchUrls();
    } catch (error) {
      setShortenUrlError(error instanceof Error ? error.message : 'Failed to shorten URL');
    } finally {
      setShortenUrlLoading(false);
    }
  };

  const handleShortenUrlReset = () => {
    setShortenUrlInput('');
    setShortenUrlResult(null);
    setShortenUrlSuccess('');
    setShortenUrlError('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">URL Shortener Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* URL Shortener Form */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-black">
            <span>URL Shortener</span>
            <span role="img" aria-label="link">🔗</span>
          </h2>
          <form onSubmit={handleShortenUrl} className="space-y-4">
            <label className="block text-gray-700 font-medium">Enter the URL to shorten</label>
            <input
              type="url"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="URL"
              value={shortenUrlInput}
              onChange={e => setShortenUrlInput(e.target.value)}
              required
              readOnly={!!shortenUrlResult}
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-md font-semibold disabled:opacity-50"
              disabled={shortenUrlLoading || !!shortenUrlResult}
            >
              {shortenUrlLoading ? 'Shortening...' : 'Shorten'}
            </button>
          </form>
          {shortenUrlError && (
            <div className="mt-2 text-red-600">{shortenUrlError}</div>
          )}
          {shortenUrlSuccess && shortenUrlResult && (
            <div className="mt-4">
              <div className="text-green-700 font-semibold mb-2">{shortenUrlSuccess}</div>
              <div className="flex items-center gap-2">
                <a
                  href={shortenUrlResult}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 underline break-all"
                >
                  {shortenUrlResult}
                </a>
                <button
                  className="ml-2 px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center gap-1"
                  onClick={() => {
                    navigator.clipboard.writeText(shortenUrlResult);
                  }}
                >
                  <span role="img" aria-label="copy">📋</span> Copy
                </button>
                <button
                  className="ml-2 px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                  onClick={handleShortenUrlReset}
                >
                  New URL
                </button>
              </div>
            </div>
          )}
        </div>

        {/* URLs List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-black">Your URLs</h2>
          </div>
          
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {urls.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>No URLs created yet. Create your first short URL!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Original URL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Short URL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visits
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {urls.map((url) => (
                    <tr key={url.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 truncate max-w-xs">
                          {url.originalUrl}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-blue-600">{url.shortUrl}</span>
                          <button
                            onClick={() => copyToClipboard(url.shortUrl)}
                            className="text-gray-400 hover:text-gray-600"
                            title="Copy to clipboard"
                          >
                            📋
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {url.visitCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(url.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            href={`/dashboard/edit/${url.slug}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteUrl(url.slug)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 