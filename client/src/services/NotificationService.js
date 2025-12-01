// Notification service for user-side notifications
export const NotificationService = {
  // Poll for user notifications
  async getUserNotifications(userId) {
    try {
      const response = await fetch(`http://localhost:8001/api/notifications/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.notifications || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      await fetch(`http://localhost:8001/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  },

  // Get recent notifications from localStorage as fallback
  getRecentNotifications() {
    const notifications = localStorage.getItem('recentNotifications');
    return notifications ? JSON.parse(notifications) : [];
  },

  // Add notification to localStorage
  addNotification(notification) {
    const notifications = this.getRecentNotifications();
    const newNotification = {
      id: Date.now(),
      message: notification.message,
      type: notification.type || 'info',
      timestamp: new Date().toISOString(),
      read: false
    };
    
    notifications.unshift(newNotification);
    // Keep only last 10 notifications
    if (notifications.length > 10) {
      notifications.splice(10);
    }
    
    localStorage.setItem('recentNotifications', JSON.stringify(notifications));
    return newNotification;
  }
};