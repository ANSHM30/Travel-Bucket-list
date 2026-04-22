import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(event) {
      onMapClick(event.latlng);
    }
  });

  return null;
}

export default function MapView({ places, onAddPlace, canAddPlaces, onRequireAuth }) {
  const [draftPlace, setDraftPlace] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleMapClick = ({ lat, lng }) => {
    if (!canAddPlaces) {
      onRequireAuth?.();
      return;
    }

    setDraftPlace({ lat, lng });
    setFormData({ title: '', description: '' });
  };

  const closeModal = (force = false) => {
    if (submitting && !force) {
      return;
    }

    setDraftPlace(null);
    setFormData({ title: '', description: '' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!draftPlace || !formData.title.trim()) {
      return;
    }

    setSubmitting(true);

    try {
      await onAddPlace({
        title: formData.title.trim(),
        description: formData.description.trim(),
        lat: draftPlace.lat,
        lng: draftPlace.lng
      });
      closeModal(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          scrollWheelZoom
          className="h-[420px] w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onMapClick={handleMapClick} />
          {places.map((place) => {
            const [lng, lat] = place.location?.coordinates ?? [];

            if (typeof lat !== 'number' || typeof lng !== 'number') {
              return null;
            }

            return (
              <Marker key={place._id} position={[lat, lng]}>
                <Popup>
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-900">{place.title}</p>
                    {place.description && <p className="text-sm text-slate-700">{place.description}</p>}
                    <p className="text-sm text-slate-600">
                      {lat.toFixed(4)}, {lng.toFixed(4)}
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {draftPlace && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/45 p-4">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl">
            <div className="mb-4">
              <p className="text-sm uppercase tracking-[0.25em] text-sky-600">New Place</p>
              <h3 className="text-2xl font-bold text-slate-900">Add this destination</h3>
              <p className="mt-1 text-sm text-slate-500">
                {draftPlace.lat.toFixed(4)}, {draftPlace.lng.toFixed(4)}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
                <input
                  value={formData.title}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, title: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500"
                  placeholder="Santorini Sunset Spot"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, description: event.target.value }))
                  }
                  className="h-28 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500"
                  placeholder="Why this place deserves a spot on your list"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-2xl bg-sky-600 px-4 py-3 font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? 'Saving...' : 'Save Place'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
