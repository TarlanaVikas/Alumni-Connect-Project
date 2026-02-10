# Alumni Connect - University Alumni Management Platform

A comprehensive, modern web application designed to connect university alumni, students, and administrators through a feature-rich platform.

## 🚀 Features

### Core Functionality
- **Authentication System**: Secure login/register with role-based access
- **AI Bot Integration**: Intelligent assistant for platform navigation and support
- **User Profiles**: Complete CRUD operations with skills, experience, and social links
- **Messaging System**: Real-time chat with alumni and community members
- **Mail & Information Center**: Centralized communication hub with announcements
- **People You May Know**: Smart suggestions for networking and connections
- **Events Management**: Comprehensive event scheduling and management system
- **Search & Filter**: Advanced search across people, events, organizations, and content
- **Donations & Fundraising**: Complete donation management with campaign tracking
- **Admin Dashboard**: Comprehensive administrative control with:
  - User Management (Students & Alumni CRUD operations)
  - Role-based Access Control (Admin, Alumni, Student)
  - Bulk Operations (Bulk delete, role changes, status updates)
  - Advanced Filtering & Search
  - User Analytics & Reporting
  - Event Management
  - Donation Tracking

### Technical Features
- **Modern UI/UX**: Clean, professional design with responsive layout
- **Real-time Updates**: Live notifications and status updates
- **Advanced Filtering**: Multi-criteria search and filter options
- **Data Visualization**: Charts and analytics for insights
- **Mobile Responsive**: Optimized for all device sizes
- **Role-based Access**: Different interfaces for alumni, students, and admins

## 🛠️ Technology Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS with custom components
- **Icons**: Lucide React
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Charts**: Recharts
- **Date Handling**: date-fns
- **HTTP Client**: Axios

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd alumni-connect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔐 Admin Access

To access the admin dashboard, use one of these credentials:
- **Email**: `admin@university.edu` or `admin@email.com`
- **Password**: Any password (demo mode)

The admin dashboard provides comprehensive management tools for:
- Managing students and alumni accounts
- Role assignment and permissions
- Bulk operations on user data
- Analytics and reporting
- Event and donation management

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout.jsx      # Main layout wrapper
├── contexts/           # React Context providers
│   └── AuthContext.jsx # Authentication state management
├── pages/              # Page components
│   ├── Login.jsx       # Authentication pages
│   ├── Register.jsx
│   ├── Dashboard.jsx   # Main dashboard
│   ├── Profile.jsx     # User profile management
│   ├── Messaging.jsx   # Chat system
│   ├── MailInfo.jsx    # Communication center
│   ├── PeopleYouMayKnow.jsx # Networking suggestions
│   ├── Events.jsx      # Event management
│   ├── Search.jsx      # Search and filter
│   ├── Donations.jsx   # Fundraising system
│   ├── AdminDashboard.jsx # Admin interface
│   └── AIBot.jsx       # AI assistant
├── App.jsx             # Main application component
├── main.jsx           # Application entry point
└── index.css          # Global styles
```

## 🎯 Key Features Breakdown

### 1. Authentication & User Management
- Secure login/registration system
- Role-based access control (Alumni, Student, Admin)
- Profile management with comprehensive user data
- Social links and professional information

### 2. AI Bot Assistant
- Intelligent chat interface
- Context-aware responses
- Quick action suggestions
- Platform navigation help

### 3. Messaging System
- Real-time chat interface
- Message history and search
- Online status indicators
- File sharing capabilities

### 4. Events Management
- Event creation and management
- Registration system
- Calendar integration
- Event categories and filtering

### 5. Donations & Fundraising
- Campaign creation and management
- Donation tracking
- Progress visualization
- Receipt generation

### 6. Search & Discovery
- Advanced search across all content types
- Filter by multiple criteria
- Smart suggestions
- Content categorization

### 7. Admin Dashboard
- User management
- Event oversight
- Donation tracking
- Analytics and reporting
- System monitoring

## 🎨 Design System

The application uses a consistent design system with:
- **Primary Colors**: Blue palette for main actions
- **Secondary Colors**: Gray palette for neutral elements
- **Typography**: Inter font family for readability
- **Components**: Reusable, accessible UI components
- **Responsive**: Mobile-first design approach

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your preferred hosting service:
   - Vercel
   - Netlify
   - AWS S3
   - Any static hosting service

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- Real-time notifications
- Mobile app development
- Advanced analytics
- Integration with external services
- Multi-language support
- Video conferencing integration

---

**Alumni Connect** - Building stronger university communities through technology.


