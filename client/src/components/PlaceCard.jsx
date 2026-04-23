import { Link } from 'react-router-dom';

export default function PlaceCard({ place, onDelete, onToggleVisited, onSearchLocation }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md transition-shadow hover:shadow-lg">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{place.name}</h3>
            <p className="flex items-center gap-2 text-gray-500">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
                Pin
              </span>
              {place.location}
            </p>
          </div>
          <button
            onClick={() => onToggleVisited(place.id)}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              place.visited ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {place.visited ? 'Visited' : 'Bucket List'}
          </button>
        </div>

        {place.description && <p className="mt-3 text-sm text-gray-600">{place.description}</p>}

        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <Link
            to={`/places/${place.id}`}
            className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
          >
            View Details
          </Link>
          <button
            onClick={() => onSearchLocation(place.id)}
            className="rounded-full bg-sky-50 px-3 py-2 text-sm font-medium text-sky-700 transition hover:bg-sky-100"
          >
            Search Location
          </button>
          <button
            onClick={() => onDelete(place.id)}
            className="rounded-full px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
