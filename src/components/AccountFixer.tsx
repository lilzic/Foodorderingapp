import { useState } from 'react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function AccountFixer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showFixer, setShowFixer] = useState(false);

  const handleFixAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabaseUrl = `https://${projectId}.supabase.co`;
      const response = await fetch(
        `${supabaseUrl}/functions/v1/make-server-7817ccb1/fix-account`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fix account');
      }

      toast.success('Account verified! You can now sign in with your password.');
      setEmail('');
      setShowFixer(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fix account');
    } finally {
      setLoading(false);
    }
  };

  if (!showFixer) {
    return (
      <button
        onClick={() => setShowFixer(true)}
        className="text-sm text-orange-600 dark:text-orange-400 hover:underline"
      >
        Having trouble signing in? Click here to fix your account
      </button>
    );
  }

  return (
    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
      <h3 className="text-orange-900 dark:text-orange-100 mb-2">Fix Account</h3>
      <p className="text-sm text-orange-700 dark:text-orange-300 mb-4">
        If you're unable to sign in, enter your email to verify your account.
      </p>
      <form onSubmit={handleFixAccount} className="space-y-3">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50"
          >
            {loading ? 'Fixing...' : 'Fix Account'}
          </button>
          <button
            type="button"
            onClick={() => setShowFixer(false)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
