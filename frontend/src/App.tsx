import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import ProgramList from './pages/ProgramList';
import Login from './pages/Login';

function App() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (!session) return <Login />;

  return <ProgramList />;
}

export default App;