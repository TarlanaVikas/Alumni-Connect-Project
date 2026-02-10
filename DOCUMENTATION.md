# Alumni Connect - Complete Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Core Components](#core-components)
6. [Pages Documentation](#pages-documentation)
7. [Context Providers](#context-providers)
8. [Backend API](#backend-api)
9. [Database Schema](#database-schema)
10. [Routing System](#routing-system)
11. [Styling System](#styling-system)
12. [Authentication Flow](#authentication-flow)
13. [Setup & Installation](#setup--installation)
14. [Development Guide](#development-guide)

---

## Project Overview

**Alumni Connect** is a comprehensive web application designed to connect university alumni, students, and administrators. It provides a platform for networking, event management, fundraising, messaging, and administrative control.

### Key Features
- **Role-Based Access Control**: Three user roles (Admin, Student, Alumni) with different permissions
- **Direct Login System**: Simplified authentication with role-based login buttons
- **Real-time Messaging**: Chat system for communication between users
- **Event Management**: Create, view, and register for events
- **Donation System**: Fundraising campaigns with tracking
- **Profile Management**: Comprehensive user profiles with skills and social links
- **Search & Discovery**: Advanced search across people, events, and content
- **Admin Dashboard**: Complete administrative control panel
- **AI Bot Assistant**: Interactive help and navigation assistant

---

## Architecture

### Frontend Architecture
- **Framework**: React 18 with Vite
- **State Management**: React Context API
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS with custom components
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database**: SQLite3 with lightweight migrations
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Real-time Updates**: Server-Sent Events (SSE)

### Data Flow
```
User Action → React Component → Context/Action → API Call → Express Server → SQLite Database
                                                                    ↓
User Interface ← React Component ← Context Update ← API Response ← JSON Response
```

---

## Technology Stack

### Frontend Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.2.0 | UI framework |
| react-dom | ^18.2.0 | React DOM rendering |
| react-router-dom | ^6.8.1 | Client-side routing |
| lucide-react | ^0.263.1 | Icon library |
| react-hot-toast | ^2.6.0 | Toast notifications |
| tailwindcss | ^3.2.7 | Utility-first CSS framework |
| vite | ^7.1.5 | Build tool and dev server |

### Backend Dependencies
| Package | Purpose |
|---------|---------|
| express | Web server framework |
| sqlite3 | SQLite database driver |
| jsonwebtoken | JWT token generation/verification |
| bcryptjs | Password hashing |
| cors | Cross-origin resource sharing |
| morgan | HTTP request logger |

---

## Project Structure

```
alumni-connect/
├── src/
│   ├── components/          # Reusable UI components
│   │   └── Layout.jsx       # Main layout wrapper with sidebar
│   ├── contexts/            # React Context providers
│   │   └── AuthContext.jsx # Authentication state management
│   ├── pages/              # Page components
│   │   ├── Login.jsx       # Authentication page
│   │   ├── Register.jsx    # User registration
│   │   ├── Dashboard.jsx   # Main alumni/alumni dashboard
│   │   ├── StudentDashboard.jsx # Student-specific dashboard
│   │   ├── AdminDashboard.jsx  # Admin control panel
│   │   ├── Profile.jsx     # User profile management
│   │   ├── Messaging.jsx   # Chat/messaging system
│   │   ├── MailInfo.jsx    # Mail & information center
│   │   ├── PeopleYouMayKnow.jsx # Networking suggestions
│   │   ├── Events.jsx      # Event management
│   │   ├── Search.jsx      # Search and filter
│   │   ├── Donations.jsx   # Fundraising campaigns
│   │   └── AIBot.jsx       # AI assistant
│   ├── App.jsx             # Main application component
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles and Tailwind imports
├── server/
│   ├── index.js           # Express server and API routes
│   ├── data.sqlite       # SQLite database file
│   └── package.json      # Server dependencies
├── package.json          # Frontend dependencies
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── README.md             # Project overview

```

---

## Core Components

### 1. Layout Component (`src/components/Layout.jsx`)

**Purpose**: Main layout wrapper that provides consistent navigation and structure across all authenticated pages.

**Key Features**:
- Responsive sidebar navigation (desktop and mobile)
- Top navigation bar with search and user info
- Role-based navigation items
- User profile display in sidebar footer
- Logout functionality

**Props**:
- `children`: React nodes to render as page content

**State Management**:
- `sidebarOpen`: Controls mobile sidebar visibility

**Navigation Structure**:
```javascript
// Standard navigation for all users
const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Messaging', href: '/messaging', icon: MessageSquare },
  { name: 'Mail & Info', href: '/mail', icon: Mail },
  { name: 'People You May Know', href: '/people', icon: Users },
  { name: 'Events', href: '/events', icon: Calendar },
  { name: 'Search & Filter', href: '/search', icon: Search },
  { name: 'Donations', href: '/donations', icon: Heart },
  { name: 'AI Bot', href: '/ai-bot', icon: Bot },
]

// Admin gets additional navigation item
const adminNavigation = [
  ...navigation,
  { name: 'Admin Dashboard', href: '/admin', icon: Settings }
]
```

**Sub-components**:
- `SidebarContent`: Renders the sidebar navigation and user info

**Responsive Behavior**:
- Desktop: Fixed sidebar on the left (256px width)
- Mobile: Collapsible sidebar overlay with backdrop

---

## Pages Documentation

### 1. Login Page (`src/pages/Login.jsx`)

**Purpose**: Authentication entry point with direct role-based login.

**Features**:
- Three direct login buttons (Admin, Student, Alumni)
- No email/password required (simplified authentication)
- Role-based redirection after login
- Loading states during authentication

**State**:
- `loading`: Boolean for button loading state

**Functions**:
- `handleDirectLogin(role)`: 
  - Calls `directLogin` from AuthContext
  - Redirects to `/admin` for admin role
  - Redirects to `/` for student and alumni roles

**UI Elements**:
- Gradient background (blue-50 to indigo-100)
- Centered card layout
- Three colored buttons:
  - Admin: Red (bg-red-600)
  - Student: Green (bg-green-600)
  - Alumni: Purple (bg-purple-600)
- Icons from lucide-react (Shield, User, Users)

---

### 2. Dashboard Page (`src/pages/Dashboard.jsx`)

**Purpose**: Main dashboard for alumni and alumni users showing overview, stats, and quick access.

**Key Sections**:

#### Welcome Header
- Personalized greeting based on time of day
- User's first name display
- Last active timestamp
- Notification bell icon

#### Statistics Cards (4 cards)
1. **Connections**: Total connections count with monthly growth
2. **Upcoming Events**: Number of registered events
3. **Messages**: Unread message count
4. **Donations**: Total donation contributions

#### Recent Activity Feed
- List of recent activities (connections, events, messages, donations)
- Time-based display (e.g., "2 hours ago")
- Icons for each activity type

#### Upcoming Events
- Event cards with:
  - Title, date, location
  - Attendee count and capacity
  - Category badge
  - Registration status
- "View All Events" link

#### Suggested Connections
- User cards with:
  - Profile picture
  - Name and job title
  - Department and graduation year
  - Location
  - Mutual connections count
- "Connect" button for each suggestion

**State Management**:
- `stats`: Object with connection, event, message, and donation counts
- `recentActivity`: Array of activity objects
- `upcomingEvents`: Array of event objects
- `suggestedConnections`: Array of user objects

**Helper Functions**:
- `getGreeting()`: Returns time-appropriate greeting
- `formatDate(dateString)`: Formats date for display

---

### 3. Student Dashboard (`src/pages/StudentDashboard.jsx`)

**Purpose**: Student-specific dashboard with features tailored for current students.

**Note**: This component likely has similar structure to Dashboard but with student-specific content and features. The routing system automatically shows this for students instead of the regular Dashboard.

---

### 4. Admin Dashboard (`src/pages/AdminDashboard.jsx`)

**Purpose**: Comprehensive administrative control panel for managing the platform.

**Key Features**:

#### Statistics Overview
- Total users count
- Active events count
- Total donations amount
- Recent registrations

#### User Management
- User list with filtering and search
- Role management (Admin, Student, Alumni)
- Bulk operations (delete, role change)
- User details view
- Add/Edit user functionality

#### Charts Section
- **User Growth Chart**: Bar chart showing user growth over time
  - Uses QuickChart.io API for dynamic chart generation
  - Displays monthly user registration data
- **Donation Trends Chart**: Pie chart showing donation distribution
  - Categories: Education, Emergency, Research, Other
  - Color-coded segments

#### Recent Activity
- System-wide activity feed
- User actions log
- Event creation/updates
- Donation transactions

#### Event Management
- View all events
- Create/edit events
- Manage registrations
- Event analytics

#### Donation Tracking
- Campaign overview
- Donation history
- Donor management
- Financial reports

**State Management**:
- User list and filters
- Selected user for editing
- Chart data
- Metrics from API

---

### 5. Profile Page (`src/pages/Profile.jsx`)

**Purpose**: User profile management with comprehensive editing capabilities.

**Key Sections**:

#### Profile Header
- Large profile picture (24x24, rounded)
- User name and role
- Experience/job title
- Location with MapPin icon
- University and graduation year with GraduationCap icon
- Department with Briefcase icon
- Edit/Save buttons

#### Bio Section
- Textarea for biography
- Editable in edit mode

#### Location & Experience
- Location input field
- Experience/job title input

#### Skills Section
- Dynamic skill tags
- Add new skills with input field
- Remove skills with X button
- Skills displayed as colored badges

#### Social Links Section
- Platform dropdown (LinkedIn, Twitter, GitHub, etc.)
- URL input field
- Add/remove social links
- Links displayed as clickable icons

**State Management**:
- `isEditing`: Boolean for edit mode
- `formData`: Object containing all profile fields
- `newSkill`: String for new skill input
- `newSocialLink`: Object with platform and url

**Functions**:
- `handleChange(e)`: Updates formData on input change
- `handleSave()`: Saves profile via `updateUser` from AuthContext
- `handleCancel()`: Resets formData to original user data
- `addSkill()`: Adds new skill to skills array
- `removeSkill(skillToRemove)`: Removes skill from array
- `addSocialLink()`: Adds new social link
- `removeSocialLink(platform)`: Removes social link

**Profile Picture**:
- Displays `user.avatar` from AuthContext
- Camera icon button in edit mode (placeholder for future upload)

---

### 6. Messaging Page (`src/pages/Messaging.jsx`)

**Purpose**: Real-time messaging/chat system for user communication.

**Key Features**:
- Chat list sidebar
- Active conversation view
- Message input and send
- Online status indicators
- Message timestamps
- Unread message indicators

**State Management**:
- `chats`: Array of conversation objects
- `selectedChat`: Currently active conversation
- `messages`: Array of messages for selected chat
- `newMessage`: String for message input

**Functions**:
- `handleSendMessage()`: Sends message via API
- `selectChat(chatId)`: Loads messages for selected chat
- `markAsRead(chatId)`: Marks messages as read

**UI Layout**:
- Two-column layout (chat list + message view)
- Responsive: stacks on mobile
- Message bubbles with sender identification
- Timestamp formatting

---

### 7. Mail & Info Page (`src/pages/MailInfo.jsx`)

**Purpose**: Centralized communication hub for announcements, newsletters, and information.

**Key Features**:
- Mail inbox with categories
- Star/unstar functionality
- Archive functionality
- Read/unread status
- Attachment indicators
- Category filtering (newsletter, event, announcement)

**State Management**:
- `mails`: Array of mail objects
- `selectedMail`: Currently viewed mail
- `filters`: Object with category and status filters

**Mail Object Structure**:
```javascript
{
  id: string,
  from_name: string,
  subject: string,
  preview: string,
  timestamp: number,
  read: boolean,
  starred: boolean,
  archived: boolean,
  attachments: number,
  category: string
}
```

---

### 8. People You May Know (`src/pages/PeopleYouMayKnow.jsx`)

**Purpose**: Networking suggestions based on connections, department, and location.

**Key Features**:
- Suggested connections list
- Mutual connections display
- Department and graduation year matching
- Location-based suggestions
- "Connect" button for each suggestion
- Filter by department, graduation year, location

**State Management**:
- `suggestedPeople`: Array of user objects
- `filters`: Filter criteria object

**User Card Display**:
- Profile picture
- Name and job title
- Department and graduation year
- Location
- Mutual connections count
- Connect button

---

### 9. Events Page (`src/pages/Events.jsx`)

**Purpose**: Event discovery, registration, and management.

**Key Features**:
- Event listing with cards
- Event categories (Social, Educational, Professional, Networking)
- Event types (In-person, Virtual, Hybrid)
- Registration functionality
- Event details modal
- Filter by category, type, date range
- Search functionality

**Event Card Display**:
- Event image
- Title and description
- Date and time
- Location (physical or virtual)
- Attendee count and capacity
- Category badge
- Price (if applicable)
- Organizer information
- Featured event indicator

**State Management**:
- `events`: Array of event objects
- `selectedEvent`: Currently viewed event
- `filters`: Filter criteria
- `showEventModal`: Boolean for event details modal

**Functions**:
- `handleRegister(eventId)`: Registers user for event
- `handleUnregister(eventId)`: Unregisters from event
- `filterEvents()`: Applies filters to event list

---

### 10. Search Page (`src/pages/Search.jsx`)

**Purpose**: Advanced search across people, events, organizations, and content.

**Key Features**:
- Multi-tab interface (People, Events, Organizations, Content)
- Advanced filtering options
- Search query input
- Result cards with previews
- Filter reset functionality

**Search Tabs**:
1. **People**: Search alumni and students
   - Filter by: Location, Department, Graduation Year, Industry
2. **Events**: Search events
   - Filter by: Event Type, Category, Date Range, Price Range
3. **Organizations**: Search organizations/companies
   - Filter by: Industry, Location, Size
4. **Content**: Search articles and news
   - Filter by: Category, Date Range, Type

**State Management**:
- `searchQuery`: String for search input
- `activeTab`: Currently active tab
- `searchResults`: Object with results for each category
- `filters`: Object with filter values

**Functions**:
- `handleSearch(query)`: Performs search
- `handleFilterChange(filterType, value)`: Updates filters
- `clearFilters()`: Resets all filters

---

### 11. Donations Page (`src/pages/Donations.jsx`)

**Purpose**: Fundraising campaign management and donation system.

**Key Features**:
- Campaign listing
- Donation modal
- Progress tracking
- Campaign categories
- Featured campaigns
- Urgent campaigns indicator
- Donation history

**Tabs**:
1. **Campaigns**: Browse all fundraising campaigns
2. **My Donations**: User's donation history
3. **Create**: Create new campaign (admin only)

**Campaign Card Display**:
- Campaign image
- Title and description
- Progress bar (raised/goal)
- Donor count
- Days remaining
- Category badge
- Featured/Urgent indicators
- "Donate" button

**State Management**:
- `activeTab`: Current tab
- `campaigns`: Array of campaign objects
- `selectedCampaign`: Currently viewed campaign
- `donationAmount`: String for donation input
- `showDonationModal`: Boolean for modal visibility

**Campaign Object Structure**:
```javascript
{
  id: string,
  title: string,
  description: string,
  goal: number,
  raised: number,
  donors: number,
  daysLeft: number,
  category: string,
  image: string,
  organizer: string,
  featured: boolean,
  urgent: boolean
}
```

**Functions**:
- `handleDonate(campaignId, amount)`: Processes donation
- `handleCreateCampaign(data)`: Creates new campaign (admin)

---

### 12. AI Bot Page (`src/pages/AIBot.jsx`)

**Purpose**: Interactive AI assistant for platform navigation and help.

**Key Features**:
- Chat interface
- Quick action suggestions
- Context-aware responses
- Platform navigation help
- FAQ responses

**State Management**:
- `messages`: Array of chat messages
- `input`: String for user input
- `loading`: Boolean for AI response loading

**Message Structure**:
```javascript
{
  id: string,
  role: 'user' | 'assistant',
  content: string,
  timestamp: number
}
```

**Quick Actions**:
- Pre-defined action buttons for common tasks
- Direct navigation to relevant pages
- Common question shortcuts

---

### 13. Register Page (`src/pages/Register.jsx`)

**Purpose**: User registration form for new account creation.

**Key Features**:
- Registration form with validation
- Required fields: Name, Email, Password
- Optional fields: University, Department, Graduation Year, Location
- Password confirmation
- Terms acceptance checkbox
- Redirect to login after successful registration

**Form Fields**:
- Name (required)
- Email (required, validated)
- Password (required, min length)
- Confirm Password (required, must match)
- University (optional)
- Department (optional)
- Graduation Year (optional, number)
- Location (optional)

**State Management**:
- `formData`: Object with all form fields
- `errors`: Object with validation errors
- `loading`: Boolean for submission state

**Functions**:
- `handleChange(e)`: Updates formData
- `handleSubmit(e)`: Validates and submits registration
- `validateForm()`: Validates all fields

---

## Context Providers

### AuthContext (`src/contexts/AuthContext.jsx`)

**Purpose**: Centralized authentication state management for the entire application.

**State**:
- `user`: Current authenticated user object or null
- `loading`: Boolean indicating if auth state is being checked

**User Object Structure**:
```javascript
{
  id: string,
  email: string,
  name: string,
  role: 'admin' | 'student' | 'alumni',
  bio: string,
  location: string,
  experience: string,
  skills: string[],
  socialLinks: object,
  avatar: string,
  university: string,
  department: string,
  graduationYear: number
}
```

**Functions Provided**:

#### `login(email, password)`
- Authenticates user with email and password
- Makes POST request to `/api/auth/login`
- Stores JWT token in localStorage
- Stores user object in localStorage
- Updates user state
- Returns boolean (success/failure)
- Shows toast notification

#### `register(payload)`
- Registers new user
- Makes POST request to `/api/auth/register`
- Payload includes: name, email, password, university, department, graduationYear, location
- Stores token and user on success
- Returns boolean (success/failure)
- Shows toast notification

#### `directLogin(role)`
- Simplified login for demo/development
- Creates mock user object based on role
- No API call required
- Sets mock token and user in localStorage
- Three roles supported: 'admin', 'student', 'alumni'
- Each role has predefined mock data with avatar
- Returns boolean (success/failure)

#### `logout()`
- Clears user state
- Removes token and user from localStorage
- Shows success toast

#### `updateUser(updatedData)`
- Updates user profile data
- Merges updatedData with current user object
- Updates localStorage
- Updates state
- Shows success toast
- Used by Profile page for saving changes

**API Base URL**:
- Default: `http://localhost:5175`
- Can be overridden with `VITE_API_BASE` environment variable

**Initialization**:
- On mount, checks localStorage for existing token
- If token exists, validates with `/api/auth/me` endpoint
- Updates user state if token is valid
- Sets loading to false when complete

**Usage Example**:
```javascript
import { useAuth } from '../contexts/AuthContext'

function MyComponent() {
  const { user, login, logout, updateUser } = useAuth()
  
  // Access user data
  console.log(user?.name, user?.role)
  
  // Login
  await login('email@example.com', 'password')
  
  // Logout
  logout()
  
  // Update profile
  updateUser({ bio: 'New bio' })
}
```

---

## Backend API

### Server Configuration (`server/index.js`)

**Port**: 5175 (default, configurable via PORT env variable)

**Middleware**:
- `cors`: Cross-origin resource sharing (configurable via CORS_ORIGINS)
- `express.json()`: JSON body parser
- `morgan('dev')`: HTTP request logging

**Database**:
- SQLite3 database file: `./data.sqlite`
- Automatic schema creation on first run
- Lightweight migrations for schema updates

### API Endpoints

#### Health & Status
- `GET /healthz` - Health check endpoint
- `GET /` - API status and information

#### Authentication
- `POST /api/auth/register` - User registration
  - Body: `{ name, email, password, university?, department?, graduationYear?, location? }`
  - Returns: `{ token, user }`
  
- `POST /api/auth/login` - User login
  - Body: `{ email, password }`
  - Returns: `{ token, user }`
  
- `GET /api/auth/me` - Get current user (requires auth)
  - Headers: `Authorization: Bearer <token>`
  - Returns: User object

#### Messaging
- `GET /api/messages/chats` - Get user's conversations (requires auth)
- `GET /api/messages/:conversationId` - Get messages for conversation (requires auth)
- `POST /api/messages` - Send message (requires auth)
  - Body: `{ conversationId, content }`

#### Mail & Information
- `GET /api/mails` - Get user's mails (requires auth)
- `GET /api/mails/:id` - Get specific mail (requires auth)
- `PUT /api/mails/:id/read` - Mark mail as read (requires auth)
- `PUT /api/mails/:id/star` - Toggle star status (requires auth)

#### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get specific event
- `POST /api/events` - Create event (requires auth, admin)
- `PUT /api/events/:id` - Update event (requires auth, admin)
- `DELETE /api/events/:id` - Delete event (requires auth, admin)
- `POST /api/events/:id/register` - Register for event (requires auth)
- `DELETE /api/events/:id/register` - Unregister from event (requires auth)

#### Donations
- `GET /api/donations/campaigns` - Get all campaigns
- `GET /api/donations/campaigns/:id` - Get specific campaign
- `POST /api/donations/campaigns` - Create campaign (requires auth, admin)
- `POST /api/donations` - Make donation (requires auth)
  - Body: `{ campaignId, amount }`

#### Users (Admin)
- `GET /api/users` - Get all users (requires auth, admin)
- `GET /api/users/:id` - Get specific user (requires auth, admin)
- `PUT /api/users/:id` - Update user (requires auth, admin)
- `DELETE /api/users/:id` - Delete user (requires auth, admin)

#### Metrics (SSE)
- `GET /api/metrics/sse` - Server-Sent Events stream for live metrics
  - Returns: JSON metrics every few seconds
  - Metrics include: users count, events count, donations total, messages count

### Authentication Middleware

**Function**: `authMiddleware(req, res, next)`

**Process**:
1. Extracts token from `Authorization` header (format: `Bearer <token>`)
2. Verifies token using JWT_SECRET
3. Attaches user payload to `req.user`
4. Calls `next()` if valid, returns 401 if invalid

**Token Structure**:
```javascript
{
  sub: user.id,
  role: user.role,
  email: user.email,
  name: user.name
}
```

**Token Expiration**: 7 days

---

## Database Schema

### Tables

#### `users`
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  role TEXT NOT NULL DEFAULT 'alumni',
  university TEXT,
  department TEXT,
  graduation_year INTEGER,
  location TEXT,
  avatar TEXT
);
```

**Fields**:
- `id`: Unique identifier (nanoid)
- `name`: User's full name
- `email`: Unique email address (lowercase)
- `password_hash`: Bcrypt hashed password
- `role`: 'admin', 'student', or 'alumni'
- `university`: University name
- `department`: Department/major
- `graduation_year`: Year of graduation
- `location`: Geographic location
- `avatar`: URL to profile picture

#### `conversations`
```sql
CREATE TABLE conversations (
  id TEXT PRIMARY KEY
);
```

**Purpose**: Represents a chat conversation between users.

#### `participants`
```sql
CREATE TABLE participants (
  conversation_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  PRIMARY KEY (conversation_id, user_id),
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);
```

**Purpose**: Links users to conversations (many-to-many relationship).

#### `messages`
```sql
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  content TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  read INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);
```

**Fields**:
- `id`: Unique message identifier
- `conversation_id`: Reference to conversation
- `sender_id`: User ID of sender
- `content`: Message text
- `timestamp`: Unix timestamp (milliseconds)
- `read`: Boolean (0 = unread, 1 = read)

#### `mails`
```sql
CREATE TABLE mails (
  id TEXT PRIMARY KEY,
  from_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  preview TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  read INTEGER NOT NULL DEFAULT 0,
  starred INTEGER NOT NULL DEFAULT 0,
  archived INTEGER NOT NULL DEFAULT 0,
  attachments INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  to_addr TEXT
);
```

**Purpose**: Stores mail/information messages for users.

**Categories**: 'newsletter', 'event', 'announcement', etc.

#### `events`
```sql
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT,
  end_time TEXT,
  location TEXT,
  address TEXT,
  type TEXT,
  category TEXT,
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  price REAL DEFAULT 0,
  image TEXT,
  organizer TEXT,
  featured INTEGER DEFAULT 0
);
```

**Fields**:
- `type`: 'in-person', 'virtual', 'hybrid'
- `category`: 'social', 'educational', 'professional', 'networking'
- `featured`: Boolean (0 = false, 1 = true)

#### `event_registrations`
```sql
CREATE TABLE event_registrations (
  event_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  PRIMARY KEY (event_id, user_id),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Purpose**: Tracks which users are registered for which events.

#### `donation_campaigns`
```sql
CREATE TABLE donation_campaigns (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  goal REAL NOT NULL,
  raised REAL NOT NULL DEFAULT 0,
  donors INTEGER NOT NULL DEFAULT 0,
  days_left INTEGER NOT NULL DEFAULT 30,
  category TEXT,
  image TEXT,
  organizer TEXT,
  featured INTEGER DEFAULT 0,
  urgent INTEGER DEFAULT 0
);
```

**Purpose**: Stores fundraising campaign information.

#### `donations`
```sql
CREATE TABLE donations (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL,
  user_id TEXT,
  amount REAL NOT NULL,
  created_at INTEGER NOT NULL,
  receipt TEXT,
  status TEXT NOT NULL DEFAULT 'completed',
  FOREIGN KEY (campaign_id) REFERENCES donation_campaigns(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

**Purpose**: Records individual donations to campaigns.

---

## Routing System

### Route Configuration (`src/App.jsx`)

**Router**: React Router DOM v6 with BrowserRouter

**Route Protection**:
- Unauthenticated users: Can only access `/login` and `/register`
- Authenticated users: Can access all routes except login/register
- Admin users: Additional access to `/admin`

**Route Definitions**:

#### Public Routes (Unauthenticated)
```javascript
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="*" element={<Navigate to="/login" />} />
```

#### Protected Routes (Authenticated)
```javascript
<Route path="/" element={homeElement} />
  // homeElement = StudentDashboard if role === 'student', else Dashboard
<Route path="/profile" element={<Profile />} />
<Route path="/messaging" element={<Messaging />} />
<Route path="/mail" element={<MailInfo />} />
<Route path="/people" element={<PeopleYouMayKnow />} />
<Route path="/events" element={<Events />} />
<Route path="/search" element={<Search />} />
<Route path="/donations" element={<Donations />} />
<Route path="/ai-bot" element={<AIBot />} />
<Route path="/admin" element={<AdminDashboard />} />
<Route path="*" element={<Navigate to="/" />} />
```

**Conditional Home Route**:
- Students see `StudentDashboard`
- Alumni and Admins see `Dashboard`

**Loading State**:
- Shows spinner while checking authentication
- Prevents flash of incorrect content

**Navigation Flow**:
```
Login → (role check) → Dashboard/StudentDashboard
  ↓
Any authenticated route
  ↓
Logout → Login
```

---

## Styling System

### Tailwind CSS Configuration (`tailwind.config.js`)

**Custom Colors**:

#### Primary (Blue)
- 50-900 shades from lightest to darkest
- Main brand color: `primary-600` (#2563eb)

#### Secondary (Gray)
- 50-900 shades
- Used for neutral elements

**Custom Font**:
- `font-sans`: Inter, system-ui, sans-serif

**Custom Animations**:
- `fade-in`: Fade in animation (0.5s)
- `slide-up`: Slide up animation (0.3s)
- `bounce-gentle`: Gentle bounce (2s infinite)

### Global Styles (`src/index.css`)

**Base Layer**:
- Default border color: gray-200
- Body background: gray-50
- Body text: gray-900
- Default font: sans-serif

**Component Classes**:

#### `.btn-primary`
- Blue background (primary-600)
- White text
- Hover: darker blue (primary-700)
- Padding: py-2 px-4
- Rounded corners: rounded-lg
- Transition: 200ms

#### `.btn-secondary`
- Light gray background (secondary-100)
- Dark gray text (secondary-800)
- Hover: slightly darker gray
- Same padding and styling as primary

#### `.card`
- White background
- Rounded corners: rounded-xl
- Shadow: shadow-sm
- Border: gray-200
- Padding: p-6

#### `.input-field`
- Full width
- Padding: px-3 py-2
- Border: gray-300
- Rounded: rounded-lg
- Focus: ring-2 primary-500, transparent border

#### `.sidebar-item`
- Flex layout with items-center
- Padding: px-3 py-2
- Text: gray-700
- Rounded: rounded-lg
- Hover: gray-100 background
- Transition: 200ms

#### `.sidebar-item.active`
- Background: primary-50
- Text: primary-700
- Right border: 2px primary-600

**Usage Example**:
```jsx
<button className="btn-primary">Click Me</button>
<div className="card">
  <h2>Card Title</h2>
</div>
<input className="input-field" type="text" />
```

---

## Authentication Flow

### Direct Login Flow (Current Implementation)

```
1. User clicks role button (Admin/Student/Alumni)
   ↓
2. handleDirectLogin(role) called
   ↓
3. directLogin(role) from AuthContext
   ↓
4. Mock user object created based on role
   ↓
5. Token and user stored in localStorage
   ↓
6. User state updated in AuthContext
   ↓
7. Navigation based on role:
   - Admin → /admin
   - Student/Alumni → /
```

### Traditional Login Flow (Available but not used)

```
1. User enters email and password
   ↓
2. login(email, password) called
   ↓
3. POST /api/auth/login
   ↓
4. Server validates credentials
   ↓
5. JWT token generated
   ↓
6. Token and user stored in localStorage
   ↓
7. User state updated
   ↓
8. Navigation to dashboard
```

### Session Persistence

```
1. App loads
   ↓
2. AuthContext checks localStorage for token
   ↓
3. If token exists:
   - GET /api/auth/me with token
   - Server validates token
   - User data returned
   - User state updated
   ↓
4. If no token:
   - User state remains null
   - Redirect to login
```

### Logout Flow

```
1. User clicks logout
   ↓
2. logout() called from AuthContext
   ↓
3. User state set to null
   ↓
4. localStorage cleared (token, user)
   ↓
5. Navigation to /login
```

---

## Setup & Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Step-by-Step Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd alumni-connect
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Start the backend server**
   ```bash
   cd server
   npm start
   # Server runs on http://localhost:5175
   ```

5. **Start the frontend development server** (in a new terminal)
   ```bash
   npm run dev
   # Frontend runs on http://localhost:3000
   ```

6. **Access the application**
   - Open browser to `http://localhost:3000`
   - Use direct login buttons (Admin, Student, Alumni)

### Environment Variables

**Frontend** (`.env`):
```
VITE_API_BASE=http://localhost:5175
```

**Backend** (`.env` in server folder):
```
PORT=5175
JWT_SECRET=your-secret-key-here
CORS_ORIGINS=http://localhost:3000
```

### Database Initialization

The database is automatically created on first server start:
- File: `server/data.sqlite`
- Schema created automatically
- Seed data inserted if database is empty
- Demo users created:
  - Admin: admin@email.com / admin
  - Student: student@email.com / student
  - Alumni: alumni@email.com / alumni

---

## Development Guide

### Adding a New Page

1. **Create the page component** in `src/pages/`
   ```jsx
   // src/pages/NewPage.jsx
   import React from 'react'
   
   function NewPage() {
     return (
       <div className="space-y-6">
         <h1>New Page</h1>
       </div>
     )
   }
   
   export default NewPage
   ```

2. **Add route in `src/App.jsx`**
   ```jsx
   import NewPage from './pages/NewPage'
   
   // In AppRoutes component:
   <Route path="/new-page" element={<NewPage />} />
   ```

3. **Add navigation item in `src/components/Layout.jsx`**
   ```jsx
   const navigation = [
     // ... existing items
     { name: 'New Page', href: '/new-page', icon: YourIcon },
   ]
   ```

### Adding a New API Endpoint

1. **Add route in `server/index.js`**
   ```javascript
   app.get('/api/new-endpoint', authMiddleware, async (req, res) => {
     // Your logic here
     res.json({ data: 'result' })
   })
   ```

2. **Call from frontend**
   ```javascript
   const response = await fetch(`${API_BASE}/api/new-endpoint`, {
     headers: { Authorization: `Bearer ${token}` }
   })
   const data = await response.json()
   ```

### Styling Guidelines

1. **Use Tailwind utility classes** for styling
2. **Use component classes** from `index.css` for common elements:
   - `.btn-primary` for primary buttons
   - `.card` for card containers
   - `.input-field` for form inputs
3. **Follow color scheme**:
   - Primary actions: `primary-600`
   - Secondary actions: `secondary-100`
   - Text: `gray-900` for headings, `gray-600` for body
4. **Responsive design**:
   - Mobile-first approach
   - Use Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`

### State Management Best Practices

1. **Use Context API** for global state (auth, user)
2. **Use local state** for component-specific state
3. **Lift state up** when multiple components need it
4. **Avoid prop drilling** - use Context instead

### Code Organization

1. **Components**: Reusable UI components in `src/components/`
2. **Pages**: Full page components in `src/pages/`
3. **Contexts**: Global state in `src/contexts/`
4. **Utilities**: Helper functions in separate files if needed

### Testing

Currently, the project doesn't include automated tests. To add testing:

1. **Install testing libraries**:
   ```bash
   npm install --save-dev @testing-library/react @testing-library/jest-dom vitest
   ```

2. **Create test files** with `.test.jsx` extension
3. **Run tests**:
   ```bash
   npm test
   ```

---

## Additional Notes

### Chart Images

The Admin Dashboard uses QuickChart.io API for generating chart images:
- **User Growth Chart**: Bar chart showing monthly user registration
- **Donation Trends Chart**: Pie chart showing donation distribution by category

### Profile Pictures

Profile pictures are stored as URLs (not uploaded files):
- Default avatars from Unsplash
- Users can update avatar URL in profile settings
- Avatar displayed in:
  - Sidebar navigation
  - Profile page
  - User cards throughout the app
  - Top navigation bar

### Real-time Features

- **Server-Sent Events (SSE)** for live metrics in admin dashboard
- **Messaging** uses polling (can be upgraded to WebSockets)

### Security Considerations

1. **JWT Tokens**: Stored in localStorage (consider httpOnly cookies for production)
2. **Password Hashing**: Uses bcryptjs with salt rounds
3. **CORS**: Configurable via environment variables
4. **Input Validation**: Should be added on both client and server
5. **SQL Injection**: Uses parameterized queries (safe)

### Performance Optimizations

1. **Code Splitting**: Can be added with React.lazy()
2. **Image Optimization**: Consider using image CDN
3. **Database Indexing**: Add indexes on frequently queried columns
4. **Caching**: Consider adding Redis for session management

### Future Enhancements

- Real-time notifications
- File upload for avatars and attachments
- Email notifications
- Advanced search with full-text search
- Mobile app (React Native)
- Video conferencing integration
- Advanced analytics and reporting
- Multi-language support
- Dark mode

---

## Conclusion

This documentation provides a comprehensive overview of the Alumni Connect project. Each component, page, and feature has been detailed with its purpose, structure, and functionality. For specific implementation details, refer to the source code files mentioned in each section.

For questions or contributions, please refer to the project's README.md or contact the development team.

---

**Last Updated**: January 2026
**Version**: 1.0.0
