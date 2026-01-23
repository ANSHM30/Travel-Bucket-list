import { useState, useEffect } from 'react';
import api from '../api/api';
import PlaceCard from '../components/PlaceCard';
import PlaceForm from '../components/PlaceForm';

export default function Home() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlaces();
  }, []);

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

  const addPlace = async (formData) => {
    try {
      // Map frontend fields to backend schema
      const placeData = {
        title: formData.name,
        location: {
          type: 'Point',
          coordinates: [0, 0] // Default for now
        },
        address: formData.location,
        description: formData.description
      };
      
      const response = await api.post('/places', placeData);
      setPlaces([response.data, ...places]);
    } catch (err) {
      console.error('Error adding place:', err);
      alert('Failed to add place');
    }
  };

  const deletePlace = async (id) => {
    try {
      await api.delete(`/places/${id}`);
      setPlaces(places.filter(p => p._id !== id));
    } catch (err) {
      console.error('Error deleting place:', err);
      alert('Failed to delete place');
    }
  };

  const toggleVisited = async (id) => {
    const place = places.find(p => p._id === id);
    try {
      const response = await api.patch(`/places/${id}`, { visited: !place.visited });
      setPlaces(places.map(p => p._id === id ? response.data : p));
    } catch (err) {
      console.error('Error updating place:', err);
      alert('Failed to update status');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">My Travel Bucket List</h1>
        <p className="text-gray-600">Dreaming of my next adventure around the globe.</p>
      </header>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <PlaceForm onAdd={addPlace} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {places.map(place => (
          <PlaceCard 
            key={place._id} 
            place={{
              id: place._id,
              name: place.title,
              location: place.address,
              description: place.description,
              visited: place.visited
            }} 
            onDelete={deletePlace}
            onToggleVisited={toggleVisited}
          />
        ))}
      </div>

      {places.length === 0 && !error && (
        <div className="text-center py-20 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300">
          <p className="text-gray-500 italic">No adventures planned yet. Start adding some!</p>
        </div>
      )}
    </div>
  );
}
