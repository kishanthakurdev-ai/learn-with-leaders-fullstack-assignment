import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-blue-100 px-4">
      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome Back 👋
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Sign in to continue
          </p>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1 text-center">
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-[90%] mx-auto rounded-xl border border-gray-300 
                       px-4 py-2.5 text-sm shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Password */}
        <div className="mb-7">
          <label className="block text-sm font-medium text-gray-700 mb-1 text-center">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-[90%] mx-auto rounded-xl border border-gray-300 
                       px-4 py-2.5 text-sm shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="block w-[90%] mx-auto rounded-xl bg-indigo-600 py-3
                     text-white font-semibold shadow-md
                     hover:bg-indigo-700 transition
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>

        {/* Error */}
        {error && (
          <div className="mt-5 w-[90%] mx-auto text-sm text-red-600 
                          bg-red-50 border border-red-200 rounded-xl 
                          p-3 text-center">
            {error}
          </div>
        )}

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-gray-400">
          Learn with Leaders · Full-Stack Assignment
        </p>
      </div>
    </div>
  );
}
