
Project: Visual Product Matcher
Overview
The Visual Product Matcher is a web application designed to help users find visually similar products by uploading an image. The application fulfills the technical assessment project requirements for the Software Engineer position at Unthinkable Solutions.


The application is built using the 

MERN stack (MongoDB, Express, React, Node.js) and integrates a Python-based service to leverage the CLIP (Contrastive Language-Image Pre-Training) model from OpenAI for image-text matching. This approach allows the system to identify products that are visually similar to the uploaded image.

Required Features

Image Upload: The application supports both file upload and image URL input.


Search Interface: Users can view the uploaded image and a list of similar products. The results can be filtered by a similarity score.



Product Database: The system includes a minimum of 50 products, each with an image and basic metadata such as name and category.


Hosting: The application is deployed live on a free hosting service.


Mobile Responsiveness: The design is mobile-responsive to ensure a consistent user experience across devices.

Technical Details

Code Quality: The code is clean and production-quality with basic error handling and loading states for an improved user experience.


Documentation: This README provides simple documentation explaining the project's approach.


Technical Freedom: The project was developed with a flexible tech stack and uses a free-tier AI/ML service, as permitted by the assignment. Test data was collected from public sources.


Deliverables
This repository contains the source code and README file for the project. A brief write-up of the approach (under 200 words) is also included. The working application can be found at the provided URL.


Technologies Used
Frontend

React.js: For building the user interface.

Axios: For making API requests.

CSS (or SCSS): For styling.

Backend

Node.js & Express.js: For the backend server.

Multer: Middleware for handling file uploads.

CORS: To enable cross-origin resource sharing.

Python: To run the CLIP model.

Google Cloud Storage: For storing uploaded images.

Child Process: For running Python scripts from Node.js.

Machine Learning

CLIP: A deep learning model for zero-shot image recognition and image-text matching.

How to Run the Application
1. Clone the repository

Bash

git clone <repository_url>
cd <repository_name>
2. Backend Setup
Navigate to the /backend directory.

Bash

cd backend
Install Python dependencies in a virtual environment.

Bash

python3 -m venv venv
source venv/bin/activate
pip install torch torchvision ftfy regex tqdm
pip install git+https://github.com/openai/CLIP.git
Install Node.js dependencies and run the server.

Bash

npm install
node server.js
The backend server will run on http://localhost:5000.

3. Frontend Setup
Open a new terminal and navigate to the /frontend directory.

Bash

cd frontend
Install dependencies and start the React development server.

Bash

npm install
npm run dev
The application will be available at http://localhost:5173.
