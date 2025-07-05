'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: number;
  email: string;
}

interface Url {
  id: number;
  originalUrl: string;
  slug: string;
  visitCount: number;
  created_at: string;
  shortUrl: string;
}

export default function EditUrl() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [url, setUrl] = useState<Url | null>(null);
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  useEffect(() => {
    checkAuth();
    fetchUrl();
  }, [slug]);

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

  const fetchUrl = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/urls`, {
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
      const urls = data.urls || data;
      const currentUrl = urls.find((u: Url) => u.slug === slug);
      
      if (!currentUrl) {
        setError('URL not found');
        return;
      }

      setUrl(currentUrl);
      setOriginalUrl(currentUrl.originalUrl);
    } catch (error) {
      setError('Failed to load URL');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/urls/${slug}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ originalUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/login');
          return;
        }
        if (response.status === 404) {
          throw new Error('URL not found or you are not authorized to edit it');
        }
        throw new Error(data.message || 'Failed to update URL');
      }

      setSuccess('URL updated successfully!');
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update URL');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error && !url) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Link
                href="/dashboard"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Edit Short URL</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.email}</span>
              <Link
                href="/dashboard"
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Edit Short URL</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-600">{success}</p>
            </div>
          )}

          {/* URL Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-md">
            <h3 className="text-lg font-medium text-gray-900 mb-2">URL Information</h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-700">Short URL:</span>
                <p className="text-sm text-blue-600">{url?.shortUrl}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Slug:</span>
                <p className="text-sm text-gray-600">{url?.slug}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Visits:</span>
                <p className="text-sm text-gray-600">{url?.visitCount}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Created:</span>
                <p className="text-sm text-gray-600">
                  {url?.created_at ? new Date(url.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="originalUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Original URL *
              </label>
              <input
                type="url"
                id="originalUrl"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="https://example.com/very-long-url"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-sm text-gray-500">
                Update the destination URL
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Updating...' : 'Update URL'}
              </button>
              <Link
                href="/dashboard"
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 