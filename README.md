# Issue Management System - Angular Frontend

Complete Angular v20+ frontend for the Issue Management System backend.

## Features

### Authentication
- Login with Basic Authentication
- User registration
- Role-based access control (USER and ADMIN)
- HTTP interceptor for automatic authorization header injection
- Secure credential storage

### User Features
- Create and manage posts
- Submit posts for approval
- Add comments to own posts and approved posts
- View approved posts
- Track post status (DRAFT → PENDING_APPROVAL → APPROVED/REJECTED → CLOSED)

### Admin Features
- View all posts across all users
- Approve or reject pending posts
- Close posts
- Add update notes when changing post status
- Comment on any post
- Filter posts by status

### Post Types
- ISSUE
- COMPLAINT
- ANNOUNCEMENT
- LOST
- HELP

## Project Structure

```
src/
├── app/
│   ├── models/                    # TypeScript interfaces and enums
│   │   ├── user.model.ts          # User, roles, auth DTOs
│   │   ├── post.model.ts          # Post, status, type enums
│   │   └── comment.model.ts       # Comment interface
│   ├── services/                  # API services
│   │   ├── auth.service.ts        # Authentication with signals
│   │   ├── post.service.ts        # Post management
│   │   └── comment.service.ts     # Comment operations
│   ├── guards/                    # Route guards
│   │   └── auth.guard.ts          # Auth and admin guards
│   ├── interceptors/              # HTTP interceptors
│   │   └── auth.interceptor.ts    # Basic auth header injection
│   ├── auth/                      # Authentication components
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/                 # Main dashboard
│   ├── posts/                     # Post management components
│   │   ├── create-post/
│   │   ├── my-posts/
│   │   ├── approved-posts/
│   │   └── post-detail/
│   ├── admin/                     # Admin-only components
│   │   ├── all-posts/
│   │   └── pending-posts/
│   ├── not-found/                 # 404 page
│   ├── app.component.ts           # Root component
│   └── app.routes.ts              # Routing configuration
├── environments/
│   ├── environment.ts             # Development config
│   └── environment.prod.ts        # Production config
└── global_styles.css              # Global styles with WCAG AA compliance

```

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Backend API running (see backend repository)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure the backend API URL in `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'  // Update to your backend URL
};
```

## Running the Application

### Development Server
```bash
npm start
```
The application will open automatically at `http://localhost:4200`

### Build for Production
```bash
npm run build
```
Build artifacts will be stored in the `dist/` directory.

## Backend Integration

This frontend integrates with the Spring Boot backend from:
https://github.com/Chiranbaskota/IssueMangaement

### Backend Endpoints Used

**Authentication:**
- `POST /auth/register` - User registration
- `POST /auth/login` - User authentication

**Posts:**
- `POST /api/posts` - Create post
- `PUT /api/posts/{id}/submit` - Submit for approval
- `PUT /api/posts/{id}/approve` - Approve post (ADMIN)
- `PUT /api/posts/{id}/reject` - Reject post (ADMIN)
- `PUT /api/posts/{id}/close` - Close post (ADMIN)
- `GET /api/posts` - Get all posts
- `GET /api/posts/approved` - Get approved posts
- `GET /api/user/posts` - Get current user's posts
- `GET /api/posts/{id}` - Get post by ID

**Comments:**
- `POST /api/posts/{postId}/comments` - Add comment
- `GET /api/posts/{postId}/comments` - Get post comments

## Authentication

The application uses HTTP Basic Authentication:
- Credentials are encoded as Base64 `username:password`
- Authorization header is automatically added to all requests via HTTP interceptor
- Credentials are stored in localStorage for persistence

## Routing

### Public Routes
- `/auth/login` - Login page
- `/auth/register` - Registration page

### Protected Routes (Authenticated Users)
- `/dashboard` - Main dashboard
- `/posts/create` - Create new post
- `/posts/my-posts` - User's posts
- `/posts/approved` - View approved posts
- `/posts/:id` - Post details and comments

### Admin Routes (ADMIN Role Only)
- `/admin/posts` - View all posts
- `/admin/pending` - Pending approval queue

### Fallback
- `**` - 404 Not Found page

## Key Features

### Signals-Based State Management
Uses Angular 20's signal primitives for reactive state:
- `currentUser` signal for authentication state
- Computed signals for role-based access
- Reactive updates without manual change detection

### Lazy Loading
All routes are lazy-loaded for optimal performance and code splitting.

### Accessibility (WCAG AA)
- Proper ARIA labels and roles
- Semantic HTML structure
- Keyboard navigation support
- Focus management
- Color contrast ratios meet AA standards
- Screen reader friendly
- Reduced motion support

### Form Validation
- Reactive forms with built-in validators
- Real-time validation feedback
- Accessible error messages
- Proper input labeling

### Error Handling
- User-friendly error messages
- Network error handling
- Authentication failure handling
- Form validation errors

## User Workflows

### Regular User Workflow
1. Register or login
2. Create a post (saved as DRAFT)
3. Submit post for approval (status → PENDING_APPROVAL)
4. Wait for admin approval
5. If approved, add comments and view post
6. If rejected, view rejection note

### Admin Workflow
1. Login as admin
2. View pending posts in approval queue
3. Review post details
4. Approve or reject with optional update note
5. Close posts when resolved
6. Manage all posts in the system

## Styling

- Modern, clean design with gradient accents
- Responsive layout (mobile-first approach)
- Card-based UI components
- Smooth transitions and hover effects
- Status badges with color coding
- Professional color palette (no purple by default)

## Security

- HTTP-only credentials storage
- Basic Authentication with secure headers
- Route guards for protected pages
- Role-based access control
- XSS protection through Angular's sanitization
- CSRF protection (backend responsibility)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Code Organization
- Components are modular and reusable
- Services are singleton and injectable
- Models are strongly typed with TypeScript
- Guards protect routes based on authentication and roles

### Angular 20+ Features Used
- Standalone components (no NgModule)
- Signal-based state management
- Functional route guards
- Control flow syntax (@if, @for)
- HttpInterceptorFn (functional interceptors)
- Lazy-loaded routes

## Troubleshooting

### Cannot connect to backend
- Verify backend is running on the configured URL
- Check CORS settings on backend
- Verify API endpoints match backend implementation

### Authentication fails
- Ensure credentials are correct
- Check network tab for 401 errors
- Verify Basic Auth header is being sent

### Build errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Angular cache: `ng cache clean`
- Verify TypeScript version compatibility

## License

This project is part of the Issue Management System.
