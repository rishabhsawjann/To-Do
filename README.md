# GGTodo Dashboard

A modern, responsive todo management dashboard built with Next.js 14, Tailwind CSS, shadcn/ui, and Firebase Authentication. Features real-time notifications, calendar view, and persistent data management with a beautiful dark theme.

## ✨ Features

- 🔐 **Firebase Authentication**: Secure sign-up, sign-in, and user management
- 📝 **Todo Management**: Create, edit, delete, and mark todos as complete
- 📅 **Calendar View**: Visual calendar with todo indicators and date selection
- 🔔 **Smart Notifications**: Real-time alerts for upcoming todos (next 4 hours) and completed tasks
- 👤 **User Profiles**: Personalized profiles with avatar upload and data URL storage
- 🎨 **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- 💾 **Persistent Storage**: All data saved to localStorage using Zustand
- 📱 **Responsive Design**: Mobile-first approach with collapsible sidebar
- 🌙 **Dark Theme**: Beautiful dark blue and green aesthetic
- ⚡ **Real-time Updates**: Instant UI updates with toast notifications

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: Zustand with localStorage persistence
- **Authentication**: Firebase Auth
- **Language**: TypeScript
- **Icons**: Lucide React
- **Deployment**: Vercel

## 🏗️ Project Structure

```
ggtodo-dashboard/
├── app/                    # Next.js 14 app directory
│   ├── (dashboard)/       # Dashboard route group
│   │   ├── layout.tsx     # Dashboard layout with sidebar
│   │   ├── page.tsx       # Main dashboard page
│   │   ├── profile/       # Profile management
│   │   ├── todo/          # Dedicated todo list page
│   │   └── calendar/      # Calendar view page
│   ├── login/             # Authentication pages
│   ├── signup/            # User registration
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── Sidebar.tsx       # Navigation sidebar
│   ├── Topbar.tsx        # Top navigation bar
│   ├── TodoList.tsx      # Todo list component
│   ├── TodoForm.tsx      # Todo creation/editing form
│   └── NotificationDrawer.tsx # Notification panel
├── stores/               # Zustand state stores
│   ├── auth.ts           # Firebase authentication store
│   ├── todos.ts          # Todo management store
│   └── profile.ts        # Profile management store
├── lib/                  # Utility functions
│   ├── utils.ts          # General utilities
│   ├── time.ts           # Time-related helpers
│   └── firebase.ts       # Firebase configuration
└── types/                # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Firebase project (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ggtodo-dashboard
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Copy your Firebase config to `lib/firebase.ts`

4. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Pages & Features

### 🏠 Dashboard (`/`)
- **Overview**: Welcome message with user's name
- **Create Todo**: Quick access to add new tasks
- **Todo List**: Filterable list (All/Upcoming/Completed)
- **Notifications**: Right-side drawer with upcoming and completed todos

### 📝 Todo Page (`/todo`)
- **Dedicated View**: Full-screen todo management
- **Advanced Filtering**: All, Upcoming, and Completed views
- **Inline Actions**: Edit, delete, mark complete/undo
- **Sorting**: Automatic sorting by due date and completion status

### 📅 Calendar Page (`/calendar`)
- **Monthly View**: Interactive calendar with todo indicators
- **Date Selection**: Click dates to view associated todos
- **Visual Indicators**: Different colors for upcoming and completed todos
- **Todo Details**: Show todos for selected dates

### 👤 Profile Page (`/profile`)
- **Personal Info**: Display name and avatar
- **Avatar Upload**: Upload and preview profile pictures
- **Statistics**: Todo counts (All, Upcoming, Completed)
- **Account Info**: Firebase user details and join date

### 🔔 Notifications
- **Smart Alerts**: Upcoming todos due in next 4 hours
- **Completed Summary**: Today's completed tasks
- **Real-time Updates**: Instant notification when todos change
- **Scrollable Content**: Handle large numbers of notifications

## 🎯 Core Functionality

### Todo Management
- **Create**: Title, description, and scheduled date/time
- **Validation**: Future date requirement with inline error messages
- **Edit**: Modify existing todos inline
- **Delete**: Remove todos with confirmation
- **Complete**: Mark todos as done with timestamp

### Authentication
- **Sign Up**: Create new accounts with email/password
- **Sign In**: Access existing accounts
- **Profile Sync**: Automatic profile creation for new users
- **Session Management**: Persistent login state

### Data Persistence
- **Local Storage**: Todos and profiles saved locally
- **Real-time Sync**: Instant updates across all components
- **User Isolation**: Each user sees only their own data

## 🚀 Deployment

### Vercel (Recommended)
1. **Push to GitHub**
2. **Connect to Vercel**
3. **Add Firebase domains** to authorized domains
4. **Deploy automatically**

### Docker
```bash
# Build the image
docker build -t ggtodo-dashboard .

# Run the container
docker run -d -p 3000:3000 --name ggtodo ggtodo-dashboard
```

## 🎨 Customization

### Theme Colors
- **Primary**: Dark blue (`slate-900`)
- **Accent**: Green (`green-600`)
- **Background**: Dark theme with proper contrast

### Adding Features
1. **New Pages**: Add routes in `app/(dashboard)/`
2. **Components**: Create in `components/` directory
3. **State**: Extend stores in `stores/` folder
4. **Styling**: Use Tailwind classes and CSS variables

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📝 Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Docker
docker build -t ggtodo .     # Build Docker image
docker run -p 3000:3000 ggtodo  # Run container
```

## 🔧 Troubleshooting

### Common Issues
- **Authentication Errors**: Ensure Firebase domains are added to authorized domains
- **Build Errors**: Check Node.js version (18+ required)
- **Import Errors**: Verify file paths and component names

### Firebase Setup
- Enable Email/Password authentication
- Add deployment domains to authorized domains
- Check Firebase config in `lib/firebase.ts`

## 📄 License

This project is licensed under the MIT License.

## 🤝 Support

For questions or issues:
1. Check the documentation above
2. Verify Firebase configuration
3. Check browser console for errors
4. Ensure all dependencies are installed

---

**Built with using Next.js 14, Tailwind CSS, and Firebase**

