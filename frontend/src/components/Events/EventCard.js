import React from 'react';
import { deleteEvent, registerForEvent, cancelRegistration } from '../../services/api';

const STATUS_COLORS = {
  upcoming: '#1976d2',
  ongoing: '#388e3c',
  completed: '#757575',
  cancelled: '#d32f2f',
};

function EventCard({ event, currentUser, onEdit, onDeleted, onRegistrationChange }) {
  const isOwner = currentUser && event.createdBy === currentUser.username;
  const isRegistered = currentUser && event.registrations?.includes(currentUser.username);
  const isFull = event.capacity && event.registrations?.length >= event.capacity;

  const handleDelete = async () => {
    if (!window.confirm(`Delete event "${event.title}"?`)) return;
    try {
      await deleteEvent(event.id);
      onDeleted(event.id);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete event');
    }
  };

  const handleRegister = async () => {
    try {
      const res = await registerForEvent(event.id);
      onRegistrationChange(event.id, res.data.registrationCount, true);
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleCancel = async () => {
    try {
      const res = await cancelRegistration(event.id);
      onRegistrationChange(event.id, res.data.registrationCount, false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel registration');
    }
  };

  const formattedDate = event.date
    ? new Date(event.date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
    : 'TBD';

  return (
    <div className="event-card">
      <div className="event-card-header">
        <h3>{event.title}</h3>
        <span
          className="status-badge"
          style={{ backgroundColor: STATUS_COLORS[event.status] || '#757575' }}
        >
          {event.status}
        </span>
      </div>
      {event.description && <p className="event-description">{event.description}</p>}
      <div className="event-meta">
        <span>📅 {formattedDate}</span>
        <span>📍 {event.location}</span>
        <span>👤 {event.createdBy}</span>
        <span>
          🎟 {event.registrations?.length || 0}
          {event.capacity ? ` / ${event.capacity}` : ''} registered
        </span>
      </div>
      {currentUser && (
        <div className="event-actions">
          {isOwner ? (
            <>
              <button className="btn-secondary" onClick={() => onEdit(event)}>Edit</button>
              <button className="btn-danger" onClick={handleDelete}>Delete</button>
            </>
          ) : (
            isRegistered ? (
              <button className="btn-secondary" onClick={handleCancel}>Cancel Registration</button>
            ) : (
              <button
                onClick={handleRegister}
                disabled={isFull || event.status === 'cancelled' || event.status === 'completed'}
              >
                {isFull ? 'Full' : 'Register'}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default EventCard;
