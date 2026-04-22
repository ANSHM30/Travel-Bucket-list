import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between bg-blue-600 p-4 text-white shadow-lg">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold">
        <span>TravelBucket</span>
      </Link>
      <div className="flex items-center gap-4">
        <Link to="/" className="transition-colors hover:text-blue-200">
          Home
        </Link>
        {isAuthenticated && (
          <Link to="/profile" className="transition-colors hover:text-blue-200">
            Profile
          </Link>
        )}
        {isAuthenticated ? (
          <>
            <span className="hidden rounded-full bg-blue-500/70 px-3 py-1 text-sm md:inline-flex">
              {user.name}
            </span>
            <button
              type="button"
              onClick={logout}
              className="rounded-full bg-white px-4 py-1 font-medium text-blue-600 transition-colors hover:bg-blue-50"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/auth"
            className="rounded-full bg-white px-4 py-1 font-medium text-blue-600 transition-colors hover:bg-blue-50"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
