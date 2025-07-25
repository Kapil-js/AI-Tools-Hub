# AI Tools Hub

A comprehensive AI-powered platform offering various tools for content creation, image enhancement, and productivity.

## Features

### AI Tools
- **Image Enhancer** - AI-powered image upscaling and enhancement
- **Face Swapper** - Advanced face swapping technology
- **PDF Compressor** - Compress PDF files while maintaining quality
- **Resume Builder** - Create professional resumes with AI assistance
- **Instagram Caption Generator** - Generate engaging social media captions
- **YouTube Thumbnail Generator** - Create eye-catching video thumbnails
- **AI Article Writer** - Generate high-quality articles and content

### Admin Panel
- **User Management** - Manage user accounts, roles, and permissions
- **Content Management** - Create and manage blog posts and articles
- **Analytics Dashboard** - Monitor platform performance and user engagement
- **Tools Management** - Configure AI tools and their availability
- **Settings** - Comprehensive platform configuration

### Authentication
- Firebase Authentication with email/password and Google sign-in
- Role-based access control (User, Admin, Moderator)
- Protected routes and admin panel access

## Tech Stack

- **Frontend**: Next.js 13, React, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **Deployment**: Firebase Hosting

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-tools-platform
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a Firebase project
   - Enable Authentication, Firestore, and Storage
   - Copy your Firebase config to `.env`

4. Set up environment variables:
```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Admin Setup

1. Create an admin user in Firebase Authentication
2. Add the user to the `admins` collection in Firestore:
```javascript
{
  uid: "user-uid",
  email: "admin@example.com",
  role: "super_admin",
  permissions: ["all"],
  isActive: true,
  createdAt: serverTimestamp()
}
```

3. Access the admin panel at `/admin`

## Project Structure

```
├── app/                    # Next.js 13 app directory
│   ├── admin/             # Admin panel pages
│   ├── auth/              # Authentication pages
│   ├── tools/             # AI tools pages
│   └── ...                # Other pages
├── components/            # Reusable components
│   ├── admin/             # Admin-specific components
│   ├── auth/              # Authentication components
│   └── ui/                # UI components
├── contexts/              # React contexts
├── hooks/                 # Custom hooks
├── lib/                   # Utility functions and configs
└── public/                # Static assets
```

## Features Overview

### User Features
- User registration and authentication
- Access to AI tools
- Profile management
- Tool usage tracking

### Admin Features
- Complete user management
- Blog content management
- Analytics and reporting
- Tool configuration
- System settings
- Security controls

### AI Tools
Each tool provides:
- User-friendly interface
- Real-time processing feedback
- Download/export functionality
- Usage analytics
- Premium features

## Deployment

### Firebase Hosting

1. Build the project:
```bash
npm run build
```

2. Deploy to Firebase:
```bash
firebase deploy
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact: support@aitoolshub.com