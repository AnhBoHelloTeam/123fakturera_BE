Terms Application
This is a full-stack application for displaying Terms of Service with language switching (English/Swedish), built as part of a Statement of Work (SOW).
Tech Stack

Frontend: 
React.js (18.3.1)
Vite.js (5.4.8)
Axios (1.7.7)
Vanilla CSS


Backend: 
Fastify (4.28.1)
Sequelize (6.37.3)
PostgreSQL (via Supabase, pg 8.12.0, pg-hstore 2.3.4)
Node.js (20.17.0)
Dotenv (16.4.5)


Database: Supabase (PostgreSQL)
Language: JavaScript (ES Modules)

Setup Instructions
Prerequisites

Node.js (20.x or higher)
Git
Supabase account (https://supabase.com)

Supabase Setup

Create a new project in Supabase (https://supabase.com/dashboard).
In SQL Editor, run the init.sql script to create the terms table and seed data.
Copy the Connection String (URI) from Settings > Database (Session Mode).

Backend Setup

Navigate to the backend directory:cd backend


Install dependencies:npm install


Create a .env file in backend:DATABASE_URL=postgres://postgres.[project_ref]:[your_password]@aws-0-[region].pooler.supabase.com:5432/postgres
PORT=3001


Start the backend:npm run dev



Frontend Setup

Navigate to the frontend directory:cd frontend


Install dependencies:npm install


Create a .env file in frontend:VITE_API_URL=http://localhost:3001


Start the frontend:npm run dev



API Endpoints

GET /api/terms?language={en|sv}
Description: Fetch terms content for the specified language.
Query Parameters:
language: "en" (English) or "sv" (Swedish)


Example Request:curl http://localhost:3001/api/terms?language=en


Example Response:{
  "content": "<h1>Terms of Service</h1><p>Welcome to our service!...</p>"
}


Error Responses:
400: Invalid language
404: Terms not found
500: Internal server error





Running the Application

Start the backend (npm run dev in backend).
Start the frontend (npm run dev in frontend).
Open http://localhost:3000 in your browser.
Use the flag icons to switch between English and Swedish content.
Click the hamburger menu to toggle the navigation.

Deployment

Deploy on Render (https://render.com):
Backend: Create a Web Service, set DATABASE_URL and PORT.
Frontend: Create a Static Site, set VITE_API_URL to the backend URL.


Use Supabase for the PostgreSQL database.

Notes

The application is responsive for mobile (portrait/landscape), tablet, and desktop.
The hamburger menu and language switcher are fully functional.
Content is dynamically loaded from Supabase.
