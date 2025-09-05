Backend for 123fakturera Mini App
This document provides instructions for setting up and running the backend for the 123fakturera mini app, which includes two main components:

Terms Page: A replica of https://online.123fakturera.se/terms/, pulling English and Swedish text from a PostgreSQL database.
Price List Page: A simple price list displaying 20 product entries, with editable fields saved to the database, pulled from a PostgreSQL database.

The backend is built using Fastify as the server framework and Sequelize as the ORM, with PostgreSQL as the database, hosted on Supabase.
Table of Contents

Tech Stack
Prerequisites
Project Structure
Setup Instructions
Clone the Repository
Install Dependencies
Environment Variables
Database Setup on Supabase
Running the Backend


API Endpoints
Database Schema
Sample Data
Notes

Tech Stack

Node.js: v18.16.0
Fastify: v4.26.0
Sequelize: v6.37.1
PostgreSQL: v15 (via Supabase)
jsonwebtoken: v9.0.2 (for authentication)
bcrypt: v5.1.1 (for password hashing)
dotenv: v16.4.5 (for environment variables)
JavaScript: ES2020 (modern JavaScript syntax)

Prerequisites

Node.js: Ensure Node.js (v18.16.0 or compatible) is installed. Verify with:node --version


Supabase Account: Create a free account at Supabase to host the PostgreSQL database.
Git: For cloning the repository.
Text Editor: VS Code or any editor for editing code.
Postman (optional): For testing API endpoints.

Project Structure
backend/
├── config/
│   └── db.js               # Sequelize configuration and database connection
├── models/
│   ├── user.js             # User model for authentication
│   ├── term.js             # Term model for Terms page texts
│   ├── product.js          # Product model for Price List page
├── routes/
│   ├── auth.js             # Authentication routes (login/register)
│   ├── terms.js            # Routes for fetching Terms page texts
│   ├── products.js         # Routes for Price List CRUD operations
├── .env                    # Environment variables (not committed)
├── .gitignore              # Git ignore file
├── index.js                # Main Fastify server entry point
├── package.json            # Project dependencies and scripts
└── README.md               # This file

Setup Instructions
Clone the Repository
Clone the project from GitLab (replace <repository-url> with the actual URL):
git clone <repository-url>
cd backend

Install Dependencies
Install the required Node.js packages:
npm install

Environment Variables
Create a .env file in the backend/ directory with the following content:
DATABASE_URL=postgresql://postgres:[YOUR_SUPABASE_PASSWORD]@[YOUR_SUPABASE_HOST]:6543/postgres
JWT_SECRET=your_jwt_secret_key
PORT=3001


Replace [YOUR_SUPABASE_PASSWORD] and [YOUR_SUPABASE_HOST] with your Supabase database credentials (found in Supabase Dashboard > Settings > Database).
Replace your_jwt_secret_key with a secure random string for JWT signing.

Database Setup on Supabase

Log in to your Supabase account and create a new project.
Navigate to SQL Editor in the Supabase Dashboard.
Run the following SQL commands to create the necessary tables:

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  companyName VARCHAR(255) NOT NULL,
  contactPerson VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  postNumber VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  mobile VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  isVerified BOOLEAN DEFAULT FALSE,
  verificationToken VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create terms table for Terms page texts
CREATE TABLE IF NOT EXISTS terms (
  id SERIAL PRIMARY KEY,
  language VARCHAR(2) NOT NULL, -- 'en' or 'sv'
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create products table for Price List
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  userId INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  article_no VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  in_price DECIMAL(10, 2),
  price DECIMAL(10, 2) NOT NULL,
  unit VARCHAR(255),
  in_stock INTEGER,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);


Verify the tables in Table Editor:
users: For user authentication.
terms: Stores English and Swedish texts for the Terms page.
products: Stores product data for the Price List page.



Running the Backend
Start the Fastify server:
npm start

The server will run on http://localhost:3001 (or the port specified in .env).
API Endpoints

POST /api/auth/register: Register a new user.
Body: { companyName, contactPerson, address, postNumber, city, mobile, email, password }
Response: { token }


POST /api/auth/login: Login a user.
Body: { email, password }
Response: { token }


GET /api/terms/:language: Fetch Terms page content for the specified language (en or sv).
Headers: { Authorization: Bearer <token> }
Response: { id, language, title, content }


GET /api/products: Fetch all products for the authenticated user.
Headers: { Authorization: Bearer <token> }
Response: [{ id, article_no, name, in_price, price, unit, in_stock, description }, ...]


PUT /api/products/:id: Update a product’s fields.
Headers: { Authorization: Bearer <token> }
Body: { article_no, name, in_price, price, unit, in_stock, description }
Response: { message: "Product updated successfully" }



Database Schema

users: Stores user information for authentication.
id: Primary key, auto-incremented.
companyName, contactPerson, address, postNumber, city, mobile, email, password: User details.
isVerified, verificationToken: For email verification (not implemented in SOW).
created_at: Timestamp of user creation.


terms: Stores text content for the Terms page.
id: Primary key, auto-incremented.
language: en (English) or sv (Swedish).
title: Title of the Terms section.
content: Full text content in markdown or plain text.
created_at: Timestamp of creation.


products: Stores product data for the Price List.
id: Primary key, auto-incremented.
userId: Foreign key referencing users(id), with ON DELETE CASCADE.
article_no: Unique article number.
name: Product name.
in_price: Purchase price (optional).
price: Selling price (required).
unit: Unit of measure (optional).
in_stock: Stock quantity (optional).
description: Product description (optional).
created_at: Timestamp of creation.



Sample Data
To populate the database with sample data for testing, run the following SQL in Supabase SQL Editor:
-- Insert sample user
INSERT INTO users (companyName, contactPerson, address, postNumber, city, mobile, email, password, isVerified, created_at)
VALUES ('Storford AS', 'John Andre', '123 Main St', '12345', 'Oslo', '123456789', 'john@storford.no', '$2b$10$YOUR_HASHED_PASSWORD', TRUE, NOW());

-- Insert sample Terms content
INSERT INTO terms (language, title, content, created_at)
VALUES 
  ('en', 'Terms and Conditions', 'This is the English version of the Terms and Conditions content...', NOW()),
  ('sv', 'Villkor', 'Detta är den svenska versionen av villkoren...', NOW());

-- Insert 20 sample products
INSERT INTO products (userId, article_no, name, in_price, price, unit, in_stock, description, created_at)
VALUES
  (1, 'ART-001', 'Laptop', 500.00, 700.00, 'pcs', 10, 'High-performance laptop', NOW()),
  (1, 'ART-002', 'Mouse', 10.00, 20.00, 'pcs', 50, 'Wireless optical mouse', NOW()),
  (1, 'ART-003', 'Keyboard', 30.00, 50.00, 'pcs', 30, 'Mechanical keyboard', NOW()),
  (1, 'ART-004', 'Monitor', 150.00, 200.00, 'pcs', 15, '24-inch LED monitor', NOW()),
  (1, 'ART-005', 'USB Cable', 5.00, 10.00, 'pcs', 100, 'USB-C charging cable', NOW()),
  (1, 'ART-006', 'Headphones', 40.00, 60.00, 'pcs', 25, 'Noise-canceling headphones', NOW()),
  (1, 'ART-007', 'Webcam', 25.00, 40.00, 'pcs', 20, '1080p webcam', NOW()),
  (1, 'ART-008', 'Printer', 80.00, 120.00, 'pcs', 10, 'Inkjet printer', NOW()),
  (1, 'ART-009', 'Router', 50.00, 80.00, 'pcs', 12, 'Wi-Fi 6 router', NOW()),
  (1, 'ART-010', 'External HDD', 60.00, 90.00, 'pcs', 8, '1TB external hard drive', NOW()),
  (1, 'ART-011', 'Mouse Pad', 5.00, 15.00, 'pcs', 40, 'Ergonomic mouse pad', NOW()),
  (1, 'ART-012', 'Speaker', 30.00, 50.00, 'pcs', 15, 'Bluetooth speaker', NOW()),
  (1, 'ART-013', 'SSD', 70.00, 100.00, 'pcs', 10, '500GB SSD', NOW()),
  (1, 'ART-014', 'Laptop Stand', 20.00, 35.00, 'pcs', 20, 'Adjustable laptop stand', NOW()),
  (1, 'ART-015', 'Power Bank', 15.00, 25.00, 'pcs', 30, '10000mAh power bank', NOW()),
  (1, 'ART-016', 'HDMI Cable', 8.00, 15.00, 'pcs', 50, '4K HDMI cable', NOW()),
  (1, 'ART-017', 'Desk Lamp', 25.00, 40.00, 'pcs', 15, 'LED desk lamp', NOW()),
  (1, 'ART-018', 'Cooling Pad', 20.00, 30.00, 'pcs', 18, 'Laptop cooling pad', NOW()),
  (1, 'ART-019', 'Adapter', 10.00, 20.00, 'pcs', 25, 'USB-C to HDMI adapter', NOW()),
  (1, 'ART-020', 'Smartphone', 300.00, 500.00, 'pcs', 5, 'Latest model smartphone', NOW());

Note: Replace $2b$10$YOUR_HASHED_PASSWORD with a hashed password generated using bcrypt. Example in Node.js:
const bcrypt = require('bcrypt');
const saltRounds = 10;
const password = 'your_password';
bcrypt.hash(password, saltRounds, (err, hash) => {
  console.log(hash); // Use this hash in the SQL
});

Notes

Authentication: The backend requires a valid JWT token for all /api/terms and /api/products endpoints. Register or login to obtain a token.
Supabase: Ensure the DATABASE_URL in .env is correct. Test the connection using:node -e "require('./config/db').authenticate().then(() => console.log('DB Connected')).catch(err => console.error('DB Error:', err))"


CORS: Fastify is configured to allow CORS for the frontend (update index.js with your frontend URL if hosted).
Editable Fields: The Price List page allows editing fields directly in the table, with changes saved to the database via the PUT /api/products/:id endpoint.
Deployment: The backend is deployed on a free provider (e.g., Render, Heroku, or Railway). Update the frontend to use the deployed backend URL.
GitLab: The source code is available at <repository-url> (replace with actual GitLab URL).
Scrolling: The Price List supports scrolling for 20+ products, tested on all resolutions (desktop, tablet, mobile portrait, and landscape).
Language Support: Terms page texts are fetched based on the language parameter (en or sv).

For issues or questions, contact the developer at <your-email>.