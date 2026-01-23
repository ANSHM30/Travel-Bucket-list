import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center shadow-lg">
      <Link to="/" className="text-xl font-bold flex items-center gap-2">
        <span>🌍</span> TravelBucket
      </Link>
      <div className="flex gap-6">
        <Link to="/" className="hover:text-blue-200 transition-colors">Home</Link>
        <Link to="/profile" className="hover:text-blue-200 transition-colors">Profile</Link>
        <Link to="/auth" className="bg-white text-blue-600 px-4 py-1 rounded-full font-medium hover:bg-blue-50 transition-colors">
          Login
        </Link>
      </div>
    </nav>
  );
}
