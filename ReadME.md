Visual Product Matcher
Overview

The Visual Product Matcher is a full-stack MERN application that helps users discover visually similar products by uploading an image or entering an image URL. This project fulfills the technical assessment requirements for the Software Engineer position at Unthinkable Solutions.

The system allows users to:

Upload an image (file or URL)

View the uploaded image instantly

Get predicted product categories with similarity scores

Browse similar products (fetched from a seeded database of 50+ items)

Filter results dynamically with a similarity slider

The app is deployed on free hosting services and designed to be mobile-responsive for a consistent user experience.

Features

Image Upload: Supports both file upload and image URL input.

Search Interface: Displays the uploaded image, predictions, and matched products.

Filter: Users can refine results using a similarity score slider.

Product Database: Includes 50 seeded products with images (sourced via Unsplash) and metadata (name, description, price, tags).

Hosting: Deployed on free hosting platforms (Frontend: Vercel/Netlify, Backend: Render).

Mobile Responsiveness: Works seamlessly across devices.

Error Handling & Loading States: Enhances UX with clear messages and progress indicators.

Tech Stack
Frontend:

React.js – UI development

Axios – API requests

CSS – Styling and responsiveness

Backend:

Node.js + Express.js – REST API server

Multer – File upload handling

CORS – Cross-origin requests

MongoDB Atlas + Mongoose – Product database

Static File Serving – To display uploaded images

Database (Seeded)

50+ products generated with realistic metadata

Product images from Unsplash (https://source.unsplash.com)

Each product includes:

Name

Description

Price

Tags (category + department)

Image URL

📂 Project Setup
1. Clone Repository
git clone <repository_url>
cd <repository_name>

2. Backend Setup
cd backend
npm install
node server.js


The backend will run on http://localhost:5000.

3. Seed Database
node seeds.js


This will insert 50 products with images and tags into MongoDB.

4. Frontend Setup
cd frontend
npm install
npm run dev


The frontend will run on http://localhost:5173.

Deliverables

Working Application URL (Frontend + Backend live)

GitHub Repository with source code and README

Brief Approach Write-up (200 words) included

Approach (200 words)

The Visual Product Matcher is a MERN-based application designed to simulate a real-world product discovery system. Users can upload an image or paste an image URL, and the system returns predicted categories along with a curated list of similar products.

The backend uses Express.js and Multer for handling image uploads, while MongoDB serves as the product database. A seeding script generates 50 products with realistic metadata and images from Unsplash, ensuring that the database always has rich sample data. Each product is tagged with categories and departments for effective matching.

On the frontend, React.js provides a responsive and interactive user experience. Predictions are displayed with confidence scores, and users can refine their search using a similarity slider. The uploaded image and matched products are rendered dynamically for instant feedback.

The system includes error handling (e.g., missing file/URL) and loading states for a smoother user experience. Both frontend and backend are deployed on free hosting platforms (Vercel/Netlify + Render).

This project meets all assignment requirements: image upload, 50+ products, search interface, filtering, responsive design, error handling, clean code, and documentation.
