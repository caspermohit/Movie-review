# Movie Review Application

A modern web application for discovering, reviewing, and managing your favorite movies, TV shows, and anime. Built with React, TypeScript, and Chakra UI.

## Features

- 🎬 Browse popular, top-rated, and latest movies, TV shows, and anime
- 🔍 Search functionality across all content types
- ⭐ User reviews and ratings
- 📝 Personal watchlist management
- 🎨 Modern, responsive UI with dark/light mode
- 🔐 User authentication and authorization
- 📱 Mobile-friendly design

## Technologies Used

- Frontend:
  - React
  - TypeScript
  - Chakra UI
  - Vite
  - Axios

- Backend:
  - Node.js
  - Express
  - MongoDB
  - JWT Authentication

- APIs:
  - TMDB (The Movie Database) API
  - Jikan API (MyAnimeList)

## Prerequisites

Before running this application, make sure you have:

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (for running the backend locally)
- TMDB API key (get it from [TMDB website](https://www.themoviedb.org/documentation/api))

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_API_BASE_URL=https://api.themoviedb.org/3
VITE_MONGODB_URI=your_mongodb_uri
VITE_BACKEND_API_URL=http://localhost:5001/api
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd movie-review
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Start the backend server (in a separate terminal):
```bash
cd backend
npm install
npm run dev
```

## Usage

- Browse movies, TV shows, and anime by selecting the respective tabs
- Use the category buttons (Popular, Top Rated, etc.) to filter content
- Search for specific titles using the search bar
- Click on a title to view detailed information
- Leave reviews and ratings for content you've watched
- Add titles to your watchlist for later viewing

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [TMDB](https://www.themoviedb.org/) for their comprehensive movie and TV show database
- [Jikan API](https://jikan.moe/) for providing anime data from MyAnimeList
- [Chakra UI](https://chakra-ui.com/) for the beautiful and accessible UI components
# Movie-review
