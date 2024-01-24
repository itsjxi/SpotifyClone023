 # Spotify clone  Website 
live demo:  https://hulkappecoomerce.netlify.app/

Welcome to the HulkApps E-commerce Website repository! This project is a React application built with ReactJs, HTML5, CSS, Redux , showcasing a shopping cart functionality using Redux Toolkit.

## Tech Stack

- **React (v18.2.0):** JavaScript library for building user interfaces.
- **Vite (v5.0.8):** A build tool that aims to provide a faster and more efficient development experience.
- **React Axios (v2.0.6):** A lightweight wrapper around Axios for making HTTP requests in React applications.
- **React Icons (v4.12.0):** A popular library for including SVG icons in React projects.

## Project Setup

Follow these guidelines to set up and run the project locally on our machine.


### 1. Install Dependencies and adding required data

#### 1.1 Clone the Repository

git clone https://github.com/itsjxi/SpotifyClone023.git
cd SpotifyClone023
npm create vite@latest
This command installs the required dependencies specified in the package.json file.

#### 1.2 Install Additional Dependencies
npm install axios and  react-icons

### 2  Start the Development Server
npm run dev
This command starts the development server, making the project accessible at http://localhost:5473 in the browser.

### 3 Open in Browser
Open our web browser and navigate to http://localhost:5473 to view the running project.

## 4  Fetching data from APIs
we use spotify developers documention for the data for more click https://developer.spotify.com/
path: documention -> webApi
steps:-
 1) make account and get acess the tocken for the api key
 2) use that key for fetching data using URL endpoints as per the documents
 3) we also put an login page once you login it will fetch your playlist 


## 5. Deploying to Netlify

### 5.1 Create a Netlify Account

Sign up for a Netlify account if you don't have one.

### 5.2 Connect to our GitHub Repository

On the Netlify dashboard, follow these steps:

1. Click "New site from Git."
2. Select our GitHub repository.
3. Configure the build settings.

### 5.3 Deploy Our Site

Netlify automatically triggers a new build and deploys our site.

### 5.4 Access Our Live Site

Once the build is complete, our site will be live at (https://musicappspotify023.netlify.app/).


