import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import MapView from '../components/MapView';
import PlaceCard from '../components/PlaceCard';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, authLoading } = useAuth();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    fetchPlaces();
  }, [authLoading, isAuthenticated]);

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const response = await api.get('/places');
      setPlaces(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching places:', err);
      setError('Could not load your bucket list. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const addPlace = async (placeData) => {
    if (!isAuthenticated) {
      alert('Please log in to save places to your bucket list.');
      return;
    }

    try {
      const response = await api.post('/places', placeData);
      setPlaces((currentPlaces) => [response.data, ...currentPlaces]);
    } catch (err) {
      console.error('Error adding place:', err);
      alert('Failed to add place');
    }
  };

  const deletePlace = async (id) => {
    try {
      await api.delete(`/places/${id}`);
      setPlaces((currentPlaces) => currentPlaces.filter((place) => place._id !== id));
    } catch (err) {
      console.error('Error deleting place:', err);
      alert('Failed to delete place');
    }
  };

  const toggleVisited = async (id) => {
    const place = places.find((entry) => entry._id === id);

    if (!place) {
      return;
    }

    try {
      const response = await api.patch(`/places/${id}`, { visited: !place.visited });
      setPlaces((currentPlaces) =>
        currentPlaces.map((entry) => (entry._id === id ? response.data : entry))
      );
    } catch (err) {
      console.error('Error updating place:', err);
      alert('Failed to update status');
    }
  };

  const searchLocation = (id) => {
    const place = places.find((entry) => entry._id === id);

    if (!place) {
      return;
    }

    const [lng, lat] = place.location?.coordinates ?? [];
    const searchTarget = place.address || place.title || '';
    const query =
      searchTarget.trim() ||
      (typeof lat === 'number' && typeof lng === 'number' ? `${lat},${lng}` : '');

    if (!query) {
      alert('Location details are unavailable for this place.');
      return;
    }

    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-10 text-center">
        <h1 className="mb-2 text-4xl font-extrabold text-gray-900">My Travel Bucket List</h1>
        <p className="text-gray-600">
          {isAuthenticated
            ? 'Click anywhere on the map to pin a destination and save it to MongoDB.'
            : 'Log in to create your personal travel map. Logged-out users only see public places.'}
        </p>
      </header>

      {error && (
        <div className="mb-6 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <section className="mb-8 space-y-3">
        <div className="rounded-3xl bg-slate-900 px-5 py-4 text-slate-50 shadow-sm">
          <h2 className="text-lg font-semibold">Interactive Travel Map</h2>
          <p className="text-sm text-slate-300">
            {isAuthenticated ? (
              'Click the map, fill in the modal, and your marker will appear immediately.'
            ) : (
              <>
                <Link to="/auth" className="font-semibold text-sky-300 underline underline-offset-4">
                  Log in
                </Link>{' '}
                to add private places to your bucket list.
              </>
            )}
          </p>
        </div>
        <MapView
          places={places}
          onAddPlace={addPlace}
          canAddPlaces={isAuthenticated}
          onRequireAuth={() => navigate('/auth')}
          onSearchLocation={searchLocation}
        />
      </section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {places.map((place) => {
          const [lng, lat] = place.location?.coordinates ?? [];
          const fallbackLocation =
            typeof lat === 'number' && typeof lng === 'number'
              ? `${lat.toFixed(4)}, ${lng.toFixed(4)}`
              : 'Coordinates unavailable';

          return (
            <PlaceCard
              key={place._id}
              place={{
                id: place._id,
                name: place.title,
                location: place.address || fallbackLocation,
                description: place.description,
                visited: place.visited
              }}
              onDelete={deletePlace}
              onToggleVisited={toggleVisited}
              onSearchLocation={searchLocation}
            />
          );
        })}
      </div>

      {places.length === 0 && !error && (
        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-100 py-20 text-center">
          <p className="italic text-gray-500">
            No adventures planned yet. Click the map to add your first destination.
          </p>
        </div>
      )}
    </div>
  );
}
