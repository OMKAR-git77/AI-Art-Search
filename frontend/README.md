# AI-Powered Art and Design Style Search Application

A modern React application that uses AI to find similar artworks and designs based on style, texture, color palette, and emotional expression.

## Features

- **AI-Powered Search**: Upload any image to find visually similar artworks using advanced AI technology
- **Smart Filters**: Filter results by style, texture, color palette, and emotional tone
- **Bulk Upload**: Upload multiple images at once for batch processing
- **Modern UI**: Dark theme with glass morphism effects and responsive design
- **Secure Authentication**: Protected routes with login/logout functionality

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS v4 with custom design tokens
- **UI Components**: shadcn/ui component library
- **State Management**: React Context API
- **File Upload**: react-dropzone for drag-and-drop functionality
- **Authentication**: Custom auth system with localStorage
- **TypeScript**: Full type safety throughout the application

## Getting Started

### Prerequisites

- Node.js 18+ installed (for local development)
- Docker and Docker Compose (for containerized deployment)
- FastAPI backend running on `http://127.0.0.1:8000`

### Local Development

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd ai-art-search
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Docker Deployment

#### Quick Start with Docker Compose

1. **Development Mode** (with hot reload):
\`\`\`bash
docker-compose --profile dev up --build
\`\`\`

2. **Production Mode**:
\`\`\`bash
docker-compose --profile prod up --build
\`\`\`

3. **Development with Hot Reload** (alternative):
\`\`\`bash
docker-compose --profile dev-hot up --build
\`\`\`

#### Manual Docker Commands

1. **Build the Docker image**:
\`\`\`bash
docker build -t art-search-frontend .
\`\`\`

2. **Run the container**:
\`\`\`bash
# Development
docker run -p 3000:3000 -v $(pwd):/app -v /app/node_modules art-search-frontend npm run dev

# Production
docker run -p 3000:3000 art-search-frontend
\`\`\`

#### Docker Features

- **Multi-stage build**: Optimized for production with minimal image size
- **Standalone output**: Next.js standalone mode for better Docker performance
- **Development support**: Hot reload and volume mounting for development
- **Security**: Non-root user in production container
- **Optimization**: Proper layer caching and .dockerignore for faster builds

### Default Login Credentials

- **Username**: `admin`
- **Password**: `admin`

## Project Structure

\`\`\`
├── app/                    # Next.js App Router pages
│   ├── home/              # Main search page
│   ├── landing/           # Landing page
│   ├── login/             # Authentication page
│   ├── upload/            # Bulk upload page
│   ├── layout.tsx         # Root layout with providers
│   └── globals.css        # Global styles and design tokens
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui components
│   ├── navigation.tsx    # Main navigation component
│   ├── search-interface.tsx
│   ├── search-results.tsx
│   ├── search-filters.tsx
│   ├── bulk-upload-interface.tsx
│   └── protected-route.tsx
├── contexts/             # React Context providers
│   └── auth-context.tsx  # Authentication state management
└── lib/                  # Utility functions
    └── utils.ts          # Common utilities
\`\`\`

## API Integration

The application integrates with a FastAPI backend with the following endpoints:

### Authentication
- `POST /token` - User login with form data (username, password)

### Search
- `POST /search/` - Find similar images (multipart/form-data with single image file)

### Upload
- `POST /upload/bulk/` - Bulk upload images (multipart/form-data with multiple files)

## Component Architecture

### Main Components

- **SearchInterface**: Drag-and-drop file upload with preview
- **SearchResults**: Grid display of similar images with similarity scores
- **SearchFilters**: Toggle filters for style, texture, color, and emotion
- **BulkUploadInterface**: Multiple file upload with progress tracking
- **Navigation**: Responsive navigation with mobile menu
- **ProtectedRoute**: Route protection wrapper

### Design System

The application uses a custom design system with:
- **Dark Theme**: Modern dark aesthetic inspired by AI/tech platforms
- **Glass Morphism**: Subtle backdrop blur effects
- **Semantic Tokens**: Consistent color and spacing system
- **Responsive Design**: Mobile-first approach with breakpoints

## Features in Detail

### Image Search
1. Upload an image via drag-and-drop or file picker
2. AI analyzes the image for visual characteristics
3. Returns similar images with similarity scores and explanations
4. Filter results by different criteria

### Bulk Upload
1. Select multiple image files
2. Preview all selected files with progress tracking
3. Upload all files simultaneously
4. Success/error feedback for each file

### Authentication
1. Simple login form with demo credentials
2. Protected routes redirect to login if not authenticated
3. Persistent login state using localStorage
4. Logout functionality with redirect

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Customization

The application uses Tailwind CSS v4 with custom design tokens defined in `globals.css`. You can customize:

- Colors and themes in the CSS custom properties
- Component styles using Tailwind classes
- Layout and spacing using the design token system

## Deployment

The application is ready for deployment on Vercel or any other Next.js-compatible platform:

1. Build the application: `npm run build`
2. Deploy the `.next` folder to your hosting platform
3. Ensure your FastAPI backend is accessible from the deployed frontend

## License

This project is created for demonstration purposes as part of an AI-powered art search application.
\`\`\`

```json file="" isHidden
