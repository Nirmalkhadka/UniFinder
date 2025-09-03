# UNIFINDER

## Description
UNIFINDER is a web-based application designed to assist Nepalese students in finding suitable universities abroad based on academic profiles, budgets, and preferences. It reduces reliance on education consultancies by providing personalized recommendations, cost estimations, and peer support through virtual consultations. Built using the MERN stack, it incorporates AI models (XGBoost for international students, R²=0.93, RMSE=0.23; Gradient Boosting for Nepalese students, R²=0.86, RMSE=0.27), web scraping for dynamic data, and Zoom API integration.

## Features
- User registration and login for students and consultants with email verification.
- AI-driven university matching based on GPA, IELTS/TOEFL scores, country, program, and level.
- Real-time tuition and living cost estimation via web scraping.
- Peer-to-peer virtual consultations using Zoom scheduling and webhooks.
- Admin dashboard for managing users and viewing meeting logs.
- Secure authentication with JWT and bcrypt.
- Responsive UI with Bootstrap and SCSS.

## Technologies Used
### Frontend
- React.js: Component-based UI.
- React Router DOM: Dynamic routing.
- Axios: API requests.
- Bootstrap 5: Responsive layouts.
- SCSS: Modular styling.
- React Toastify: Notifications.
- React Dropzone: File uploads.

### Backend
- Node.js: Server runtime.
- Express.js: API framework.
- Mongoose: MongoDB ODM.
- JWT: Authentication.
- Bcrypt: Password hashing.
- Multer: File handling.
- Nodemailer: Email sending.
- Node-fetch: HTTP requests.

### Database
- MongoDB Atlas: Cloud-hosted NoSQL database.

### AI/ML
- Python with Flask: Model hosting.
- XGBoost and Gradient Boosting: Recommendation engines.
- Pandas, Scikit-learn: Data processing and evaluation.
- Joblib: Model saving.

### Other Tools
- Puppeteer.js & Cheerio.js: Web scraping.
- Zoom API & Ngrok: Virtual meetings.
- Visual Studio Code, Git, GitHub: Development.
- Postman: API testing.
- StarUML: Diagrams.

## Installation
1. Clone repository: `git clone <repo-url>`.
2. Install frontend dependencies: `cd frontend && npm install`.
3. Install backend dependencies: `cd ../backend && npm install`.
4. Set environment variables in `.env` (e.g., MongoDB URI, JWT secret, Zoom API keys).
5. Run backend: `npm start`.
6. Run frontend: `npm start`.
7. For AI models: Install Python dependencies (pandas, scikit-learn, xgboost), run Flask server.

## Usage
- Register as student/consultant and verify email.
- Students: Input profile for university recommendations and schedule consultations.
- Consultants: Manage requests and join meetings.
- Admin: View/delete users and logs.

## Future Work
- Mobile app development.
- Multi-language and multi-country support.
- Secure payment gateway.
- Expand AI with real-time updates and more fields (Law, Arts, Commerce).
