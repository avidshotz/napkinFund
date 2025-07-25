# Napkin Fund

A beautiful React application featuring the NapkinCard component - a stylized card interface that mimics the look and feel of a napkin with realistic shadows, creases, and patterns.

## Features

- **NapkinCard Component**: A reusable React component with realistic napkin styling
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode Support**: Automatic dark/light theme switching
- **Tailwind CSS**: Modern styling with utility classes
- **Supabase Authentication**: Secure user authentication with email/password and Google OAuth
- **Role-Based Access**: VC and Founder modes with different permissions

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Supabase account and project

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to your project dashboard
3. Navigate to Settings > API
4. Copy your project URL and anon key

### Environment Configuration

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Authentication

The app includes:
- **Email/Password Authentication**: Traditional sign up and sign in
- **Google OAuth**: One-click sign in with Google EDIT: this isn't here anymore and instead uses supabase auth
- **Session Management**: Automatic session persistence
- **Protected Routes**: App content only visible to authenticated users

## Usage

The NapkinCard component accepts the following props:

- `children`: Content to display inside the card
- `width`: Width of the card (default: 500px)
- `height`: Height of the card (default: 500px)

Example:
```jsx
<NapkinCard width={400} height={300}>
  <h2>My Content</h2>
  <p>This will be displayed inside the napkin card.</p>
</NapkinCard>
```

## Role-Based Features

### VC Mode
- Browse and like ideas in the VCs section
- View matches (ideas liked by both roles)

### Founder Mode
- Submit new one-liner ideas
- View ideas that VCs have liked
- View matches (ideas liked by both roles)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Technologies Used

- React 18
- Next.js 14
- Tailwind CSS
- PostCSS
- Supabase (Authentication & Database) #   n a p k i n F u n d 
 
 
