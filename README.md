# FUT4E - Football Video Sharing Platform

A web application for sharing and managing football-related videos. Users can upload, categorize, like, and comment on football videos.

## Features

- **User Authentication**
  - Register/Login functionality
  - JWT-based authentication
  - Protected routes for authenticated users
  - Password recovery options
  - Social media login integration (Google, Facebook)
  - Profile management

- **Video Management**
  - Upload videos with titles and categories
  - Delete own videos
  - Categorize videos (Football, Skills, Highlights)
  - View videos by category
  - Search functionality with filters
  - Video tagging system
  - Batch operations for multiple videos

- **Social Features**
  - Like videos
  - Comment on videos
  - View trending videos
  - Personal favorites collection
  - Share videos to social networks
  - Follow other users
  - Activity feed for followed users
  - Notifications for interactions

- **User Interface**
  - Responsive design
  - Modern hamburger menu
  - Grid layout for videos
  - Modal dialogs for actions
  - Dark/Light mode toggle
  - Customizable user dashboard
  - Accessibility features

## Tech Stack

### Frontend
- React 18 with functional components and hooks
- Redux for state management
- CSS3 with SASS preprocessor
- Styled Components for component styling
- React Router v6 for navigation
- Axios for network requests
- Material UI components
- Video.js for video playback
- Jest and React Testing Library for testing

### Backend
- Node.js (v16+)
- Express.js for API routing
- MongoDB with Mongoose for data modeling
- JWT for authentication and authorization
- Passport.js for authentication strategies
- Multer for file uploads
- AWS S3 for video storage
- Redis for caching
- Socket.io for real-time features

## Project Structure
```
fut4e-frontend/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── assets/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   ├── layout/
│   │   ├── video/
│   │   └── common/
│   ├── pages/
│   ├── contexts/
│   ├── hooks/
│   ├── services/
│   ├── utils/
│   ├── styles/
│   ├── App.js
│   └── index.js
├── tests/
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Installation and Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Git

### Frontend Setup
1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/fut4e-frontend.git
   cd fut4e-frontend
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file based on `.env.example`
   ```bash
   cp .env.example .env
   ```

4. Edit the `.env` file with your configuration
   ```
   REACT_APP_API_URL=http://https://fut4e.onrender.com/api
   REACT_APP_STORAGE_URL=http://https://fut4e.onrender.com/uploads
   ```

5. Start the development server
   ```bash
   npm start
   # or
   yarn start
   ```

### Backend Setup
1. Clone the backend repository
   ```bash
   git clone https://github.com/yourusername/fut4e-backend.git
   cd fut4e-backend
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure environment variables
   ```bash
   cp .env.example .env
   ```

4. Edit the `.env` file with your MongoDB connection string and JWT secret
   ```
   MONGODB_URI=mongodb://localhost:27017/fut4e
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

5. Start the server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Usage

### User Registration and Login
1. Navigate to the signup page and create an account
2. Verify your email address via the sent link
3. Log in with your credentials

### Video Management
1. Click on the "Upload" button to add a new video
2. Fill in the required details (title, description, category)
3. Wait for the upload to complete
4. Access your videos from your profile page

### Social Interaction
1. Browse videos by category or search for specific content
2. Like videos by clicking the heart icon
3. Comment on videos in the comment section
4. Follow users whose content you enjoy
5. Check your notifications for interactions

## API Documentation

The API documentation is available at `/api/docs` when running the backend server. It provides comprehensive information about all available endpoints, request methods, required parameters, and response formats.

## Deployment

### Frontend Deployment
The frontend can be deployed to Netlify, Vercel, or any other static site hosting:

1. Build the production version
   ```bash
   npm run build
   # or
   yarn build
   ```

2. Deploy the `build` directory to your hosting provider

### Backend Deployment
The backend can be deployed to Heroku, DigitalOcean, AWS, or any other Node.js hosting service.

## Contributing

We welcome contributions to FUT4E! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows our coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Project Link: [https://github.com/yourusername/fut4e-frontend](https://github.com/yourusername/fut4e-frontend)

## Acknowledgments

- All contributors who have participated in this project
- Football video content creators
- Open source community for the amazing tools used in this project
