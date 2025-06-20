# WebNest Client Service API Documentation

## Overview
This document provides comprehensive information about all API endpoints available in the WebNest Client Service. The service handles all client-side operations including project management, file uploads, revisions, notifications, and more.

## Base URL
```
http://localhost:5001/api
```

## Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### 🔐 Authentication Routes (`/auth`)
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user
- `POST /auth/forgot-password` - Forgot password
- `PUT /auth/reset-password/:resetToken` - Reset password
- `PUT /auth/update-password` - Update password
- `GET /auth/verify-email/:token` - Verify email

### 👤 Profile Routes (`/profile`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `POST /profile/avatar` - Upload avatar
- `DELETE /profile` - Delete account
- `POST /profile/upgrade-premium` - Upgrade to premium
- `GET /profile/stats` - Get user stats

### 📋 Project Routes (`/projects`)
- `POST /projects` - Create new project
- `GET /projects` - Get user's projects
- `GET /projects/:id` - Get single project
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id` - Cancel project
- `POST /projects/:id/feedback` - Add feedback
- `GET /projects/:id/progress` - Get project progress
- `POST /projects/:id/upload` - Upload project file

### 🎨 Theme Routes (`/themes`)
- `GET /themes` - Get all themes
- `GET /themes/search` - Search themes
- `GET /themes/category/:category` - Get themes by category
- `GET /themes/:id` - Get single theme
- `POST /themes/:id/rate` - Rate theme

### 💬 Chat Routes (`/chat`)
- `GET /chat/project/:projectId` - Get project chat messages
- `POST /chat/project/:projectId/message` - Send chat message
- `PUT /chat/message/:messageId/read` - Mark message as read
- `GET /chat/unread-count` - Get unread message count

### 🔔 Notification Routes (`/notifications`)
- `GET /notifications` - Get user notifications
- `PUT /notifications/:id/read` - Mark notification as read
- `PUT /notifications/read-all` - Mark all notifications as read
- `DELETE /notifications/:id` - Delete notification

### ⭐ Review Routes (`/reviews`)
- `POST /reviews` - Create review
- `GET /reviews/developer/:developerId` - Get developer reviews
- `PUT /reviews/:id/respond` - Respond to review

### 🎫 Support Routes (`/support`)
- `POST /support/tickets` - Create support ticket
- `GET /support/tickets` - Get user tickets
- `GET /support/tickets/:id` - Get single ticket
- `POST /support/tickets/:id/messages` - Add ticket message
- `PUT /support/tickets/:id/rate` - Rate ticket resolution

### 💰 Budget Routes (`/budget`)
- `POST /budget/calculate` - Calculate project budget
- `GET /budget/templates` - Get budget templates
- `POST /budget/save` - Save budget calculation

### 🚀 Onboarding Routes (`/onboarding`)
- `GET /onboarding/progress` - Get onboarding progress
- `PUT /onboarding/step/:stepId` - Update onboarding step
- `POST /onboarding/skip` - Skip onboarding
- `POST /onboarding/reset` - Reset onboarding

### 📊 Demo Routes (`/demo`)
- `GET /demo/dashboard` - Get demo dashboard data
- `GET /demo/developer-dashboard` - Get demo developer dashboard
- `GET /demo/client-insights` - Get client insight cards
- `GET /demo/activity-summary` - Get activity summary

### 📄 Quote Routes (`/quotes`)
- `POST /quotes/generate` - Generate quote
- `GET /quotes` - Get user quotes
- `GET /quotes/:id` - Get single quote
- `PUT /quotes/:id/accept` - Accept quote
- `PUT /quotes/:id/reject` - Reject quote

### 🎯 Milestone Routes (`/milestones`)
- `GET /projects/:projectId/milestones` - Get project milestones
- `PUT /milestones/:id/progress` - Update milestone progress
- `PUT /milestones/:id/feedback` - Submit milestone feedback

### 📱 Status Routes (`/status`)
- `PUT /status/online` - Update online status
- `GET /status/project/:projectId` - Get project online users
- `GET /status/:userId` - Get user status

### 🎨 Template Routes (`/templates`)
- `GET /templates` - Get all templates
- `GET /templates/:id` - Get single template
- `POST /templates/:id/rate` - Rate template

### ⚙️ Preferences Routes (`/preferences`)
- `GET /preferences` - Get user preferences
- `PUT /preferences` - Update user preferences
- `PUT /preferences/location` - Update location

### 📈 Activity Routes (`/activity`)
- `GET /activity/project/:projectId` - Get project activity feed
- `GET /activity/user` - Get user activity feed
- `POST /activity/log` - Create activity log
- `GET /activity/stats/:projectId` - Get activity statistics

### 📁 File Routes (`/files`)
- `POST /files/upload/:projectId` - Upload project file
- `GET /files/project/:projectId` - Get project files
- `GET /files/download/:fileId` - Download project file
- `DELETE /files/:fileId` - Delete project file
- `GET /files/stats/:projectId` - Get file statistics

### 🔔 Client Notification Routes (`/notifications/client`)
- `GET /notifications/client` - Get client notifications
- `PUT /notifications/client/:id/read` - Mark notification as read
- `PUT /notifications/client/read-all` - Mark all notifications as read
- `DELETE /notifications/client/:id` - Delete notification
- `GET /notifications/client/preferences` - Get notification preferences
- `PUT /notifications/client/preferences` - Update notification preferences

### 🔄 Revision Routes (`/revisions`)
- `POST /revisions/request` - Create revision request
- `GET /revisions/project/:projectId` - Get project revisions
- `GET /revisions/:id` - Get single revision
- `PUT /revisions/:id` - Update revision request
- `DELETE /revisions/:id` - Cancel revision request
- `PUT /revisions/:id/feedback` - Submit revision feedback
- `GET /revisions/stats/:projectId` - Get revision statistics

### 🤝 Collaboration Routes (`/collaboration`)
- `POST /collaboration/invite` - Invite collaborator
- `PUT /collaboration/accept/:projectId` - Accept collaboration
- `GET /collaboration/project/:projectId` - Get project collaborators

### ⏱️ Time Tracking Routes (`/time-tracking`)
- `POST /time-tracking/start` - Start time tracking
- `PUT /time-tracking/stop/:sessionId` - Stop time tracking
- `GET /time-tracking/project/:projectId` - Get project time tracking

### 💾 Backup Routes (`/backup`)
- `POST /backup/create/:projectId` - Create project backup
- `GET /backup/project/:projectId` - Get project backups
- `PUT /backup/restore/:backupId` - Restore project backup

## Request/Response Examples

### Create Project
```javascript
POST /api/projects
{
  "title": "My E-commerce Website",
  "description": "A modern e-commerce platform for selling products online",
  "projectType": "ecommerce",
  "budget": 25000,
  "selectedTheme": "theme_id_here",
  "features": [
    {
      "name": "Payment Gateway",
      "selected": true,
      "price": 5000
    }
  ]
}
```

### Upload File
```javascript
POST /api/files/upload/:projectId
Content-Type: multipart/form-data

file: [binary data]
category: "logo"
description: "Company logo for the website"
isPublic: false
```

### Create Revision Request
```javascript
POST /api/revisions/request
{
  "projectId": "project_id_here",
  "milestoneId": "milestone_id_here",
  "title": "Update homepage design",
  "description": "Please change the color scheme to match our brand colors",
  "category": "design",
  "priority": "medium",
  "dueDate": "2024-02-15T10:00:00Z"
}
```

## Error Responses
All endpoints return consistent error responses:
```javascript
{
  "success": false,
  "message": "Error description",
  "details": ["Additional error details if applicable"]
}
```

## Success Responses
All endpoints return consistent success responses:
```javascript
{
  "success": true,
  "data": { /* response data */ },
  "pagination": { /* pagination info if applicable */ }
}
```

## Rate Limiting
- General API: 100 requests per 15 minutes
- Authentication: 5 requests per 15 minutes
- File uploads: 20 requests per hour
- Support tickets: 10 requests per day

## File Upload Limits
- Maximum file size: 10MB
- Allowed types: JPG, PNG, GIF, PDF, ZIP
- Maximum files per project: 50

## Webhook Events
The service can send webhooks for the following events:
- `project.created`
- `project.updated`
- `milestone.completed`
- `revision.requested`
- `file.uploaded`
- `payment.completed`

## SDK Examples

### JavaScript/Node.js
```javascript
const WebNestClient = require('@webnest/client-sdk');

const client = new WebNestClient({
  baseURL: 'http://localhost:5001/api',
  token: 'your_jwt_token'
});

// Create a project
const project = await client.projects.create({
  title: 'My Website',
  description: 'A beautiful website',
  projectType: 'website',
  budget: 15000
});

// Upload a file
const file = await client.files.upload(projectId, {
  file: fileBuffer,
  category: 'logo',
  description: 'Company logo'
});
```

## Support
For API support and questions, contact:
- Email: api-support@webnest.com
- Documentation: https://docs.webnest.com
- Status Page: https://status.webnest.com