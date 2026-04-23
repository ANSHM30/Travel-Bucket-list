import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const GUIDE_SECTIONS = [
  { key: 'mustVisitSpots', title: 'Must-Visit Places' },
  { key: 'hotelNotes', title: 'Hotel Notes' },
  { key: 'transportTips', title: 'Transport Tips' },
  { key: 'safetyNotes', title: 'Safety Tips' },
  { key: 'packingList', title: 'Packing Checklist' },
  { key: 'foodToTry', title: 'Food To Try' },
  { key: 'localEtiquette', title: 'Local Etiquette' }
];

function toMultilineText(items = []) {
  return Array.isArray(items) ? items.join('\n') : '';
}

function toLines(value) {
  return value
    .split('\n')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function createFormState(place) {
  const guide = place?.travelGuide || {};

  return {
    overview: guide.overview || '',
    mustVisitSpots: toMultilineText(guide.mustVisitSpots),
    hotelNotes: toMultilineText(guide.hotelNotes),
    transportTips: toMultilineText(guide.transportTips),
    safetyNotes: toMultilineText(guide.safetyNotes),
    packingList: toMultilineText(guide.packingList),
    foodToTry: toMultilineText(guide.foodToTry),
    localEtiquette: toMultilineText(guide.localEtiquette),
    bestTimeToVisit: guide.bestTimeToVisit || ''
  };
}

function InfoSection({ title, items, emptyMessage }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      {items.length > 0 ? (
        <ul className="mt-4 space-y-3 text-sm text-slate-700">
          {items.map((item) => (
            <li key={item} className="rounded-2xl bg-slate-50 px-4 py-3">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-slate-500">{emptyMessage}</p>
      )}
    </section>
  );
}

export default function PlacePage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [place, setPlace] = useState(null);
  const [formState, setFormState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/places/${id}`);
        setPlace(response.data);
        setFormState(createFormState(response.data));
        setError('');
      } catch (err) {
        console.error('Error fetching place details:', err);
        setError('Could not load this destination right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlace();
  }, [id]);

  const isOwner = isAuthenticated && place?.user && String(place.user) === user?.id;
  const [lng, lat] = place?.location?.coordinates ?? [];
  const coordinatesAvailable = typeof lat === 'number' && typeof lng === 'number';

  const handleChange = (key, value) => {
    setFormState((current) => ({ ...current, [key]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!place || !formState) {
      return;
    }

    const payload = {
      travelGuide: {
        overview: formState.overview,
        mustVisitSpots: toLines(formState.mustVisitSpots),
        hotelNotes: toLines(formState.hotelNotes),
        transportTips: toLines(formState.transportTips),
        safetyNotes: toLines(formState.safetyNotes),
        packingList: toLines(formState.packingList),
        foodToTry: toLines(formState.foodToTry),
        localEtiquette: toLines(formState.localEtiquette),
        bestTimeToVisit: formState.bestTimeToVisit
      }
    };

    try {
      setSaving(true);
      const response = await api.patch(`/places/${id}`, payload);
      setPlace(response.data);
      setFormState(createFormState(response.data));
      setEditing(false);
    } catch (err) {
      console.error('Error saving place guide:', err);
      alert('Failed to save travel guide details.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-sky-600"></div>
      </div>
    );
  }

  if (error || !place || !formState) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
          <p>{error || 'Destination not found.'}</p>
          <Link to="/" className="mt-4 inline-flex font-semibold text-red-700 underline underline-offset-4">
            Back to bucket list
          </Link>
        </div>
      </div>
    );
  }

  const guide = place.travelGuide || {};

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 p-8 text-white shadow-xl">
        <Link to="/" className="text-sm font-medium text-sky-200 underline underline-offset-4">
          Back to bucket list
        </Link>
        <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-200">Destination Guide</p>
            <h1 className="mt-2 text-4xl font-extrabold">{place.title}</h1>
            <p className="mt-4 max-w-2xl text-sm text-slate-200">
              {place.description || 'Use this page to keep everything important about the destination in one place before you travel.'}
            </p>
          </div>
          {isOwner && (
            <div className="flex gap-3">
              {editing ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setFormState(createFormState(place));
                      setEditing(false);
                    }}
                    className="rounded-full border border-white/30 px-5 py-2 font-medium text-white transition hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="travel-guide-form"
                    disabled={saving}
                    className="rounded-full bg-white px-5 py-2 font-semibold text-slate-900 transition hover:bg-slate-100 disabled:opacity-70"
                  >
                    {saving ? 'Saving...' : 'Save Guide'}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="rounded-full bg-white px-5 py-2 font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  Edit Guide
                </button>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 grid gap-4 text-sm text-slate-200 md:grid-cols-3">
          <div className="rounded-2xl bg-white/10 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-sky-200">Saved Location</p>
            <p className="mt-2">{place.address || 'Address not added yet'}</p>
          </div>
          <div className="rounded-2xl bg-white/10 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-sky-200">Best Time To Visit</p>
            <p className="mt-2">{guide.bestTimeToVisit || 'Add the ideal season or month range'}</p>
          </div>
          <div className="rounded-2xl bg-white/10 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-sky-200">Coordinates</p>
            <p className="mt-2">
              {coordinatesAvailable ? `${lat.toFixed(4)}, ${lng.toFixed(4)}` : 'Coordinates unavailable'}
            </p>
          </div>
        </div>
      </div>

      {editing ? (
        <form
          id="travel-guide-form"
          onSubmit={handleSave}
          className="mt-8 grid gap-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">Overview</label>
            <textarea
              value={formState.overview}
              onChange={(event) => handleChange('overview', event.target.value)}
              className="h-32 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500"
              placeholder="Write a quick travel summary: why to go, the vibe, and what makes this destination special."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">Best Time To Visit</label>
            <input
              value={formState.bestTimeToVisit}
              onChange={(event) => handleChange('bestTimeToVisit', event.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500"
              placeholder="Example: October to March for cool weather and city walks"
            />
          </div>

          {GUIDE_SECTIONS.map((section) => (
            <div key={section.key}>
              <label className="mb-2 block text-sm font-semibold text-slate-800">{section.title}</label>
              <textarea
                value={formState[section.key]}
                onChange={(event) => handleChange(section.key, event.target.value)}
                className="h-32 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500"
                placeholder={`Add ${section.title.toLowerCase()} with one point per line.`}
              />
            </div>
          ))}
        </form>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Overview</h2>
            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-700">
              {guide.overview || 'No detailed overview yet. Add the big picture of what makes this destination worth the trip.'}
            </p>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Before You Go</h2>
            <div className="mt-4 space-y-4 text-sm text-slate-700">
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="font-semibold text-slate-900">Travel mindset</p>
                <p className="mt-1">
                  {guide.bestTimeToVisit || 'Add season, weather, or timing notes to help plan the trip well.'}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="font-semibold text-slate-900">Hotel focus</p>
                <p className="mt-1">
                  {guide.hotelNotes?.length
                    ? `${guide.hotelNotes.length} hotel notes saved for this destination.`
                    : 'No hotel guidance yet. Add area suggestions, safety notes, or what kind of stay works best.'}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="font-semibold text-slate-900">Unknown place checklist</p>
                <p className="mt-1">
                  {guide.safetyNotes?.length || guide.localEtiquette?.length
                    ? 'You already have local cautions and etiquette notes saved here.'
                    : 'Use the safety and etiquette sections to note scams to avoid, dress code, local customs, or areas to skip at night.'}
                </p>
              </div>
            </div>
          </section>

          {GUIDE_SECTIONS.map((section) => (
            <InfoSection
              key={section.key}
              title={section.title}
              items={guide[section.key] || []}
              emptyMessage={`No ${section.title.toLowerCase()} added yet.`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
