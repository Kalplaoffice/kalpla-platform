import { generateClient } from 'aws-amplify/api';
import { 
  CREATE_NOTIFICATION,
  UPDATE_NOTIFICATION,
  DELETE_NOTIFICATION,
  CREATE_NOTIFICATION_TEMPLATE,
  UPDATE_NOTIFICATION_TEMPLATE,
  DELETE_NOTIFICATION_TEMPLATE,
  CREATE_NOTIFICATION_PREFERENCE,
  UPDATE_NOTIFICATION_PREFERENCE,
  CREATE_NOTIFICATION_SCHEDULE,
  UPDATE_NOTIFICATION_SCHEDULE,
  DELETE_NOTIFICATION_SCHEDULE
} from '../graphql/mutations';
import {
  GET_NOTIFICATIONS,
  GET_NOTIFICATION_TEMPLATES,
  GET_NOTIFICATION_PREFERENCES,
  GET_NOTIFICATION_SCHEDULES,
  GET_USER_NOTIFICATIONS,
  GET_NOTIFICATION_STATS
} from '../graphql/queries';

const client = generateClient();

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  priority: NotificationPriority;
  status: NotificationStatus;
  isRead: boolean;
  isArchived: boolean;
  scheduledFor?: string;
  sentAt?: string;
  readAt?: string;
  archivedAt?: string;
  metadata: NotificationMetadata;
  templateId?: string;
  createdAt: string;
  updatedAt: string;
}

export type NotificationType = 
  | 'assignment_due' 
  | 'assignment_submitted' 
  | 'assignment_graded' 
  | 'class_schedule' 
  | 'class_reminder' 
  | 'class_cancelled' 
  | 'payment_due' 
  | 'payment_received' 
  | 'payment_failed' 
  | 'course_enrolled' 
  | 'course_completed' 
  | 'certificate_ready' 
  | 'mentor_assigned' 
  | 'mentor_message' 
  | 'system_update' 
  | 'general';

export type NotificationCategory = 
  | 'academic' 
  | 'schedule' 
  | 'financial' 
  | 'system' 
  | 'social' 
  | 'reminder';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export type NotificationStatus = 'pending' | 'sent' | 'delivered' | 'failed' | 'cancelled';

export interface NotificationMetadata {
  courseId?: string;
  courseName?: string;
  assignmentId?: string;
  assignmentName?: string;
  classId?: string;
  className?: string;
  paymentId?: string;
  amount?: number;
  dueDate?: string;
  scheduleDate?: string;
  mentorId?: string;
  mentorName?: string;
  certificateId?: string;
  [key: string]: any;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  variables: string[];
  isActive: boolean;
  isDefault: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreference {
  id: string;
  userId: string;
  type: NotificationType;
  category: NotificationCategory;
  emailEnabled: boolean;
  pushEnabled: boolean;
  smsEnabled: boolean;
  inAppEnabled: boolean;
  frequency: NotificationFrequency;
  quietHours: QuietHours;
  createdAt: string;
  updatedAt: string;
}

export type NotificationFrequency = 'immediate' | 'hourly' | 'daily' | 'weekly' | 'never';

export interface QuietHours {
  enabled: boolean;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  timezone: string;
  days: number[]; // 0-6 (Sunday-Saturday)
}

export interface NotificationSchedule {
  id: string;
  name: string;
  type: NotificationType;
  category: NotificationCategory;
  templateId: string;
  triggerType: TriggerType;
  triggerConditions: TriggerCondition[];
  isActive: boolean;
  lastTriggered?: string;
  nextTrigger?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type TriggerType = 
  | 'assignment_due' 
  | 'class_start' 
  | 'payment_due' 
  | 'course_completion' 
  | 'schedule_change' 
  | 'custom';

export interface TriggerCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'between';
  value: any;
  unit?: 'days' | 'hours' | 'minutes';
}

export interface AssignmentReminder {
  assignmentId: string;
  assignmentName: string;
  courseId: string;
  courseName: string;
  dueDate: string;
  userId: string;
  reminderTimes: number[]; // Days before due date
}

export interface ClassScheduleNotification {
  classId: string;
  className: string;
  courseId: string;
  courseName: string;
  scheduleDate: string;
  startTime: string;
  endTime: string;
  location?: string;
  meetingLink?: string;
  userId: string;
  reminderTimes: number[]; // Minutes before class
}

export interface PaymentNotification {
  paymentId: string;
  userId: string;
  amount: number;
  currency: string;
  dueDate?: string;
  status: 'pending' | 'completed' | 'failed' | 'overdue';
  description: string;
  courseId?: string;
  courseName?: string;
}

export interface NotificationStats {
  totalNotifications: number;
  unreadNotifications: number;
  notificationsByType: { [key: string]: number };
  notificationsByCategory: { [key: string]: number };
  averageResponseTime: number;
  deliveryRate: number;
  readRate: number;
  userEngagement: number;
}

class NotificationService {
  /**
   * Create notification
   */
  async createNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>): Promise<Notification> {
    try {
      const result = await client.graphql({
        query: CREATE_NOTIFICATION,
        variables: {
          input: {
            ...notification,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.createNotification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw new Error('Failed to create notification');
    }
  }

  /**
   * Get notifications for user
   */
  async getUserNotifications(userId: string, filters?: {
    type?: NotificationType;
    category?: NotificationCategory;
    status?: NotificationStatus;
    isRead?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<Notification[]> {
    try {
      const result = await client.graphql({
        query: GET_USER_NOTIFICATIONS,
        variables: { userId, ...filters }
      });

      return result.data.getUserNotifications || [];
    } catch (error) {
      console.error('Error getting user notifications:', error);
      return [];
    }
  }

  /**
   * Get all notifications (admin)
   */
  async getNotifications(filters?: {
    type?: NotificationType;
    category?: NotificationCategory;
    status?: NotificationStatus;
    userId?: string;
    limit?: number;
    offset?: number;
  }): Promise<Notification[]> {
    try {
      const result = await client.graphql({
        query: GET_NOTIFICATIONS,
        variables: filters
      });

      return result.data.getNotifications || [];
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  }

  /**
   * Update notification
   */
  async updateNotification(id: string, updates: Partial<Notification>): Promise<Notification> {
    try {
      const result = await client.graphql({
        query: UPDATE_NOTIFICATION,
        variables: {
          input: {
            id,
            ...updates,
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.updateNotification;
    } catch (error) {
      console.error('Error updating notification:', error);
      throw new Error('Failed to update notification');
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(id: string): Promise<Notification> {
    try {
      return await this.updateNotification(id, {
        isRead: true,
        readAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw new Error('Failed to mark notification as read');
    }
  }

  /**
   * Mark notification as archived
   */
  async markAsArchived(id: string): Promise<Notification> {
    try {
      return await this.updateNotification(id, {
        isArchived: true,
        archivedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error marking notification as archived:', error);
      throw new Error('Failed to mark notification as archived');
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const notifications = await this.getUserNotifications(userId, { isRead: false });
      
      await Promise.all(
        notifications.map(notification => 
          this.markAsRead(notification.id)
        )
      );

      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(id: string): Promise<boolean> {
    try {
      await client.graphql({
        query: DELETE_NOTIFICATION,
        variables: { input: { id } }
      });

      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }

  /**
   * Create assignment due reminder
   */
  async createAssignmentDueReminder(reminder: AssignmentReminder): Promise<Notification[]> {
    try {
      const notifications: Notification[] = [];
      
      for (const daysBefore of reminder.reminderTimes) {
        const reminderDate = new Date(reminder.dueDate);
        reminderDate.setDate(reminderDate.getDate() - daysBefore);
        
        const notification = await this.createNotification({
          userId: reminder.userId,
          title: `Assignment Due Reminder`,
          message: `Your assignment "${reminder.assignmentName}" is due in ${daysBefore} day${daysBefore > 1 ? 's' : ''}.`,
          type: 'assignment_due',
          category: 'academic',
          priority: daysBefore <= 1 ? 'urgent' : daysBefore <= 3 ? 'high' : 'medium',
          status: 'pending',
          isRead: false,
          isArchived: false,
          scheduledFor: reminderDate.toISOString(),
          metadata: {
            assignmentId: reminder.assignmentId,
            assignmentName: reminder.assignmentName,
            courseId: reminder.courseId,
            courseName: reminder.courseName,
            dueDate: reminder.dueDate,
            daysBefore
          }
        });
        
        notifications.push(notification);
      }
      
      return notifications;
    } catch (error) {
      console.error('Error creating assignment due reminder:', error);
      throw new Error('Failed to create assignment due reminder');
    }
  }

  /**
   * Create class schedule notification
   */
  async createClassScheduleNotification(schedule: ClassScheduleNotification): Promise<Notification[]> {
    try {
      const notifications: Notification[] = [];
      
      for (const minutesBefore of schedule.reminderTimes) {
        const reminderTime = new Date(`${schedule.scheduleDate}T${schedule.startTime}`);
        reminderTime.setMinutes(reminderTime.getMinutes() - minutesBefore);
        
        const notification = await this.createNotification({
          userId: schedule.userId,
          title: `Class Reminder`,
          message: `Your class "${schedule.className}" starts in ${minutesBefore} minute${minutesBefore > 1 ? 's' : ''}.`,
          type: 'class_reminder',
          category: 'schedule',
          priority: minutesBefore <= 15 ? 'urgent' : minutesBefore <= 60 ? 'high' : 'medium',
          status: 'pending',
          isRead: false,
          isArchived: false,
          scheduledFor: reminderTime.toISOString(),
          metadata: {
            classId: schedule.classId,
            className: schedule.className,
            courseId: schedule.courseId,
            courseName: schedule.courseName,
            scheduleDate: schedule.scheduleDate,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            location: schedule.location,
            meetingLink: schedule.meetingLink,
            minutesBefore
          }
        });
        
        notifications.push(notification);
      }
      
      return notifications;
    } catch (error) {
      console.error('Error creating class schedule notification:', error);
      throw new Error('Failed to create class schedule notification');
    }
  }

  /**
   * Create payment update notification
   */
  async createPaymentUpdateNotification(payment: PaymentNotification): Promise<Notification> {
    try {
      let title: string;
      let message: string;
      let priority: NotificationPriority;
      let type: NotificationType;

      switch (payment.status) {
        case 'pending':
          title = 'Payment Pending';
          message = `Your payment of ${payment.amount} ${payment.currency} for ${payment.description} is pending.`;
          priority = 'medium';
          type = 'payment_due';
          break;
        case 'completed':
          title = 'Payment Received';
          message = `Your payment of ${payment.amount} ${payment.currency} for ${payment.description} has been received.`;
          priority = 'low';
          type = 'payment_received';
          break;
        case 'failed':
          title = 'Payment Failed';
          message = `Your payment of ${payment.amount} ${payment.currency} for ${payment.description} has failed. Please try again.`;
          priority = 'high';
          type = 'payment_failed';
          break;
        case 'overdue':
          title = 'Payment Overdue';
          message = `Your payment of ${payment.amount} ${payment.currency} for ${payment.description} is overdue.`;
          priority = 'urgent';
          type = 'payment_due';
          break;
        default:
          title = 'Payment Update';
          message = `Payment update for ${payment.description}.`;
          priority = 'medium';
          type = 'payment_due';
      }

      return await this.createNotification({
        userId: payment.userId,
        title,
        message,
        type,
        category: 'financial',
        priority,
        status: 'pending',
        isRead: false,
        isArchived: false,
        metadata: {
          paymentId: payment.paymentId,
          amount: payment.amount,
          currency: payment.currency,
          dueDate: payment.dueDate,
          courseId: payment.courseId,
          courseName: payment.courseName,
          description: payment.description
        }
      });
    } catch (error) {
      console.error('Error creating payment update notification:', error);
      throw new Error('Failed to create payment update notification');
    }
  }

  /**
   * Send notification immediately
   */
  async sendNotification(notification: Notification): Promise<Notification> {
    try {
      // In a real implementation, this would integrate with email, push, SMS services
      const updatedNotification = await this.updateNotification(notification.id, {
        status: 'sent',
        sentAt: new Date().toISOString()
      });

      // Send via different channels based on user preferences
      await this.sendViaChannels(notification);

      return updatedNotification;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw new Error('Failed to send notification');
    }
  }

  /**
   * Send notification via different channels
   */
  private async sendViaChannels(notification: Notification): Promise<void> {
    try {
      const preferences = await this.getNotificationPreferences(notification.userId);
      
      for (const preference of preferences) {
        if (preference.type === notification.type || preference.category === notification.category) {
          if (preference.emailEnabled) {
            await this.sendEmail(notification);
          }
          if (preference.pushEnabled) {
            await this.sendPush(notification);
          }
          if (preference.smsEnabled) {
            await this.sendSMS(notification);
          }
          if (preference.inAppEnabled) {
            await this.sendInApp(notification);
          }
        }
      }
    } catch (error) {
      console.error('Error sending via channels:', error);
    }
  }

  /**
   * Send email notification
   */
  private async sendEmail(notification: Notification): Promise<void> {
    // In a real implementation, this would integrate with SES, SendGrid, etc.
    console.log(`Sending email notification: ${notification.title}`);
  }

  /**
   * Send push notification
   */
  private async sendPush(notification: Notification): Promise<void> {
    // In a real implementation, this would integrate with FCM, APNS, etc.
    console.log(`Sending push notification: ${notification.title}`);
  }

  /**
   * Send SMS notification
   */
  private async sendSMS(notification: Notification): Promise<void> {
    // In a real implementation, this would integrate with SNS, Twilio, etc.
    console.log(`Sending SMS notification: ${notification.title}`);
  }

  /**
   * Send in-app notification
   */
  private async sendInApp(notification: Notification): Promise<void> {
    // In a real implementation, this would update the in-app notification system
    console.log(`Sending in-app notification: ${notification.title}`);
  }

  /**
   * Get notification templates
   */
  async getNotificationTemplates(): Promise<NotificationTemplate[]> {
    try {
      const result = await client.graphql({
        query: GET_NOTIFICATION_TEMPLATES
      });

      return result.data.getNotificationTemplates || [];
    } catch (error) {
      console.error('Error getting notification templates:', error);
      return [];
    }
  }

  /**
   * Create notification template
   */
  async createNotificationTemplate(template: Omit<NotificationTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<NotificationTemplate> {
    try {
      const result = await client.graphql({
        query: CREATE_NOTIFICATION_TEMPLATE,
        variables: {
          input: {
            ...template,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.createNotificationTemplate;
    } catch (error) {
      console.error('Error creating notification template:', error);
      throw new Error('Failed to create notification template');
    }
  }

  /**
   * Update notification template
   */
  async updateNotificationTemplate(id: string, updates: Partial<NotificationTemplate>): Promise<NotificationTemplate> {
    try {
      const result = await client.graphql({
        query: UPDATE_NOTIFICATION_TEMPLATE,
        variables: {
          input: {
            id,
            ...updates,
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.updateNotificationTemplate;
    } catch (error) {
      console.error('Error updating notification template:', error);
      throw new Error('Failed to update notification template');
    }
  }

  /**
   * Delete notification template
   */
  async deleteNotificationTemplate(id: string): Promise<boolean> {
    try {
      await client.graphql({
        query: DELETE_NOTIFICATION_TEMPLATE,
        variables: { input: { id } }
      });

      return true;
    } catch (error) {
      console.error('Error deleting notification template:', error);
      return false;
    }
  }

  /**
   * Get notification preferences
   */
  async getNotificationPreferences(userId: string): Promise<NotificationPreference[]> {
    try {
      const result = await client.graphql({
        query: GET_NOTIFICATION_PREFERENCES,
        variables: { userId }
      });

      return result.data.getNotificationPreferences || [];
    } catch (error) {
      console.error('Error getting notification preferences:', error);
      return [];
    }
  }

  /**
   * Create notification preference
   */
  async createNotificationPreference(preference: Omit<NotificationPreference, 'id' | 'createdAt' | 'updatedAt'>): Promise<NotificationPreference> {
    try {
      const result = await client.graphql({
        query: CREATE_NOTIFICATION_PREFERENCE,
        variables: {
          input: {
            ...preference,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.createNotificationPreference;
    } catch (error) {
      console.error('Error creating notification preference:', error);
      throw new Error('Failed to create notification preference');
    }
  }

  /**
   * Update notification preference
   */
  async updateNotificationPreference(id: string, updates: Partial<NotificationPreference>): Promise<NotificationPreference> {
    try {
      const result = await client.graphql({
        query: UPDATE_NOTIFICATION_PREFERENCE,
        variables: {
          input: {
            id,
            ...updates,
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.updateNotificationPreference;
    } catch (error) {
      console.error('Error updating notification preference:', error);
      throw new Error('Failed to update notification preference');
    }
  }

  /**
   * Get notification schedules
   */
  async getNotificationSchedules(): Promise<NotificationSchedule[]> {
    try {
      const result = await client.graphql({
        query: GET_NOTIFICATION_SCHEDULES
      });

      return result.data.getNotificationSchedules || [];
    } catch (error) {
      console.error('Error getting notification schedules:', error);
      return [];
    }
  }

  /**
   * Create notification schedule
   */
  async createNotificationSchedule(schedule: Omit<NotificationSchedule, 'id' | 'createdAt' | 'updatedAt'>): Promise<NotificationSchedule> {
    try {
      const result = await client.graphql({
        query: CREATE_NOTIFICATION_SCHEDULE,
        variables: {
          input: {
            ...schedule,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.createNotificationSchedule;
    } catch (error) {
      console.error('Error creating notification schedule:', error);
      throw new Error('Failed to create notification schedule');
    }
  }

  /**
   * Update notification schedule
   */
  async updateNotificationSchedule(id: string, updates: Partial<NotificationSchedule>): Promise<NotificationSchedule> {
    try {
      const result = await client.graphql({
        query: UPDATE_NOTIFICATION_SCHEDULE,
        variables: {
          input: {
            id,
            ...updates,
            updatedAt: new Date().toISOString()
          }
        }
      });

      return result.data.updateNotificationSchedule;
    } catch (error) {
      console.error('Error updating notification schedule:', error);
      throw new Error('Failed to update notification schedule');
    }
  }

  /**
   * Delete notification schedule
   */
  async deleteNotificationSchedule(id: string): Promise<boolean> {
    try {
      await client.graphql({
        query: DELETE_NOTIFICATION_SCHEDULE,
        variables: { input: { id } }
      });

      return true;
    } catch (error) {
      console.error('Error deleting notification schedule:', error);
      return false;
    }
  }

  /**
   * Get notification statistics
   */
  async getNotificationStats(): Promise<NotificationStats> {
    try {
      const result = await client.graphql({
        query: GET_NOTIFICATION_STATS
      });

      return result.data.getNotificationStats;
    } catch (error) {
      console.error('Error getting notification stats:', error);
      return {
        totalNotifications: 0,
        unreadNotifications: 0,
        notificationsByType: {},
        notificationsByCategory: {},
        averageResponseTime: 0,
        deliveryRate: 0,
        readRate: 0,
        userEngagement: 0
      };
    }
  }

  /**
   * Process scheduled notifications
   */
  async processScheduledNotifications(): Promise<void> {
    try {
      const now = new Date().toISOString();
      const notifications = await this.getNotifications({
        status: 'pending',
        limit: 100
      });

      const dueNotifications = notifications.filter(notification => 
        notification.scheduledFor && notification.scheduledFor <= now
      );

      for (const notification of dueNotifications) {
        await this.sendNotification(notification);
      }
    } catch (error) {
      console.error('Error processing scheduled notifications:', error);
    }
  }

  /**
   * Format date
   */
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Format priority
   */
  formatPriority(priority: NotificationPriority): { label: string; color: string } {
    switch (priority) {
      case 'urgent':
        return { label: 'Urgent', color: 'text-red-600 bg-red-100' };
      case 'high':
        return { label: 'High', color: 'text-orange-600 bg-orange-100' };
      case 'medium':
        return { label: 'Medium', color: 'text-yellow-600 bg-yellow-100' };
      case 'low':
        return { label: 'Low', color: 'text-green-600 bg-green-100' };
      default:
        return { label: 'Unknown', color: 'text-gray-600 bg-gray-100' };
    }
  }

  /**
   * Format status
   */
  formatStatus(status: NotificationStatus): { label: string; color: string } {
    switch (status) {
      case 'pending':
        return { label: 'Pending', color: 'text-yellow-600 bg-yellow-100' };
      case 'sent':
        return { label: 'Sent', color: 'text-blue-600 bg-blue-100' };
      case 'delivered':
        return { label: 'Delivered', color: 'text-green-600 bg-green-100' };
      case 'failed':
        return { label: 'Failed', color: 'text-red-600 bg-red-100' };
      case 'cancelled':
        return { label: 'Cancelled', color: 'text-gray-600 bg-gray-100' };
      default:
        return { label: 'Unknown', color: 'text-gray-600 bg-gray-100' };
    }
  }

  /**
   * Get notification type icon
   */
  getNotificationTypeIcon(type: NotificationType): string {
    switch (type) {
      case 'assignment_due':
      case 'assignment_submitted':
      case 'assignment_graded':
        return '📝';
      case 'class_schedule':
      case 'class_reminder':
      case 'class_cancelled':
        return '📅';
      case 'payment_due':
      case 'payment_received':
      case 'payment_failed':
        return '💳';
      case 'course_enrolled':
      case 'course_completed':
        return '🎓';
      case 'certificate_ready':
        return '🏆';
      case 'mentor_assigned':
      case 'mentor_message':
        return '👨‍🏫';
      case 'system_update':
        return '⚙️';
      default:
        return '🔔';
    }
  }
}

export const notificationService = new NotificationService();
