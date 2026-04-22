import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, isAuthenticated, authLoading } = useAuth();

  if (authLoading) {
    return <div className="p-6 text-center text-slate-500">Loading profile...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-sky-600">Profile</p>
        <h1 className="mb-2 text-3xl font-black text-slate-900">{user.name}</h1>
        <p className="text-slate-600">{user.email}</p>
        <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-sm text-slate-600">
          Your saved places are tied to this account. Add markers from the home map and they will belong to you.
        </div>
      </div>
    </div>
  );
}
