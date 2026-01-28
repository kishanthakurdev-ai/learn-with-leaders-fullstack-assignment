import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';

type Program = {
  id: string;
  title: string;
  description: string | null;
  mentor_id: string | null;
};

export default function ProgramList() {
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // 🔐 Get logged-in user + role
  useEffect(() => {
    const loadUserRole = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;

      setUserId(data.user.id);

      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single();

      setRole(userData?.role ?? null);
    };

    loadUserRole();
  }, []);

  // 📦 Fetch programs based on role
  const fetchPrograms = async (): Promise<Program[]> => {
    if (!role) return [];

    if (role === 'mentor') {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('mentor_id', userId);
      if (error) throw error;
      return data ?? [];
    }

    const { data, error } = await supabase
      .from('programs')
      .select('*');
    if (error) throw error;
    return data ?? [];
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['programs', role],
    queryFn: fetchPrograms,
    enabled: !!role,
    retry: false,
  });

  // 🚪 Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  // ⏳ States
  if (!role)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Checking role...
      </div>
    );

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading programs...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load programs
      </div>
    );

  // 🎨 UI
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Programs
          </h1>
          <div className="mt-1">
            <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700 capitalize">
              {role}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Empty State */}
      {data?.length === 0 && (
        <div className="text-center mt-20 text-gray-500">
          <p className="text-lg font-medium">No programs available</p>
          <p className="text-sm mt-1">
            {role === 'mentor'
              ? 'You have not been assigned any programs yet.'
              : 'Programs will appear here once available.'}
          </p>
        </div>
      )}

      {/* Programs Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data?.map(program => (
          <div
            key={program.id}
            className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              {program.title}
            </h3>

            {program.description && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                {program.description}
              </p>
            )}

            {/* Actions */}
            <div className="mt-5">
              {role === 'student' && (
                <button className="w-full px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Apply
                </button>
              )}

              {role === 'admin' && (
                <button className="w-full px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                  Approve Applications
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}