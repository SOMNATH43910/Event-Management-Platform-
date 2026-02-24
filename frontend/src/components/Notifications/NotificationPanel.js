import React, { useEffect, useState } from 'react';

const MAX_NOTIFICATIONS = 20;

function NotificationPanel({ socket }) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!socket) return;

    const addNotification = (message, type = 'info') => {
      const notification = {
        id: Date.now(),
        message,
        type,
        time: new Date().toLocaleTimeString(),
      };
      setNotifications((prev) => [notification, ...prev].slice(0, MAX_NOTIFICATIONS));
      if (!open) setUnread((n) => n + 1);
    };

    socket.on('event_created', ({ event }) => {
      addNotification(`New event created: "${event.title}"`, 'success');
    });

    socket.on('event_updated', ({ event }) => {
      addNotification(`Event updated: "${event.title}"`, 'info');
    });

    socket.on('event_deleted', ({ eventId }) => {
      addNotification(`An event was deleted (ID: ${eventId})`, 'warning');
    });

    socket.on('event_status_changed', ({ title, previousStatus, newStatus }) => {
      addNotification(`"${title}" status changed: ${previousStatus} → ${newStatus}`, 'warning');
    });

    socket.on('event_registration', ({ title, username, registrationCount }) => {
      addNotification(`${username} registered for "${title}" (${registrationCount} total)`, 'info');
    });

    return () => {
      socket.off('event_created');
      socket.off('event_updated');
      socket.off('event_deleted');
      socket.off('event_status_changed');
      socket.off('event_registration');
    };
  }, [socket, open]);

  const handleOpen = () => {
    setOpen(true);
    setUnread(0);
  };

  const handleClose = () => setOpen(false);

  const TYPE_COLORS = { success: '#388e3c', info: '#1976d2', warning: '#f57c00', error: '#d32f2f' };

  return (
    <div className="notification-panel">
      <button className="notification-bell" onClick={open ? handleClose : handleOpen} title="Notifications">
        🔔{unread > 0 && <span className="badge">{unread}</span>}
      </button>

      {open && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h4>Notifications</h4>
            <button className="link-btn" onClick={() => setNotifications([])}>Clear all</button>
          </div>
          {notifications.length === 0 ? (
            <p className="notification-empty">No notifications yet</p>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className="notification-item" style={{ borderLeftColor: TYPE_COLORS[n.type] }}>
                <span className="notification-message">{n.message}</span>
                <span className="notification-time">{n.time}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationPanel;
