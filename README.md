# Movie App Frontend

This is the frontend for the Movie App project. It allows users to browse, search, and view details about movies. Authenticated users can sign up, sign in, and create a personalized collection of "Loved Movies".

## Features

- Browse trending and new release movies
- Search for movies
- View detailed information about each movie
- User authentication (Sign Up, Sign In)
- Add/remove movies to/from your "Loved Movies" collection

## Tech Stack

- React (with Vite)
- Axios for API requests
- Context API for user state management

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd /frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add your TMDB API key and backend API URL

Create a `.env` file in the `frontend` folder with the following content:

```
VITE_API_URL=http://localhost:5000/api
VITE_TMDB_API_KEY=<your-tmdb-api-key>
```

- Replace `<your-tmdb-api-key>` with your TMDB API key (get it from https://www.themoviedb.org/).
- If your backend runs on a different URL/port, update `VITE_API_URL` accordingly.

### 4. Start the frontend

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.
