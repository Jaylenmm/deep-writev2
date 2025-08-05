"use client";
import { useState, FormEvent } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

interface Props {
  initialProfile: {
    full_name: string | null;
    email: string | null;
  };
}

export default function AccountClient({ initialProfile }: Props) {
  const supabase = createSupabaseBrowserClient();
  const [fullName, setFullName] = useState(initialProfile.full_name ?? '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      setMessage('Not authenticated');
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', user.id);
    setMessage(error ? error.message : 'Saved');
    setSaving(false);
  };

  return (
    <main className="mx-auto max-w-md space-y-6 p-4">
      <h1 className="text-2xl font-semibold">Account</h1>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Full name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </div>
        {message && <p className="text-sm text-gray-600">{message}</p>}
        <button
          type="submit"
          disabled={saving}
          className="rounded bg-black px-4 py-2 font-medium text-white hover:bg-gray-800 disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </form>
    </main>
  );
}
