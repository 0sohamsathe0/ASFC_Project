# All Star Fencing Club (ASFC) - Project Context & Architecture

## Overview
This document provides essential context for developing the attendance management system feature for the All Star Fencing Club MERN stack application. The system manages fencing club activities including player registration, admin approvals, tournament management, and now attendance tracking.

## Technology Stack
- **Frontend**: React 18+, Vite, React Router DOM, Lucide Icons, TailwindCSS
- **Backend**: Node.js, Express.js, MongoDB/Mongoose
- **Authentication**: JWT (JSON Web Tokens) with HTTP-only cookies
- **State Management**: React Context API (AuthContext)
- **File Upload**: Cloudinary (via Multer middleware)
- **Email Service**: Nodemailer/Resend (for notifications)

## Directory Structure
```
ASFC MERN PROJECT/
├── Backend/                  # Express.js server
│   ├── controllers/          # Request handlers
│   ├── middlewares/          # Custom middleware (auth, roles, upload)
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API route definitions
│   ├── utils/                # Utility services (Cloudinary, email)
│   ├── index.js              # Server entry point
│   └── .env                  # Environment variables (SECRET - NEREAD)
├── Frontend/                 # React client application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # React Context providers
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── api.js            # Axios instance for backend communication
│   │   ├── App.jsx           # Main app with routing
│   │   └── main.jsx          # Entry point
│   ├── public/               # Static assets
│   ├── .env.development      # Vite environment variables (frontend only)
│   ├── index.html            # HTML template
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Core Architecture Patterns

### 1. Authentication & Authorization
- **Token Storage**: JWT stored in HTTP-only cookies
- **Player Auth**: 
  - Login via Aadhar Card + Date of Birth
  - Token payload: `{ id: player._id, role: "player" }`
  - Endpoints: `/player/login`, `/player/logout`, `/player/profile`
- **Admin Auth**:
  - Login via environment variables (ADMIN_USERNAME/ADMIN_PASSWORD)
  - Token payload: `{ id: "admin", role: "admin" }`
  - Endpoints: `/admin/login`, `/admin/verify`
- **Middleware**:
  - `verifyJWT`: Validates token and attaches `req.user`
  - `authorizeRoles(...roles)`: Checks `req.user.role` against allowed roles
- **Frontend Protection**:
  - `PlayerRoute`: Redirects to `/player/login` if !user or user.role !== "player"
  - `AdminRoute`: Redirects to `/admin/login` if !user or user.role !== "admin"
  - AuthContext: Automatically validates session on app load via `/admin/verify` and `/player/profile`

### 2. Player Model (Backend/models/player-model.js)
Key fields relevant to attendance:
- `_id`: ObjectId (primary key)
- `fullName`: String
- `gender`: String ["Male", "Female", "Other"]
- `dob`: Date
- `aadharCard`: String (unique, 12 chars)
- `event`: String ["Epee", "Foil", "Sabre"]
- `email`: String
- `phone`: String
- `address`: Object (addressLine1, addressLine2, pincode)
- `institute`: String
- `photoURL`: String (Cloudinary URL)
- `aadharCardURL`: String (Cloudinary URL)
- `faiId`: String (default: "")
- `mfaId`: String (default: "")
- `requestStatus`: String ["Pending", "Accepted", "Rejected"] (default: "Pending")
- `rejectionReason`: String (default: "")
- `isEditable`: Boolean (default: false)
- `timestamps`: true (createdAt, updatedAt)

### 3. API Communication Pattern
- **Axios Instance**: `src/components/api.js` with:
  - `baseURL`: Vite environment variables (dev: `http://localhost:5050`, prod: env var)
  - `withCredentials: true` (for cookie-based auth)
  - Error handling for server down detection
- **Endpoint Conventions**:
  - Player routes: prefixed with `/player`
  - Admin routes: prefixed with `/admin`
  - Result routes: prefixed with `/result`
  - Tournament routes: prefixed with `/tournament`
- **Response Format**:
  ```javascript
  {
    success: boolean,
    message: string,
    data?: any,          // Main payload
    user?: object,       // Auth responses
    count?: number,      // List responses
    emailSent?: boolean  // Email operations
  }
  ```

### 4. Frontend State Management
- **AuthContext** (`src/context/AuthContext.jsx`):
  - State: `user` (null or {role, ...playerData}), `loading` (boolean)
  - Actions: `login(userData)`, `logout()`
  - Session restoration: Checks admin verify → player profile on load
- **Route Protection**:
  - Wrapper components (`PlayerRoute`, `AdminRoute`) check AuthContext
  - Redirect to appropriate login pages on failed validation
- **Loading States**: Custom `LoadingScreen` component used globally

### 5. UI/Design System
- **Styling**: TailwindCSS with custom color scheme
- **Icons**: Lucide React (imported per component)
- **Layout Patterns**:
  - Cards: `overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm`
  - Headers: Gradient backgrounds with decorative blurred shapes
  - Buttons: Consistent padding, hover/focus states, icon + text
  - Modals: Fixed inset-0 with backdrop blur and scroll containment
- **Responsive Design**: Mobile-first with sm:, md:, lg: breakpoints
- **Component Organization**:
  - Feature-specific: `src/components/Player/`, `src/components/Admin/`, etc.
  - Shared: `src/components/Certificate/shared/`, `src/components/common/`

### 6. Existing Player Dashboard Features
The current player profile (`src/pages/PlayerProfile.jsx`) includes:
- Personal information display (name, FAI ID, gender, DOB, contact info)
- Profile status (Accepted/Pending/Rejected) with color-coded badges
- Photo preview and Aadhaar card preview (modal)
- Logout functionality
- Tournament statistics (hardcoded upcoming tournaments)
- Results sections:
  - Individual results (merit certificates)
  - Team results (participation certificates)
  - Certificate viewing modal
- Edit profile link for rejected players

## Development Conventions

### 1. Code Style
- **JavaScript**: ES6+ features (arrow functions, destructuring, spread/rest)
- **React**: Function components with hooks, lazy loading for route-based code splitting
- **Naming**: 
  - Files: PascalCase for components (.jsx), camelcase for utilities (.js)
  - Variables: camelCase
  - Constants: UPPER_SNAKE_CASE
  - Props: camelCase
- **Imports**: 
  - Relative paths with `@/` alias not used - explicit relative paths
  - Named imports destructured when importing multiple items
  - Default imports first, then named imports

### 2. Error Handling
- **Backend**: Try/catch blocks with standardized error responses
- **Frontend**: 
  - Try/catch in async functions with user feedback (alert/toast)
  - Auth errors (401/403) trigger redirect to login pages
  - Loading states during async operations
- **Validation**: 
  - Backend: Controller-level validation before model operations
  - Frontend: Form validation implied through backend responses

### 3. Database Operations
- **Mongoose**: 
  - Schema validation via model definitions
  - `.lean()` used for plain JS objects in queries (performance)
  - Timestamps enabled by default
  - Update operations use `findByIdAndUpdate` with `runValidators: true`
- **Queries**:
  - Filter objects built conditionally
  - Sorting: `.sort({ createdAt: -1 })` for newest first
  - Projection: `.select()` to limit returned fields

### 4. File Uploads
- **Middleware**: `multer-middleware.js` configured for Cloudinary
- **Usage**: `upload.fields([{ name: 'fieldName', maxCount: 1 }])`
- **Processing**: 
  - Upload to Cloudinary in parallel via `Promise.allSettled`
  - Cleanup on failure: delete successfully uploaded files
  - Store only secure URLs in database

### 5. Email Service
- **Utility**: `utils/emailService.js` with `sendAcceptedMail` and `sendRejectionMail`
- **Usage**: Called after successful player status updates
- **Error Handling**: Email failures don't block main operation but are logged

### 6. Security Practices
- **Environment Variables**: 
  - Never commit `.env` files (gitignored)
  - Backend: `process.env.VARIABLE_NAME`
  - Frontend: `import.meta.env.VITE_VARIABLE_NAME` (Vite convention)
  - **Critical**: Never expose actual values in code or documentation
- **CORS**: Configured with specific origins from `process.env.FRONTEND_URL`
- **Cookies**: 
  - `httpOnly: true`
  - `secure: true` in production
  - `sameSite: "None"` in production, "Lax" in development
  - Appropriate maxAge (24 hours)
- **Input Sanitization**: 
  - Trimming whitespace (`?.trim()`)
  - Removing spaces from numeric fields (Aadhar, phone)
  - Lowercasing email addresses

## Relevant Endpoints for Attendance Feature

### Player Authentication
- `POST /player/login` - Authenticate player (Aadhar + DOB)
- `POST /player/logout` - Clear auth cookie
- `GET /player/profile` - Get authenticated player data
- `PUT /player/:pid` - Update player profile (authenticated players)

### Result System (Reference for similar patterns)
- `GET /result/player/individual/:playerId` - Get player's individual results
- `GET /result/player/team/:playerId` - Get player's team results

## Recommended Approach for Attendance Feature

### 1. Database Model Extension
Add attendance tracking to either:
- **Option A**: New `Attendance` model referencing Player
  ```javascript
  const attendanceSchema = new mongoose.Schema({
    playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['Present', 'Absent', 'Late'], required: true },
    sessionType: { type: String, enum: ['Morning', 'Evening', 'Both'], default: 'Both' },
    notes: { type: String, default: '' },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' }, // Admin who marked it
    markedAt: { type: Date, default: Date.now }
  }, { timestamps: true });
  ```
- **Option B**: Add attendance array to Player model (simpler but less scalable)
  ```javascript
  // In playerSchema
  attendance: [{
    date: { type: Date, required: true },
    status: { type: String, enum: ['Present', 'Absent', 'Late'], required: true },
    sessionType: { type: String, enum: ['Morning', 'Evening', 'Both'], default: 'Both' },
    notes: { type: String, default: '' },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    markedAt: { type: Date, default: Date.now }
  }]
  ```

### 2. API Endpoints
- **Player View**:
  - `GET /player/attendance` - Get own attendance records
  - `GET /player/attendance/:dateRange` - Get attendance for specific period
- **Admin Management**:
  - `POST /admin/attendance` - Mark attendance for multiple players
  - `PUT /admin/attendance/:id` - Update specific attendance record
  - `GET /admin/attendance` - Get all attendance records (with filtering)
  - `GET /admin/attendance/stats` - Get attendance statistics

### 3. Frontend Components
- **Player Dashboard**:
  - Attendance calendar view
  - Monthly summary statistics
  - Ability to view own attendance history
- **Admin Dashboard**:
  - Attendance marking interface (date selector, player list)
  - Bulk operations (mark all present/absent)
  - Attendance reports and analytics
  - Filter by date, event type, player status

### 4. UI Considerations
- Reuse existing TailwindCSS patterns from PlayerProfile
- Use lucide-react icons for consistency (Calendar, Check, X, etc.)
- Follow modal patterns from certificate viewer
- Implement loading states and empty states consistently
- Consider mobile-responsive views for attendance marking

## Critical Implementation Notes

### 1. Environment Variable Security
- **STRICT RULE**: Never read, expose, or include values from `.env` files
- Only reference variable names and their purpose in documentation
- Example: `process.env.MONGODB_URI` — MongoDB connection string (value NEVER to be exposed)
- Violating this rule compromises application security

### 2. Authentication Dependencies
- Attendance feature must respect existing auth patterns:
  - Players can only view/manage their own attendance
  - Admins can manage attendance for all players
  - All attendance endpoints must be protected with `verifyJWT`
  - Admin endpoints require `authorizeRoles('admin')`
  - Player endpoints require `authorizeRoles('player')` or ownership validation

### 3. Data Consistency
- Attendances should reference valid player IDs
- Consider cascading behavior: if player is deleted, what happens to attendance records?
- Index recommendations: `{ playerId: 1, date: -1 }` for efficient queries

### 4. Integration Points
- Attendances could integrate with:
  - Existing tournament system (link attendance to events)
  - Result system (attendance affecting eligibility)
  - Notification system (email alerts for excessive absences)
  - Dashboard analytics (attendance statistics in admin panel)

## Summary of Key Findings for Attendance Implementation

1. **Authentication is JWT-based with role separation** (player/admin) - attendance endpoints must follow this pattern
2. **Player data is stored in MongoDB with Mongoose** - extend schema appropriately
3. **Frontend uses React Context for auth state** - will need to consume attendance data via AuthContext or new context
4. **API communication is via Axios with cookies** - new endpoints will automatically receive auth cookies
5. **UI follows consistent Tailwind patterns** - can reuse existing component styles
6. **No existing attendance system** - clean slate for implementation
7. **Admin privileges required for bulk operations** - attendance marking should be admin-only
8. **Players should self-view their attendance** - read-only access to own records

This foundation provides all necessary information to implement the attendance management system while maintaining consistency with the existing application architecture and security practices.