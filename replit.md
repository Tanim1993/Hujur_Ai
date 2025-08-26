# Hujur - Islamic Learning Platform

## Overview

Hujur is an interactive Islamic learning platform featuring an AI teacher that guides users through lessons on Quran, Salah (prayer), and Dua (supplication). The application provides a gamified learning experience with progress tracking, achievements, and multilingual support (English and Bengali). Users can learn through structured chapters and lessons, with text-to-speech audio support and interactive exercises.

## Recent Changes (August 2025)

- **Advanced Voice Features**: Implemented comprehensive voice interaction system with three major components:
  - **Tajweed Pronunciation Analysis**: AI-powered feedback on Quranic pronunciation with real-time Tajweed rules assessment
  - **Imam Mode**: Interactive prayer practice sessions with step-by-step guidance and timing
  - **Multilingual Voice Commands**: Support for English, Bengali, Arabic, and Urdu voice commands
- **Voice Recognition Integration**: Added pronunciation practice with speech-to-text feedback for lessons
- **Chapter Progression System**: Implemented unlock logic where completing 80% of a chapter unlocks the next one
- **Expanded Beginner Content**: Added Arabic Numbers and Islamic Greetings chapters for comprehensive beginner learning
- **Text-to-Speech Audio**: Replaced missing audio files with browser Speech Synthesis API for immediate audio functionality
- **Realistic 3D AI Teacher**: Enhanced character design with professional, 3D-style appearance and interactive animations
- **5 Complete Learning Chapters**: Quran (5 lessons), Arabic Numbers (10 lessons), Islamic Greetings (5 lessons), Salah (10 lessons), and Dua (8 lessons)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18 with TypeScript**: Modern React application using functional components and hooks
- **Vite**: Fast build tool and development server for optimal development experience
- **Wouter**: Lightweight client-side routing library for navigation between pages
- **Tailwind CSS**: Utility-first CSS framework for responsive design and styling
- **Shadcn/ui**: Component library built on Radix UI primitives for consistent UI elements
- **Framer Motion**: Animation library for smooth transitions and interactive elements

### Component Structure
- **Reusable UI Components**: Custom components for AI teacher, audio player, progress tracking, and lesson interfaces
- **Page Components**: Home, Chapter, Lesson, and NotFound pages for complete user journey
- **State Management**: React Query for server state management and caching
- **Custom Hooks**: Dedicated hooks for audio playback, progress tracking, and mobile responsiveness

### Backend Architecture
- **Express.js**: RESTful API server with TypeScript support
- **In-Memory Storage**: MemStorage class implementing storage interface for development (easily replaceable with database)
- **API Routes**: RESTful endpoints for chapters, lessons, and user progress management
- **Middleware**: Request logging, error handling, and static file serving

### Data Models
- **Users**: Profile management with language preferences, progress tracking, and achievement system
- **Chapters**: Organized learning modules with metadata and lesson counts
- **Lessons**: Individual learning units with content, audio, and interactive exercises
- **UserProgress**: Tracks completion status, scores, and learning analytics

### Database Schema (Drizzle ORM)
- **PostgreSQL**: Production database with Drizzle ORM for type-safe database operations
- **Schema Definition**: Comprehensive tables for users, chapters, lessons, and progress tracking
- **Migrations**: Database versioning and schema management through Drizzle Kit

### Styling and Design System
- **CSS Variables**: Custom color palette with Islamic-themed colors (islamic-green, warm-sand, golden-yellow)
- **Typography**: Multi-font support including Bengali fonts for internationalization
- **Responsive Design**: Mobile-first approach with consistent spacing and component sizing
- **Theme System**: Light theme with accessibility considerations

### Development Features
- **TypeScript**: Full type safety across frontend and backend
- **Path Aliases**: Clean import statements with @ and @shared aliases
- **Hot Module Replacement**: Fast development feedback with Vite HMR
- **Error Boundaries**: Graceful error handling in production and development

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, and React hooks for modern component development
- **Build Tools**: Vite for bundling, TypeScript for type checking, and PostCSS for CSS processing
- **Routing**: Wouter for lightweight client-side routing

### UI and Styling
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Framer Motion**: Animation library for enhanced user interactions
- **Lucide React**: Icon library for consistent iconography

### Data Management
- **TanStack React Query**: Server state management, caching, and synchronization
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL support
- **Zod**: Runtime type validation and schema definition

### Database and Storage
- **Neon Database**: Serverless PostgreSQL database (@neondatabase/serverless)
- **PostgreSQL**: Production database with session storage support
- **Connect PG Simple**: PostgreSQL session store for Express sessions

### Development Tools
- **ESBuild**: Fast JavaScript/TypeScript bundler for production builds
- **TSX**: TypeScript execution environment for development
- **Replit Plugins**: Development environment integration for cartographer and error overlay

### Form and Validation
- **React Hook Form**: Performant forms with minimal re-renders
- **Hookform Resolvers**: Integration between React Hook Form and validation libraries
- **Drizzle Zod**: Schema validation integration between Drizzle and Zod

### Utilities
- **Class Variance Authority**: Type-safe utility for creating component variants
- **clsx**: Conditional className utility for dynamic styling
- **date-fns**: Modern date utility library for date formatting and manipulation
- **nanoid**: Secure URL-friendly unique string ID generator

### Audio and Media
- **Web Audio API**: Browser-native audio playback capabilities through custom hooks
- **Embla Carousel**: Touch-friendly carousel component for content presentation