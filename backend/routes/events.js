const express = require('express');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// In-memory events store
const events = {};

// Rate limiter for mutating event routes (100 requests per 15 minutes per IP)
const mutateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * GET /api/events
 * Returns all events (public).
 */
router.get('/', (req, res) => {
  res.json(Object.values(events).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

/**
 * GET /api/events/:id
 * Returns a single event.
 */
router.get('/:id', (req, res) => {
  const event = events[req.params.id];
  if (!event) return res.status(404).json({ message: 'Event not found' });
  res.json(event);
});

/**
 * POST /api/events
 * Create a new event. Requires auth.
 * Body: { title, description, date, location, capacity }
 */
router.post('/', mutateLimiter, authenticateToken, (req, res) => {
  const { title, description, date, location, capacity } = req.body;

  if (!title || !date || !location) {
    return res.status(400).json({ message: 'title, date, and location are required' });
  }

  const event = {
    id: uuidv4(),
    title,
    description: description || '',
    date,
    location,
    capacity: capacity || null,
    status: 'upcoming',
    createdBy: req.user.username,
    registrations: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  events[event.id] = event;

  // Emit real-time notification to all connected clients
  req.io.emit('event_created', { event });

  res.status(201).json({ message: 'Event created', event });
});

/**
 * PUT /api/events/:id
 * Update an event. Requires auth and must be creator.
 */
router.put('/:id', mutateLimiter, authenticateToken, (req, res) => {
  const event = events[req.params.id];
  if (!event) return res.status(404).json({ message: 'Event not found' });

  if (event.createdBy !== req.user.username) {
    return res.status(403).json({ message: 'Not authorized to update this event' });
  }

  const { title, description, date, location, capacity, status } = req.body;
  const previousStatus = event.status;

  const updatedEvent = {
    ...event,
    title: title ?? event.title,
    description: description ?? event.description,
    date: date ?? event.date,
    location: location ?? event.location,
    capacity: capacity ?? event.capacity,
    status: status ?? event.status,
    updatedAt: new Date().toISOString(),
  };

  events[event.id] = updatedEvent;

  // Emit real-time notification
  req.io.emit('event_updated', { event: updatedEvent });

  // If status changed, notify clients subscribed to this event room
  if (status && status !== previousStatus) {
    req.io.to(`event_${event.id}`).emit('event_status_changed', {
      eventId: event.id,
      title: updatedEvent.title,
      previousStatus,
      newStatus: status,
    });
  }

  res.json({ message: 'Event updated', event: updatedEvent });
});

/**
 * DELETE /api/events/:id
 * Delete an event. Requires auth and must be creator.
 */
router.delete('/:id', mutateLimiter, authenticateToken, (req, res) => {
  const event = events[req.params.id];
  if (!event) return res.status(404).json({ message: 'Event not found' });

  if (event.createdBy !== req.user.username) {
    return res.status(403).json({ message: 'Not authorized to delete this event' });
  }

  delete events[event.id];

  req.io.emit('event_deleted', { eventId: event.id });

  res.json({ message: 'Event deleted' });
});

/**
 * POST /api/events/:id/register
 * Register current user for an event. Requires auth.
 */
router.post('/:id/register', mutateLimiter, authenticateToken, (req, res) => {
  const event = events[req.params.id];
  if (!event) return res.status(404).json({ message: 'Event not found' });

  if (event.status === 'cancelled') {
    return res.status(400).json({ message: 'Cannot register for a cancelled event' });
  }

  if (event.registrations.includes(req.user.username)) {
    return res.status(409).json({ message: 'Already registered for this event' });
  }

  if (event.capacity && event.registrations.length >= event.capacity) {
    return res.status(400).json({ message: 'Event is at full capacity' });
  }

  event.registrations.push(req.user.username);
  event.updatedAt = new Date().toISOString();

  // Notify clients in the event room about new registration
  req.io.to(`event_${event.id}`).emit('event_registration', {
    eventId: event.id,
    title: event.title,
    username: req.user.username,
    registrationCount: event.registrations.length,
  });

  res.json({ message: 'Registered successfully', registrationCount: event.registrations.length });
});

/**
 * DELETE /api/events/:id/register
 * Cancel registration for an event. Requires auth.
 */
router.delete('/:id/register', mutateLimiter, authenticateToken, (req, res) => {
  const event = events[req.params.id];
  if (!event) return res.status(404).json({ message: 'Event not found' });

  const idx = event.registrations.indexOf(req.user.username);
  if (idx === -1) {
    return res.status(404).json({ message: 'Not registered for this event' });
  }

  event.registrations.splice(idx, 1);
  event.updatedAt = new Date().toISOString();

  req.io.to(`event_${event.id}`).emit('event_unregistration', {
    eventId: event.id,
    title: event.title,
    username: req.user.username,
    registrationCount: event.registrations.length,
  });

  res.json({ message: 'Registration cancelled', registrationCount: event.registrations.length });
});

// Export events for testing
module.exports = router;
module.exports.events = events;
