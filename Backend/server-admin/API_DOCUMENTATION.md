# WebNest Admin Service API Documentation

## Overview
This document provides comprehensive information about all API endpoints available in the WebNest Admin Service. The service handles all administrative operations including user management, project oversight, analytics, and system configuration.

## Base URL
```
http://localhost:5003/api
```

## Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### 🔐 Authentication Routes (`/auth`)
- `POST /auth/login` - Admin login
- `POST /auth/logout` - Admin logout
- `GET /auth/me` - Get current admin
- `PUT /auth/update-password` - Update password
- `POST /auth/create-admin` - Create new admin (Owner only)

### 📋 Project Routes (`/projects`)
- `GET /projects` - Get all projects
- `GET /projects/:id` - Get single project
- `PUT /projects/:id/assign` - Assign project to developer
- `PUT /projects/:id/status` - Update project status
- `GET /projects/stats` - Get project statistics
- `PUT /projects/:id/reassign` - Reassign project

### 👥 User Routes (`/users`)
- `GET /users` - Get all users
- `GET /users/:id` - Get single user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `GET /users/stats` - Get user statistics
- `PUT /users/:id/promote` -Promote user to premium

### 👨‍💻 Developer Routes (`/developers`)
- `GET /developers` - Get all developers
- `GET /developers/:id` - Get single developer
- `PUT /developers/:id/verify` - Verify developer
- `PUT /developers/:id` - Update developer
- `DELETE /developers/:id` - Delete developer
- `GET /developers/stats` - Get developer statistics
- `PUT /developers/:id/promote` - Promote developer

### 🎨 Theme Routes (`/themes`)
- `GET /themes` - Get all themes
- `POST /themes` - Create new theme
- `PUT /themes/:id` - Update theme
- `DELETE /themes/:id` - Delete theme
- `GET /themes/stats` - Get theme statistics

### 📊 Analytics Routes (`/analytics`)
- `GET /analytics/dashboard` - Get dashboard statistics
- `GET /analytics/revenue` - Get revenue statistics
- `GET /analytics/user-growth` - Get user growth analytics
- `GET /analytics/projects` - Get project analytics
- `GET /analytics/performance` - Get performance metrics

### 🔔 Notification Routes (`/notifications`)
- `POST /notifications/send` - Send notification to user
- `POST /notifications/bulk` - Send bulk notifications
- `GET /notifications/history` - Get notification history
- `DELETE /notifications/:id` - Delete notification

### 🎫 Support Routes (`/support`)
- `GET /support/tickets` - Get all support tickets
- `PUT /support/tickets/:id/assign` - Assign ticket to admin
- `POST /support/tickets/:id/respond` - Respond to ticket
- `PUT /support/tickets/:id/resolve` - Resolve ticket
- `GET /support/stats` - Get support statistics

### 📦 Package Routes (`/packages`)
- `GET /packages` - Get all packages
- `GET /packages/:id` - Get single package
- `POST /packages` - Create package
- `PUT /packages/:id` - Update package
- `DELETE /packages/:id` - Delete package
- `GET /packages/analytics` - Get package analytics

### 🎥 Video Routes (`/videos`)
- `GET /videos` - Get all videos
- `GET /videos/:id` - Get single video
- `POST /videos` - Create video
- `PUT /videos/:id` - Update video
- `DELETE /videos/:id` - Delete video

### ⚖️ Legal Routes (`/legal`)
- `GET /legal/documents` - Get all legal documents
- `POST /legal/documents` - Create legal document
- `POST /legal/accept/:documentId` - Accept legal document
- `GET /legal/acceptances` - Get document acceptances

## Request/Response Examples

### Assign Project to Developer
```javascript
PUT /api/projects/:id/assign
{
  "developerId": "developer_id_here",
  "estimatedHours": 40,
  "hourlyRate": 500,
  "deadline": "2024-02-15T10:00:00Z",
  "notes": "High priority project, client needs it ASAP"
}
```

### Send Bulk Notification
```javascript
POST /api/notifications/bulk
{
  "title": "System Maintenance Notice",
  "message": "Scheduled maintenance on Sunday 2-4 AM",
  "type": "system_update",
  "priority": "medium",
  "targetAudience": {
    "type": "all_users"
  }
}
```

### Create Package
```javascript
POST /api/packages
{
  "name": "Premium Website Package",
  "description": "Complete website solution with advanced features",
  "category": "website",
  "pricing": {
    "basePrice": 25000,
    "currency": "INR",
    "billingType": "one-time"
  },
  "features": [
    {
      "name": "Custom Design",
      "description": "Unique design tailored to your brand",
      "included": true
    }
  ],
  "timeline": {
    "estimatedDays": 21
  }
}
```

### Get Dashboard Analytics
```javascript
GET /api/analytics/dashboard?timeframe=30d

Response:
{
  "success": true,
  "data": {
    "overview": {
      "totalUsers": 1250,
      "totalDevelopers": 45,
      "totalProjects": 320,
      "activeProjects": 85,
      "totalRevenue": 2500000
    },
    "growth": {
      "users": 125,
      "developers": 8,
      "projects": 45
    }
  }
}
```

### Verify Developer
```javascript
PUT /api/developers/:id/verify
{
  "isVerified": true,
  "verificationNotes": "Portfolio reviewed, skills verified, background check completed"
}
```

## Admin-Specific Features

### User Management
- View all registered users
- Update user information
- Promote users to premium
- Suspend/activate accounts
- View user activity logs

### Developer Management
- Review developer applications
- Verify developer credentials
- Assign projects to developers
- Monitor developer performance
- Manage developer ratings

### Project Oversight
- View all projects across platform
- Assign/reassign developers
- Monitor project progress
- Resolve project disputes
- Generate project reports

### Analytics & Reporting
- Platform usage statistics
- Revenue and financial reports
- User growth analytics
- Developer performance metrics
- Project completion rates

### System Configuration
- Manage platform settings
- Configure notification templates
- Set up payment gateways
- Manage legal documents
- Control feature flags

## Permission System

### Admin Roles
- `admin` - Standard admin with limited permissions
- `owner` - Full system access and admin management

### Permission Modules
- `users` - User management permissions
- `developers` - Developer management permissions
- `projects` - Project oversight permissions
- `themes` - Theme management permissions
- `analytics` - Analytics access permissions
- `notifications` - Notification management permissions
- `settings` - System settings permissions

### Permission Actions
- `create` - Create new resources
- `read` - View resources
- `update` - Modify existing resources
- `delete` - Remove resources

## Error Responses
```javascript
{
  "success": false,
  "message": "Error description",
  "details": ["Additional error details"]
}
```

## Success Responses
```javascript
{
  "success": true,
  "data": { /* response data */ },
  "pagination": { /* if applicable */ }
}
```

## Rate Limiting
- General API: 200 requests per 15 minutes
- Authentication: 10 requests per 15 minutes
- Bulk operations: 50 requests per hour

## Audit Logging
All admin actions are logged with:
- Admin ID and role
- Action performed
- Timestamp
- IP address
- Affected resources

## Security Features
- Role-based access control
- Permission matrix validation
- Activity logging
- Session management
- IP whitelisting (optional)

## Support
For admin API support:
- Email: admin-support@webnest.com
- Documentation: https://docs.webnest.com/admin
- Emergency: +91-XXXX-XXXX-XX