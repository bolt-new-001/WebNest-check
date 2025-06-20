# WebNest Backend - Microservice Architecture

A comprehensive backend system for WebNest built with Node.js, Express, and MongoDB using microservice architecture.

## 🏗️ Architecture Overview

The backend is organized into 3 independent microservices:

- **server-client** (Port 5001) - Handles all client-side operations
- **server-dev** (Port 5002) - Manages developer-related functionality  
- **server-admin** (Port 5003) - Provides admin control and management

## 📁 Project Structure

```
webnest-backend/
├── server-client/          # Client service
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── index.js
├── server-dev/             # Developer service
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── index.js
├── server-admin/           # Admin service
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── index.js
└── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB
- npm or yarn

### Installation

1. **Install all dependencies:**
```bash
npm run install:all
```

2. **Set up environment variables:**
Copy `.env.example` to `.env` in each service folder and configure:
- MongoDB URI
- JWT secrets
- Email credentials
- Service URLs

3. **Start all services:**
```bash
# Development mode (all services)
npm run dev:all

# Or start individually
npm run dev:client    # Client service only
npm run dev:dev       # Developer service only  
npm run dev:admin     # Admin service only
```

## 🔐 Authentication & Authorization

### JWT-based Authentication
- Each service has independent JWT validation
- Role-based access control (RBAC)
- Secure password hashing with bcrypt

### User Roles
- **Client Service:** `client`, `premiumClient`
- **Developer Service:** `developer`, `leadDeveloper`  
- **Admin Service:** `admin`, `owner`

## 📊 Database Schema

### Shared MongoDB Database: `webnest`

**Collections:**
- `users` - Client user accounts
- `developers` - Developer profiles
- `admins` - Admin accounts
- `projects` - Project information
- `projectassignments` - Developer-project assignments
- `themes` - Website templates
- `chats` - Project communication
- `notifications` - System notifications

## 🛠️ API Endpoints

### Client Service (Port 5001)
```
POST   /api/auth/register        # User registration
POST   /api/auth/login           # User login
GET    /api/profile              # Get user profile
GET    /api/projects             # Get user projects
POST   /api/projects             # Create new project
GET    /api/themes               # Browse themes
POST   /api/chat/project/:id/message  # Send message
```

### Developer Service (Port 5002)
```
POST   /api/auth/login           # Developer login
GET    /api/projects             # Get assigned projects
PUT    /api/projects/:id/accept  # Accept project
POST   /api/projects/:id/worklog # Log work hours
PUT    /api/projects/:id/submit  # Submit completed work
GET    /api/earnings             # View earnings
```

### Admin Service (Port 5003)
```
POST   /api/auth/login           # Admin login
GET    /api/projects             # View all projects
PUT    /api/projects/:id/assign  # Assign project to developer
GET    /api/users                # Manage users
GET    /api/developers           # Manage developers
POST   /api/themes               # Create themes
GET    /api/analytics/dashboard  # Dashboard statistics
```

## 🔧 Features Implemented

### Client Service
- ✅ User authentication (JWT + OAuth ready)
- ✅ Project management (CRUD operations)
- ✅ Theme browsing and selection
- ✅ Real-time chat system
- ✅ Notification system
- ✅ Premium subscription handling
- ✅ Profile management

### Developer Service  
- ✅ Developer authentication
- ✅ Project assignment management
- ✅ Work logging and time tracking
- ✅ Progress reporting
- ✅ Earnings calculation
- ✅ Portfolio management
- ✅ Skill and availability tracking

### Admin Service
- ✅ Admin authentication with permissions
- ✅ Project oversight and assignment
- ✅ User and developer management
- ✅ Theme management system
- ✅ Analytics and reporting
- ✅ Notification broadcasting
- ✅ Role-based access control

## 🛡️ Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **JWT** - Secure token authentication  
- **bcrypt** - Password hashing
- **Input validation** - Joi schema validation
- **Error handling** - Centralized error management
- **Request logging** - Comprehensive audit trails

## 📈 Scalability Features

- **Microservice architecture** - Independent scaling
- **Database connection pooling** - Optimized MongoDB connections
- **Async/await patterns** - Non-blocking operations
- **Modular code structure** - Easy maintenance and updates
- **Environment-based configuration** - Flexible deployment

## 🔄 Development Workflow

1. **Code Organization:** Each service follows MVC pattern
2. **Error Handling:** Centralized error middleware
3. **Logging:** Request/response logging for debugging
4. **Validation:** Input validation using Joi schemas
5. **Testing Ready:** Structure supports unit/integration tests

## 🚀 Deployment Ready

- **Docker support** - Containerization ready
- **Environment configs** - Production/staging/development
- **Health checks** - Service monitoring endpoints
- **Process management** - PM2 compatible
- **Load balancing** - Multiple instance support

## 📝 Next Steps

1. **Add comprehensive testing** (Jest/Mocha)
2. **Implement file upload** (Multer/AWS S3)
3. **Add real-time features** (Socket.io)
4. **Set up CI/CD pipeline** 
5. **Add API documentation** (Swagger)
6. **Implement caching** (Redis)
7. **Add monitoring** (Prometheus/Grafana)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.