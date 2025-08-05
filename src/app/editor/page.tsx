"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditorPage() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleComplete = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: content }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { completion } = await res.json();
      setContent((prev) => prev + completion);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col p-6">
      <header className="flex items-center justify-between pb-4">
        <h1 className="text-xl font-semibold">DeepWrite Editor</h1>
        <button
          onClick={() => router.push('/logout')}
          className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
        >
          Sign out
        </button>
      </header>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start writing..."
        className="flex-1 resize-none rounded border p-4 font-mono shadow focus:outline-none"
      />
      {error && <p className="pt-2 text-sm text-red-600">{error}</p>}
      <div className="pt-4">
        <button
          onClick={handleComplete}
          disabled={loading}
          className="rounded bg-black px-4 py-2 font-medium text-white hover:bg-gray-800 disabled:opacity-60"
        >
          {loading ? 'Generating…' : 'Generate with AI'}
        </button>
      </div>
    </main>
  );
}
