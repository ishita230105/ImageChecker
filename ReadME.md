Project Documentation: Visual Product Matcher using CLIP
Overview
The Visual Product Matcher is a web application that allows users to upload an image of a product and receive a list of similar products based on the uploaded image. The backend uses the CLIP (Contrastive Language-Image Pre-Training) model from OpenAI for image-text matching. This project uses the MERN (MongoDB, Express, React, Node.js) stack for the frontend and backend, along with a Python-based service to run the CLIP model for image-to-text predictions.

Key Features:
    - Image upload functionality in the frontend.
    - Backend processing of images using CLIP to find similar products.
    - Display of similar products based on image features.
    - Python-based backend integration for CLIP model.

Table of Contents

    - Technologies Used
    - Project Setup
    - Folder Structure
    - Backend Implementation
    - Frontend Implementation
    - CLIP Integration
    - How to Run
    - Conclusion

Technologies Used

Frontend:

    - React.js: For building the user interface.
    - Axios: For making API requests from React to the backend.
    - CSS (or SCSS): For styling the frontend.

Backend:

    - Node.js: Backend server using Express.js.
    - Express: Web framework for Node.js.
    - Multer: Middleware for handling multipart form data (file uploads).
    - CORS: To enable cross-origin resource sharing between frontend and backend.
    - Python (for CLIP integration): CLIP (Contrastive Language-Image Pre-Training) model by OpenAI for image-text matching.
    - Google Cloud Storage: For storing uploaded images.
    - Child Process: For running Python scripts from Node.js.

Machine Learning:

    - CLIP: A deep learning model trained on image-text pairs for zero-shot image recognition.

Project Setup

1. Backend Setup
   Step 1: Install Python Dependencies
   Inside the /backend folder, create a virtual environment and install required libraries for CLIP and other dependencies:

Comands
python3 -m venv venv
source venv/bin/activate # On Windows use `venv\Scripts\activate`

# Install necessary dependencies

pip install torch torchvision
pip install ftfy regex tqdm
pip install git+https://github.com/openai/CLIP.git

Step 2: Install Node.js Dependencies
In the /backend folder, initialize a Node.js project and install dependencies:

Comands
npm init -y
npm install express multer cors

Step 3: Backend API
/backend/server.js: Node.js server with an Express API for image upload and CLIP processing.
/backend/clip_model.py: Python script to interact with CLIP for image-text similarity predictions. 2. Frontend Setup

2. Frontend Setup

Step 1: Install React.js Dependencies
Inside the /frontend folder, initialize a React app and install Axios:

Comands
npx create-react-app .
npm install axios

Step 2: Frontend API Integration
/frontend/src/App.js: React component that handles the file upload, displays the uploaded image, and shows similar product results.

Folder Structure

Backend Folder Structure (/backend)

/backend
├── /node_modules/ # Installed npm packages
├── /uploads/ # Folder for storing uploaded images
├── /venv/ # Python virtual environment (for CLIP)
├── server.js # Node.js server
├── clip_model.py # Python script to run CLIP
└── package.json # Node.js project configuration

Frontend Folder Structure (/frontend)

/frontend
├── /node_modules/ # Installed npm packages
├── /public/ # Public files like index.html
├── /src/ # React source code
├── App.js # Main React component
├── App.css # Styling for the app
└── index.js # Entry point of React app
├── package.json # React project configuration

Backend Implementation

1. Server Setup (server.js)
   The backend is built using Node.js and Express. It handles file uploads using multer and then uses Python's child_process to call the CLIP Python script for image processing.

Key features:

- File upload endpoint: Receives the image and stores it in the /uploads folder.
- CLIP API endpoint: Runs the CLIP model via Python, processes the image, and returns the predictions.

2. CLIP Integration (clip_model.py)
   CLIP is used to compare the uploaded image to predefined text snippets (such as "a dog", "a smartphone", etc.). The Python script processes the image using the CLIP model and returns the most similar text descriptions.

Frontend Implementation
The frontend is built using React.js and Axios. It allows users to upload an image, displays the uploaded image, and shows the predicted similar products from the CLIP model.

Key features:

Image Upload: Users can upload an image using the <input type="file" /> element.
Product Prediction Display: Displays the uploaded image and a list of the most similar products based on CLIP's image-to-text matching.
CLIP Integration
The CLIP model is used to compute similarity scores between the uploaded image and a list of predefined text labels. The model is loaded and used to extract features from both the image and the text, and then calculates the cosine similarity between the features.

Key steps:

    1. Load the CLIP model and preprocess the uploaded image.
    2. Tokenize predefined text descriptions.
    3. Calculate image and text features using the CLIP model.
    4. Compute similarity scores between the image and each text description.
    5. Return the top matching text labels along with their similarity scores.

How to Run

1. Start the Backend
   Ensure that Python dependencies are installed and the Node.js backend is ready.
   Run the server:

cd backend
node server.js
The backend server will start on http://localhost:5000.

2. Start the Frontend
   Install the required frontend dependencies and start the React development server:

cd frontend
npm install
npm start
The React app will be available at http://localhost:3000.

3. Using the Application
   1. Navigate to the React app in the browser.
   2. Upload an image using the file input.
   3. The image will be uploaded to the backend, and the CLIP model will return a list of similar products based on the image.
   4. The frontend will display the image and the predicted similar products with their similarity scores.

Conclusion

The Visual Product Matcher application allows users to upload an image and get similar product recommendations based on CLIP's zero-shot image-to-text model. The backend leverages Node.js and Python to handle image uploads and CLIP processing, while the frontend is built with React.js to display the results. This project demonstrates the potential of CLIP in real-world applications, such as visual product matching and recommendation systems.