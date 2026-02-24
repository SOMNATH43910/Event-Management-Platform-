import React, { useState, useEffect, useCallback } from 'react';
import { getEvents } from '../../services/api';
import EventCard from './EventCard';
import EventForm from './EventForm';

function EventList({ currentUser, socket }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getEvents();
      setEvents(res.data);
    } catch {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Real-time updates via WebSocket
  useEffect(() => {
    if (!socket) return;

    socket.on('event_created', ({ event }) => {
      setEvents((prev) => [event, ...prev]);
    });

    socket.on('event_updated', ({ event }) => {
      setEvents((prev) => prev.map((e) => (e.id === event.id ? event : e)));
    });

    socket.on('event_deleted', ({ eventId }) => {
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
    });

    socket.on('event_registration', ({ eventId, username }) => {
      setEvents((prev) =>
        prev.map((e) => {
          if (e.id !== eventId) return e;
          const registrations = e.registrations || [];
          if (!registrations.includes(username)) {
            return { ...e, registrations: [...registrations, username] };
          }
          return e;
        })
      );
    });

    socket.on('event_unregistration', ({ eventId, username }) => {
      setEvents((prev) =>
        prev.map((e) => {
          if (e.id !== eventId) return e;
          return { ...e, registrations: (e.registrations || []).filter((u) => u !== username) };
        })
      );
    });

    return () => {
      socket.off('event_created');
      socket.off('event_updated');
      socket.off('event_deleted');
      socket.off('event_registration');
      socket.off('event_unregistration');
    };
  }, [socket]);

  const handleSaved = (event) => {
    setShowForm(false);
    setEditingEvent(null);
    // Optimistically update/add — the socket event will also arrive, but we ensure immediate feedback
    setEvents((prev) => {
      const exists = prev.find((e) => e.id === event.id);
      return exists ? prev.map((e) => (e.id === event.id ? event : e)) : [event, ...prev];
    });
  };

  const handleDeleted = (eventId) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
  };

  const handleRegistrationChange = (eventId, registrationCount, registered) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== eventId) return e;
        const registrations = [...(e.registrations || [])];
        if (registered) {
          registrations.push(currentUser.username);
        } else {
          const idx = registrations.indexOf(currentUser.username);
          if (idx !== -1) registrations.splice(idx, 1);
        }
        return { ...e, registrations };
      })
    );
  };

  return (
    <div className="event-list-container">
      <div className="event-list-header">
        <h2>Events</h2>
        {currentUser && (
          <button onClick={() => { setEditingEvent(null); setShowForm(true); }}>
            + Create Event
          </button>
        )}
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p className="loading">Loading events…</p>}

      {!loading && events.length === 0 && (
        <p className="empty-state">No events yet. {currentUser ? 'Create the first one!' : 'Log in to create events.'}</p>
      )}

      <div className="events-grid">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            currentUser={currentUser}
            onEdit={(e) => { setEditingEvent(e); setShowForm(true); }}
            onDeleted={handleDeleted}
            onRegistrationChange={handleRegistrationChange}
          />
        ))}
      </div>

      {showForm && (
        <EventForm
          existingEvent={editingEvent}
          onSaved={handleSaved}
          onCancel={() => { setShowForm(false); setEditingEvent(null); }}
        />
      )}
    </div>
  );
}

export default EventList;
