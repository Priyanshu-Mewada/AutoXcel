AutoXcel

AutoXcel is a powerful web application built with Next.js, React, Tailwind CSS, Clerk, MongoDB, and the Gemini API. It allows users to upload and parse Excel files, interact using natural language, and perform smart data filtering, sorting, and dynamic extraction with secure authentication.

Features

Upload and Parse Excel Files: Easily upload Excel files and extract structured data.

Natural Language Interaction: Communicate with AutoXcel using natural language for data insights.

Smart Data Filtering and Sorting: Quickly filter and sort data dynamically based on queries.

Dynamic Extraction: Extract specific information intelligently from uploaded Excel files.

Clerk Authentication & Secure Storage: Secure user authentication with Clerk and data storage using MongoDB.

Technologies Used

Frontend: Next.js, React.js, Tailwind CSS

Backend: Node.js

Database: MongoDB

Authentication: Clerk

APIs: Gemini API

Getting Started

Follow these steps to set up and run AutoXcel on your local machine.

Prerequisites

Make sure you have the following installed on your system:

Node.js (v14 or later)

npm or yarn

MongoDB (local or cloud instance)

Setup Instructions

Clone the Repository:

git clone https://github.com/Priyanshu-Mewada/AutoXcel.git
cd AutoXcel

Install Dependencies:

npm install
# or
yarn install

Configure Environment Variables:
Create a .env.local file in the root directory and add the following:

DATABASE_URL="your_mongodb_connection_string"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
GOOGLE_GENERATIVE_AI_API_KEY="your_google_api_key"
GEMINI_API_URL="your_gemini_api_url"

Run the Development Server:

npm run dev
# or
yarn dev

The app will be available at http://localhost:3000.

Build for Production:

npm run build
npm start

Dependencies

The project relies on the following dependencies:

Next.js: Framework for React apps

React.js: Frontend library

Tailwind CSS: Utility-first CSS framework

Clerk: Authentication service

XLSX: Library for parsing Excel files

Gemini API: Natural language processing

MongoDB: Database

Fork the repository.

Create a new branch:

git checkout -b feature/your-feature-name

Commit your changes:

git commit -m "Add your message here"

Push to your branch:

git push origin feature/your-feature-name


