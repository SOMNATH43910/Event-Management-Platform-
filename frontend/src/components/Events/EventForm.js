import React, { useState } from 'react';
import { createEvent, updateEvent } from '../../services/api';

const STATUSES = ['upcoming', 'ongoing', 'completed', 'cancelled'];

function EventForm({ existingEvent, onSaved, onCancel }) {
  const isEdit = Boolean(existingEvent);
  const [form, setForm] = useState({
    title: existingEvent?.title || '',
    description: existingEvent?.description || '',
    date: existingEvent?.date || '',
    location: existingEvent?.location || '',
    capacity: existingEvent?.capacity || '',
    status: existingEvent?.status || 'upcoming',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        capacity: form.capacity ? Number(form.capacity) : null,
      };
      const res = isEdit
        ? await updateEvent(existingEvent.id, payload)
        : await createEvent(payload);
      onSaved(res.data.event);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{isEdit ? 'Edit Event' : 'Create New Event'}</h2>
        <form onSubmit={handleSubmit} className="event-form">
          <label>Title *
            <input name="title" value={form.title} onChange={handleChange} required />
          </label>
          <label>Description
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
          </label>
          <label>Date *
            <input name="date" type="datetime-local" value={form.date} onChange={handleChange} required />
          </label>
          <label>Location *
            <input name="location" value={form.location} onChange={handleChange} required />
          </label>
          <label>Capacity
            <input name="capacity" type="number" min="1" value={form.capacity} onChange={handleChange} placeholder="Unlimited" />
          </label>
          {isEdit && (
            <label>Status
              <select name="status" value={form.status} onChange={handleChange}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
          )}
          {error && <p className="error">{error}</p>}
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
            <button type="submit" disabled={loading}>{loading ? 'Saving…' : isEdit ? 'Update Event' : 'Create Event'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventForm;
