# Overview

This is a full-stack TypeScript application that demonstrates an AI-powered chat interface using the OpenAI Responses API with streaming and tool calling capabilities. The application is built with Express.js backend and React frontend, utilizing shadcn/ui components for the user interface. It provides a comprehensive chat experience with customizable tools, file uploads, vector search, and optional Google service integrations.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend is built using React with TypeScript and modern tooling:

- **Component Library**: Shadcn/ui components built on top of Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: Zustand for client-side state management with persistence
- **Build Tool**: Vite for development and build processes
- **Routing**: Wouter for lightweight client-side routing

The frontend follows a component-driven architecture with clear separation between UI components, business logic, and state management. Components are organized in a hierarchical structure with reusable UI components in the `/components/ui` directory.

## Backend Architecture

The backend uses Express.js with TypeScript:

- **Server Framework**: Express.js with middleware for JSON parsing and CORS
- **API Structure**: RESTful API endpoints organized under `/api` routes
- **File Organization**: Modular route handlers with separate concerns for different functionalities
- **Development**: Hot reloading with tsx and custom error handling

The backend follows a clean separation of concerns with dedicated route handlers for different features like OpenAI integration, Google services, and file management.

## Data Storage Solutions

The application uses multiple storage strategies:

- **Database**: PostgreSQL with Drizzle ORM for schema management and migrations
- **Session Storage**: Zustand with localStorage persistence for client-side state
- **File Storage**: OpenAI's vector stores for document storage and search
- **Authentication**: Cookie-based session management for Google OAuth

## Authentication and Authorization

Authentication is implemented through multiple mechanisms:

- **Google OAuth**: OpenID Connect flow for Google Calendar and Gmail integration
- **API Key Authentication**: OpenAI API key for AI service access
- **Cookie-based Sessions**: Secure cookie storage for maintaining user sessions
- **Token Management**: Automatic refresh token handling for Google services

## Tool System Architecture

The application features a flexible tool system:

- **Built-in Tools**: Web search, file search, and code interpreter tools
- **Custom Functions**: Weather API and joke generator with extensible function mapping
- **Google Connectors**: Calendar and Gmail integration through MCP (Model Context Protocol)
- **Dynamic Tool Loading**: Runtime tool configuration based on user preferences

## Streaming and Real-time Features

Real-time communication is handled through:

- **Server-Sent Events (SSE)**: Streaming responses from OpenAI API
- **Event Processing**: Client-side event handling for different response types
- **Progress Tracking**: Real-time tool execution progress and status updates
- **Async Processing**: Non-blocking tool execution with status management

# External Dependencies

## AI Services
- **OpenAI API**: Core AI functionality with GPT-4 model integration for chat responses and tool calling
- **OpenAI Vector Stores**: Document storage and semantic search capabilities

## Database and ORM
- **PostgreSQL**: Primary database (configured but may need to be added)
- **Drizzle ORM**: Type-safe database operations and schema management
- **Neon Database**: Serverless PostgreSQL provider for cloud deployment

## Google Services Integration
- **Google OAuth**: OpenID Connect client for authentication
- **Google Calendar API**: Calendar event access and management
- **Gmail API**: Email search and management capabilities

## External APIs
- **OpenStreetMap Nominatim**: Geocoding service for location-based weather queries
- **Open-Meteo**: Weather data API for current conditions and forecasts

## UI and Styling
- **Radix UI**: Accessible component primitives for complex UI elements
- **Tailwind CSS**: Utility-first CSS framework with custom theming
- **Lucide React**: Icon library for consistent iconography

## Development and Build Tools
- **Replit Integration**: Runtime error modal and cartographer for development
- **TypeScript**: Static typing throughout the application
- **ESBuild**: Fast bundling for production builds
- **PostCSS**: CSS processing with Tailwind and Autoprefixer

## Additional Libraries
- **React Query**: Server state management and caching
- **React Markdown**: Markdown rendering for chat messages
- **React Dropzone**: File upload interface for vector store management
- **Recharts**: Chart components for data visualization
- **XY Flow**: Flow diagram components for complex visualizations