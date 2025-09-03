# UNIFINDER Backend

## Description
Backend for UNIFINDER, a web app aiding Nepalese students in finding study-abroad universities. Built with Node.js and Express.js, it handles API requests, user auth, data management, AI model integration, and Zoom scheduling.

## Features
- User authentication with JWT and bcrypt.
- API endpoints for profile management, recommendations, and consultations.
- MongoDB integration via Mongoose for data storage.
- AI model serving (XGBoost, Gradient Boosting) for university matching.
- Web scraping with Puppeteer.js and Cheerio.js for real-time data.
- Zoom API integration for virtual peer consultations.
- Email notifications with Nodemailer.
- Admin access for user/meeting management.

## Technologies
- Node.js: Runtime environment.
- Express.js: Web framework.
- Mongoose: MongoDB ODM.
- JWT: Authentication.
- Bcrypt: Password hashing.
- Multer: File handling.
- Nodemailer: Email service.
- Puppeteer.js & Cheerio.js: Web scraping.
- Zoom API: Meeting scheduling.
- Python Flask: AI model hosting.

## Installation
1. Clone repository.
2. Navigate to backend directory: `cd backend`.
3. Install dependencies: `npm install`.
4. Set environment variables (e.g., MongoDB URI, JWT secret, Zoom API keys).
5. Run: `npm start`.

## Usage
- Connects to frontend at http://localhost:5000/api.
- Handles POST/GET requests for user data, recommendations, and meetings.
- Integrates with AI models and Zoom API..
