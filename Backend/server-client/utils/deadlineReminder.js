import cron from 'node-cron';
import ProjectDeadline from '../models/ProjectDeadline.js';
import { createClientNotification } from '../controllers/clientNotificationController.js';
import nodemailer from 'nodemailer';

// Email transporter
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Schedule deadline reminders to run every hour
export const scheduleDeadlineReminders = () => {
  cron.schedule('0 * * * *', async () => {
    console.log('🔔 Running deadline reminder check...');
    await checkAndSendReminders();
  });
};

// Check for upcoming deadlines and send reminders
const checkAndSendReminders = async () => {
  try {
    const now = new Date();
    
    // Find deadlines that need reminders
    const deadlines = await ProjectDeadline.find({
      isCompleted: false,
      deadlineDate: { $gte: now },
      'reminderDates.sent': false
    }).populate('projectId', 'title')
      .populate('assignedTo', 'name email');

    for (const deadline of deadlines) {
      for (const reminder of deadline.reminderDates) {
        if (!reminder.sent && reminder.reminderDate <= now) {
          await sendDeadlineReminder(deadline, reminder);
          
          // Mark reminder as sent
          reminder.sent = true;
          reminder.sentAt = new Date();
          await deadline.save();
        }
      }
    }
  } catch (error) {
    console.error('Deadline reminder error:', error);
  }
};

// Send deadline reminder notification and email
const sendDeadlineReminder = async (deadline, reminder) => {
  try {
    const daysUntilDeadline = Math.ceil((deadline.deadlineDate - new Date()) / (1000 * 60 * 60 * 24));
    
    let reminderMessage;
    switch (reminder.reminderType) {
      case '7_days':
        reminderMessage = `Reminder: ${deadline.title} deadline is in 7 days`;
        break;
      case '3_days':
        reminderMessage = `Urgent: ${deadline.title} deadline is in 3 days`;
        break;
      case '1_day':
        reminderMessage = `Critical: ${deadline.title} deadline is tomorrow`;
        break;
      case '2_hours':
        reminderMessage = `Final Notice: ${deadline.title} deadline is in 2 hours`;
        break;
      default:
        reminderMessage = `Deadline reminder: ${deadline.title}`;
    }

    // Create notification
    await createClientNotification({
      userId: deadline.assignedTo._id,
      title: 'Deadline Reminder',
      message: reminderMessage,
      type: 'deadline_reminder',
      priority: getPriorityByReminderType(reminder.reminderType),
      projectId: deadline.projectId._id,
      actionUrl: `/projects/${deadline.projectId._id}`,
      actionText: 'View Project',
      metadata: {
        deadline: deadline.deadlineDate,
        daysUntil: daysUntilDeadline
      }
    });

    // Send email reminder
    await sendDeadlineEmail(deadline, reminder, daysUntilDeadline);

  } catch (error) {
    console.error('Send reminder error:', error);
  }
};

// Send deadline reminder email
const sendDeadlineEmail = async (deadline, reminder, daysUntilDeadline) => {
  try {
    const emailContent = {
      from: process.env.EMAIL_USER,
      to: deadline.assignedTo.email,
      subject: `Deadline Reminder: ${deadline.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #dc3545; margin: 0;">⏰ Deadline Reminder</h2>
          </div>
          
          <div style="padding: 20px;">
            <h3 style="color: #333;">${deadline.title}</h3>
            <p style="color: #666; font-size: 16px;">
              <strong>Project:</strong> ${deadline.projectId.title}
            </p>
            <p style="color: #666; font-size: 16px;">
              <strong>Deadline:</strong> ${deadline.deadlineDate.toLocaleDateString()} at ${deadline.deadlineDate.toLocaleTimeString()}
            </p>
            <p style="color: #666; font-size: 16px;">
              <strong>Time Remaining:</strong> ${daysUntilDeadline} day(s)
            </p>
            
            ${deadline.description ? `
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 0; color: #666;">${deadline.description}</p>
              </div>
            ` : ''}
            
            <div style="margin: 30px 0; text-align: center;">
              <a href="${process.env.FRONTEND_URL}/projects/${deadline.projectId._id}" 
                 style="background-color: #007bff; color: white; padding: 12px 30px; 
                        text-decoration: none; border-radius: 5px; display: inline-block;">
                View Project
              </a>
            </div>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            This is an automated reminder from WebNest. Please do not reply to this email.
          </p>
        </div>
      `
    };

    await transporter.sendMail(emailContent);
  } catch (error) {
    console.error('Deadline email error:', error);
  }
};

// Get priority based on reminder type
const getPriorityByReminderType = (reminderType) => {
  switch (reminderType) {
    case '7_days':
      return 'low';
    case '3_days':
      return 'medium';
    case '1_day':
      return 'high';
    case '2_hours':
      return 'urgent';
    default:
      return 'medium';
  }
};

// Helper function to create deadline with automatic reminders
export const createDeadlineWithReminders = async (deadlineData) => {
  const { deadlineDate } = deadlineData;
  
  // Calculate reminder dates
  const reminderDates = [];
  const deadline = new Date(deadlineDate);
  
  // 7 days before
  const sevenDaysBefore = new Date(deadline.getTime() - 7 * 24 * 60 * 60 * 1000);
  if (sevenDaysBefore > new Date()) {
    reminderDates.push({
      reminderDate: sevenDaysBefore,
      reminderType: '7_days'
    });
  }
  
  // 3 days before
  const threeDaysBefore = new Date(deadline.getTime() - 3 * 24 * 60 * 60 * 1000);
  if (threeDaysBefore > new Date()) {
    reminderDates.push({
      reminderDate: threeDaysBefore,
      reminderType: '3_days'
    });
  }
  
  // 1 day before
  const oneDayBefore = new Date(deadline.getTime() - 24 * 60 * 60 * 1000);
  if (oneDayBefore > new Date()) {
    reminderDates.push({
      reminderDate: oneDayBefore,
      reminderType: '1_day'
    });
  }
  
  // 2 hours before
  const twoHoursBefore = new Date(deadline.getTime() - 2 * 60 * 60 * 1000);
  if (twoHoursBefore > new Date()) {
    reminderDates.push({
      reminderDate: twoHoursBefore,
      reminderType: '2_hours'
    });
  }
  
  return await ProjectDeadline.create({
    ...deadlineData,
    reminderDates
  });
};