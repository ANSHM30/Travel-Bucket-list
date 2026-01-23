export default function PlaceCard({ place, onDelete, onToggleVisited }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{place.name}</h3>
            <p className="text-gray-500 flex items-center gap-1">
              <span>📍</span> {place.location}
            </p>
          </div>
          <button 
            onClick={() => onToggleVisited(place.id)}
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              place.visited ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {place.visited ? 'Visited' : 'Bucket List'}
          </button>
        </div>
        
        {place.description && (
          <p className="mt-3 text-gray-600 text-sm">{place.description}</p>
        )}
        
        <div className="mt-4 flex justify-end gap-2">
          <button 
            onClick={() => onDelete(place.id)}
            className="text-red-500 hover:text-red-700 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
