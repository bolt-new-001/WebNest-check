# WebNest Developer Service API Documentation

## Overview
This document provides comprehensive information about all API endpoints available in the WebNest Developer Service. The service handles all developer-side operations including project assignments, portfolio management, availability tracking, and earnings.

## Base URL
```
http://localhost:5002/api
```

## Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### 🔐 Authentication Routes (`/auth`)
- `POST /auth/register` - Register new developer
- `POST /auth/login` - Developer login
- `POST /auth/logout` - Developer logout
- `GET /auth/me` - Get current developer
- `POST /auth/forgot-password` - Forgot password
- `PUT /auth/reset-password/:resetToken` - Reset password
- `PUT /auth/update-password` - Update password

### 📋 Project Routes (`/projects`)
- `GET /projects` - Get assigned projects
- `GET /projects/:id` - Get single project assignment
- `PUT /projects/:id/accept` - Accept project assignment
- `PUT /projects/:id/reject` - Reject project assignment
- `PUT /projects/:id/progress` - Update project progress
- `POST /projects/:id/worklog` - Add work log
- `POST /projects/:id/proof` - Upload proof of work
- `PUT /projects/:id/milestone/:milestoneId/complete` - Mark milestone complete
- `PUT /projects/:id/submit` - Submit completed project

### 👤 Profile Routes (`/profile`)
- `GET /profile` - Get developer profile
- `PUT /profile` - Update developer profile
- `PUT /profile/skills` - Update skills
- `POST /profile/portfolio` - Add portfolio item
- `PUT /profile/availability` - Update availability
- `GET /profile/stats` - Get developer stats

### 💬 Chat Routes (`/chat`)
- `GET /chat/project/:projectId` - Get project chats
- `POST /chat/project/:projectId/message` - Send message
- `PUT /chat/message/:messageId/read` - Mark as read
- `GET /chat/project/:projectId/history` - Get chat history

### 💰 Earnings Routes (`/earnings`)
- `GET /earnings` - Get earnings overview
- `GET /earnings/stats` - Get earnings statistics
- `GET /earnings/payments` - Get payment history
- `POST /earnings/payout` - Request payout

### 📅 Availability Routes (`/availability`)
- `GET /availability` - Get developer availability
- `PUT /availability` - Update availability
- `POST /availability/vacation` - Add vacation period
- `PUT /availability/workload` - Update current workload
- `GET /availability/developers` - Get available developers (admin)

### 💼 Portfolio Routes (`/portfolio`)
- `GET /portfolio` - Get developer portfolio
- `PUT /portfolio` - Update portfolio
- `POST /portfolio/projects` - Add portfolio project
- `GET /portfolio/public/:developerId` - Get public developer profile
- `GET /portfolio/search` - Search developer profiles

## Request/Response Examples

### Accept Project Assignment
```javascript
PUT /api/projects/:id/accept
{
  "estimatedHours": 40,
  "notes": "I'm excited to work on this project!"
}
```

### Update Project Progress
```javascript
PUT /api/projects/:id/progress
{
  "progress": 75,
  "notes": "Homepage design completed, working on product pages",
  "milestoneId": "milestone_id_here"
}
```

### Add Work Log
```javascript
POST /api/projects/:id/worklog
{
  "hours": 4,
  "description": "Implemented user authentication system",
  "taskType": "development",
  "date": "2024-01-15"
}
```

### Update Portfolio
```javascript
PUT /api/portfolio
{
  "bio": "Experienced full-stack developer specializing in React and Node.js",
  "skills": [
    {
      "name": "React",
      "level": "expert",
      "yearsOfExperience": 5
    }
  ],
  "projects": [
    {
      "title": "E-commerce Platform",
      "description": "Built a complete e-commerce solution",
      "techStack": ["React", "Node.js", "MongoDB"],
      "projectUrl": "https://example.com",
      "images": ["image1.jpg", "image2.jpg"]
    }
  ]
}
```

### Update Availability
```javascript
PUT /api/availability
{
  "weeklySchedule": {
    "monday": {
      "available": true,
      "startTime": "09:00",
      "endTime": "17:00"
    }
  },
  "maxProjectsPerWeek": 3,
  "isAcceptingNewProjects": true,
  "minimumProjectBudget": 10000
}
```

## Developer-Specific Features

### Project Assignment Workflow
1. Admin assigns project to developer
2. Developer receives notification
3. Developer can accept/reject assignment
4. If accepted, project moves to "in_progress"
5. Developer updates progress regularly
6. Developer submits completed work
7. Client reviews and approves

### Portfolio Management
- Showcase completed projects
- Display skills and expertise
- Client testimonials and ratings
- Public profile for client discovery
- Case studies and project details

### Availability System
- Set working hours and days
- Manage vacation periods
- Control project workload
- Set minimum project budgets
- Auto-accept/reject based on criteria

### Earnings Tracking
- Track hours worked per project
- Calculate earnings based on rates
- View payment history
- Request payouts
- Generate earning reports

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
- General API: 100 requests per 15 minutes
- Authentication: 5 requests per 15 minutes
- File uploads: 20 requests per hour

## Webhook Events
- `assignment.received`
- `project.completed`
- `payment.processed`
- `review.received`

## Support
For API support:
- Email: dev-support@webnest.com
- Documentation: https://docs.webnest.com/developers