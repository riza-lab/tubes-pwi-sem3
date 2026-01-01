# GO-RENT - Luxury Car Rental Platform

A modern, full-stack car rental application built with Next.js, TypeScript, and Supabase.

## Features

- 🏎️ Browse luxury cars with detailed specifications
- 📅 Easy booking system with date selection
- 👤 User authentication and profiles
- 📊 Admin dashboard for managing bookings
- 💳 Secure payment processing simulation
- 📱 Responsive design for all devices

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, React
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Styling**: CSS Modules with custom design system
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Vercel account (for deployment)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/go-rent.git
cd go-rent
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Copy the SQL from `supabase/schema.sql` and run it in the Supabase SQL Editor
4. Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

## Database Schema

The application uses the following tables:

- `cars` - Car inventory with details
- `bookings` - User booking records
- `profiles` - User profile information

## Admin Access

Use these credentials to access the admin dashboard:

- Email: `drunxxvn@gmail.com`
- Password: `pukig4r1T`

## Project Structure

```
go-rent/
├── components/          # Reusable React components
├── data/               # Data fetching functions
├── pages/              # Next.js pages (routes)
├── public/             # Static assets
├── styles/             # Global styles
├── supabase/           # Database schema and migrations
└── utils/              # Utility functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
