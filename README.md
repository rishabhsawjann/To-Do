# GGTodo Dashboard

A modern, responsive todo management dashboard built with Next.js 14, Tailwind CSS, shadcn/ui, and Zustand. Features role-based access control, real-time notifications, and persistent local storage.

## Features

- 🎯 **Role-based Dashboard**: Normal users and Super Admins with different access levels
- 📝 **Todo Management**: Create, edit, delete, and mark todos as complete
- 🔔 **Smart Notifications**: Real-time alerts for upcoming todos (next 4 hours)
- 👤 **User Management**: Admin panel for managing user roles
- 🎨 **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- 💾 **Persistent Storage**: All data saved to localStorage using Zustand
- 📱 **Responsive Design**: Mobile-first approach with collapsible sidebar
- 🔄 **User Switching**: Demo feature to switch between different user accounts

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: Zustand with localStorage persistence
- **Language**: TypeScript
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

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

3. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
ggtodo-dashboard/
├── app/                    # Next.js 14 app directory
│   ├── (dashboard)/       # Dashboard route group
│   │   ├── layout.tsx     # Dashboard layout with sidebar
│   │   ├── page.tsx       # Main dashboard page
│   │   ├── profile/       # Profile management
│   │   └── admin/         # Admin routes
│   │       └── users/     # User management
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── Sidebar.tsx       # Navigation sidebar
│   ├── Topbar.tsx        # Top navigation bar
│   ├── TodoList.tsx      # Todo list component
│   ├── TodoForm.tsx      # Todo creation/editing form
│   ├── UserTable.tsx     # User management table
│   └── NotificationDrawer.tsx # Notification panel
├── stores/               # Zustand state stores
│   ├── users.ts          # User management store
│   ├── todos.ts          # Todo management store
│   ├── session.ts        # Session management store
│   └── profile.ts        # Profile management store
├── lib/                  # Utility functions
│   ├── utils.ts          # General utilities
│   └── time.ts           # Time-related helpers
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## Usage

### Dashboard

- **Main View**: Overview of all todos with filtering options
- **Create Todo**: Click "+ Add Todo" to create new tasks
- **Filter Todos**: Use the filter dropdown to view All/Upcoming/Completed todos
- **Quick Actions**: Mark todos complete, edit, or delete directly from the list

### Notifications

- **Bell Icon**: Click the notification bell in the top bar
- **Upcoming Alerts**: See todos due in the next 4 hours
- **Completed Summary**: View recently completed tasks

### Profile Management

- **Edit Profile**: Update name and upload avatar
- **Avatar Upload**: Click the edit button on your profile picture
- **Summary Cards**: View todo statistics

### Admin Panel (Super Admin Only)

- **User Management**: Access via sidebar (visible only to super admins)
- **Role Toggle**: Switch users between normal and super admin roles
- **User Statistics**: Overview of total users and role distribution

### User Switching

- **Demo Feature**: Use the user switcher in the sidebar header
- **Multiple Accounts**: Switch between Fawaz (normal), Jane (super admin), and others
- **Role Testing**: Experience different permission levels

## Available Scripts

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

## Docker Deployment

### Build the Image
```bash
docker build -t ggtodo-dashboard .
```

### Run the Container
```bash
docker run -d -p 3000:3000 --name ggtodo ggtodo-dashboard
```

### Using Docker Compose
```yaml
version: '3.8'
services:
  ggtodo:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
```

## Data Persistence

The application uses localStorage for data persistence:

- **Users**: Sample users with roles (normal/superuser)
- **Todos**: Sample todos for demonstration
- **Session**: Current user selection
- **Profile**: User profile customizations

All data persists between browser sessions and page refreshes.

## Role-Based Access Control

### Normal User
- Access to Dashboard, Calendar, Todo List, and Profile
- Can manage their own todos
- Cannot access admin features

### Super Admin
- All normal user permissions
- Access to User Management
- Can toggle user roles
- Full system access

## Customization

### Adding New Components
1. Create component in `components/` directory
2. Import and use in your pages
3. Follow shadcn/ui patterns for consistency

### Modifying Stores
1. Update store files in `stores/` directory
2. Add new actions and state properties
3. Update TypeScript types in `types/`

### Styling Changes
1. Modify Tailwind classes in components
2. Update CSS variables in `app/globals.css`
3. Customize shadcn/ui theme in `tailwind.config.js`

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

---

