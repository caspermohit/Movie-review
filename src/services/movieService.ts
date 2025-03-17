import axios from 'axios';
import { MovieResponse, MovieDetails } from '../types/movie';

// Type definitions
interface JikanAnimeResponse {
  data: {
    mal_id: number;
    title: string;
    synopsis: string;
    images: {
      jpg: {
        image_url: string;
        large_image_url: string;
      };
    };
    score: number;
    aired: {
      from: string;
    };
    genres: Array<{
      mal_id: number;
      name: string;
    }>;
    duration: string;
    status: string;
    trailer: {
      youtube_id: string;
    };
  };
}

interface TMDBDetailsResponse {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  genres: Array<{ id: number; name: string }>;
  runtime?: number;
  episode_run_time?: number[];
  status: string;
}

interface TMDBVideosResponse {
  results: Array<{
    key: string;
    site: string;
    type: string;
    name: string;
  }>;
}

interface TMDBCreditsResponse {
  cast: Array<{
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
  }>;
  crew: Array<{
    id: number;
    name: string;
    job: string;
  }>;
}

interface TMDBSimilarResponse {
  results: Array<{
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    vote_average: number;
    release_date: string;
  }>;
}

// Load environment variables
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.themoviedb.org/3';
const JIKAN_API_BASE_URL = 'https://api.jikan.moe/v4';
const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL;
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Validate environment variables
if (!TMDB_API_KEY) {
  console.error('Missing TMDB API key. Please check your environment variables.');
}

if (!TMDB_API_BASE_URL) {
  console.error('Missing TMDB API base URL. Using default: https://api.themoviedb.org/3');
}

if (!BACKEND_API_URL) {
  console.error('Missing backend API URL. Some features may not work correctly.');
}

// Configure axios defaults for the backend
const backendApi = axios.create({
  baseURL: BACKEND_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to include auth token
backendApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
backendApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Error handling helper
const handleError = (error: unknown): never => {
  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    const axiosError = error as any;
    console.error('API Error:', {
      status: axiosError.response?.status,
      statusText: axiosError.response?.statusText,
      data: axiosError.response?.data,
      url: axiosError.config?.url
    });
    
    if (axiosError.response?.status === 401) {
      throw new Error('Please login to continue');
    }
    
    const errorMessage = 
      (axiosError.response?.data as any)?.message || 
      axiosError.message || 
      'An unexpected error occurred';
    throw new Error(errorMessage);
  }
  
  console.error('Non-Axios Error:', error);
  throw new Error('An unexpected error occurred');
};

// Movies
export const fetchPopularMovies = async (page: number = 1): Promise<MovieResponse> => {
  const response = await axios.get<MovieResponse>(
    `${TMDB_API_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`
  );
  return response.data;
};

export const fetchTopRatedMovies = async (page: number = 1): Promise<MovieResponse> => {
  const response = await axios.get<MovieResponse>(
    `${TMDB_API_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&page=${page}`
  );
  return response.data;
};

export const fetchUpcomingMovies = async (page: number = 1): Promise<MovieResponse> => {
  const response = await axios.get<MovieResponse>(
    `${TMDB_API_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&page=${page}`
  );
  return response.data;
};

export const fetchLatestMovies = async (page: number = 1): Promise<MovieResponse> => {
  const response = await axios.get<MovieResponse>(
    `${TMDB_API_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&page=${page}`
  );
  return response.data;
};

export const searchMovies = async (query: string, page: number = 1): Promise<MovieResponse> => {
  const response = await axios.get<MovieResponse>(
    `${TMDB_API_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
  );
  return response.data;
};

// TV Shows
export const fetchPopularTVShows = async (page: number = 1): Promise<MovieResponse> => {
  const response = await axios.get<MovieResponse>(
    `${TMDB_API_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&page=${page}`
  );
  return response.data;
};

export const fetchTopRatedTVShows = async (page: number = 1): Promise<MovieResponse> => {
  const response = await axios.get<MovieResponse>(
    `${TMDB_API_BASE_URL}/tv/top_rated?api_key=${TMDB_API_KEY}&page=${page}`
  );
  return response.data;
};


export const fetchUpcomingTVShows = async (page: number = 1): Promise<MovieResponse> => {
  const response = await axios.get<MovieResponse>(
    `${TMDB_API_BASE_URL}/tv/on_the_air?api_key=${TMDB_API_KEY}&page=${page}`
  );
  return response.data;
};

export const fetchAiringTodayTVShows = async (page: number = 1): Promise<MovieResponse> => {
  const response = await axios.get<MovieResponse>(
    `${TMDB_API_BASE_URL}/tv/airing_today?api_key=${TMDB_API_KEY}&page=${page}`
  );
  return response.data;
};

export const fetchLatestTVShows = async (page: number = 1): Promise<MovieResponse> => {
  const response = await axios.get<MovieResponse>(
    `${TMDB_API_BASE_URL}/tv/now_playing?api_key=${TMDB_API_KEY}&page=${page}`
  );
  return response.data;
};

export const searchTVShows = async (query: string, page: number = 1): Promise<MovieResponse> => {
  const response = await axios.get<MovieResponse>(
    `${TMDB_API_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
  );
  return response.data;
};

// Anime
export const fetchPopularAnime = async (page: number = 1): Promise<MovieResponse> => {
  const response = await axios.get(`${JIKAN_API_BASE_URL}/top/anime?page=${page}&filter=bypopularity`);
  return transformJikanResponse(response.data);
};

export const fetchTopRatedAnime = async (page: number = 1): Promise<MovieResponse> => {
  const response = await axios.get(`${JIKAN_API_BASE_URL}/top/anime?page=${page}`);
  return transformJikanResponse(response.data);
};

export const fetchSeasonalAnime = async (page: number = 1): Promise<MovieResponse> => {
  const response = await axios.get(`${JIKAN_API_BASE_URL}/seasons/now?page=${page}`);
  return transformJikanResponse(response.data);
};

export const fetchAnimeMovies = async (page: number = 1): Promise<MovieResponse> => {
  const response = await axios.get(`${JIKAN_API_BASE_URL}/anime?page=${page}&type=movie&order_by=popularity`);
  return transformJikanResponse(response.data);
};

export const fetchLatestAnime = async (page: number = 1): Promise<MovieResponse> => {
  const response = await axios.get(`${JIKAN_API_BASE_URL}/anime?page=${page}&type=movie&order_by=popularity`);
  return transformJikanResponse(response.data);
};

export const searchAnime = async (query: string, page: number = 1): Promise<MovieResponse> => {
  const response = await axios.get(
    `${JIKAN_API_BASE_URL}/anime?page=${page}&q=${encodeURIComponent(query)}&order_by=popularity`
  );

  return transformJikanResponse(response.data);
};

// Helper function to transform Jikan API response to match TMDB format
const transformJikanResponse = (jikanData: any): MovieResponse => {
  const results = jikanData.data.map((anime: any) => ({
    id: anime.mal_id,
    title: anime.title,
    overview: anime.synopsis,
    poster_path: anime.images.jpg.image_url,
    release_date: anime.aired?.from,
    vote_average: anime.score,
    media_type: 'anime',
  }));

  return {
    page: jikanData.pagination.current_page,
    results,
    total_pages: Math.ceil(jikanData.pagination.items.total / jikanData.pagination.items.per_page),
    total_results: jikanData.pagination.items.total,
  };
};

// Reviews
export interface ReviewResponse {
  _id: string;
  userId: string;
  movieId: number;
  contentType: string;
  rating: number;
  comment: string;
  movieDetails: {
    title: string;
    overview: string;
    posterPath: string;
  };
  createdAt: string;
}

export const addReview = async (
  movieId: number,
  contentType: string,
  rating: number,
  comment: string,
  movieDetails: { title: string; overview: string; posterPath: string }
): Promise<ReviewResponse> => {
  try {
    const response = await backendApi.post<ReviewResponse>('/reviews', {
      movieId,
      contentType,
      rating,
      comment,
      movieDetails
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getReviews = async (type: string, movieId: number): Promise<ReviewResponse[]> => {
  try {
    const response = await backendApi.get<ReviewResponse[]>(`/reviews/${type}/${movieId}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Wishlist
export interface WishlistResponse {
  _id: string;
  userId: string;
  movieId: number;
  contentType: string;
  movieDetails: {
    title: string;
    overview: string;
    posterPath: string;
  };
  addedAt: string;
}

export const addToWishlist = async (
  movieId: number,
  contentType: string,
  movieDetails: { title: string; overview: string; posterPath: string }
): Promise<WishlistResponse> => {
  try {
    const response = await backendApi.post<WishlistResponse>('/wishlist', {
      movieId,
      contentType,
      movieDetails
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const removeFromWishlist = async (movieId: number, contentType: string): Promise<void> => {
  try {
    await backendApi.delete(`/wishlist/${contentType}/${movieId}`);
  } catch (error) {
    return handleError(error);
  }
};

export const getWishlist = async (): Promise<WishlistResponse[]> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await backendApi.get<WishlistResponse[]>('/wishlist');
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Movie Details
export const fetchMovieDetails = async (id: number, type: 'movie' | 'tv' | 'anime'): Promise<MovieDetails> => {
  console.log('Fetching details for:', { id, type });

  if (type === 'anime') {
    try {
      console.log('Fetching anime details from:', `${JIKAN_API_BASE_URL}/anime/${id}/full`);
      const response = await axios.get<JikanAnimeResponse>(`${JIKAN_API_BASE_URL}/anime/${id}/full`);
      console.log('Anime API response:', response.data);
      
      const animeData = response.data;
      
      if (!animeData || !animeData.data) {
        throw new Error('Invalid anime data received');
      }

      const data = animeData.data;
      const reviews = await getReviews(type, id);

      return {
        id: data.mal_id,
        title: data.title,
        overview: data.synopsis,
        poster_path: data.images?.jpg?.large_image_url || '',
        backdrop_path: data.images?.jpg?.large_image_url || '',
        vote_average: data.score || 0,
        release_date: data.aired?.from || '',
        genres: data.genres?.map((g) => ({ id: g.mal_id, name: g.name })) || [],
        runtime: data.duration || 'Unknown',
        status: data.status || 'Unknown',
        videos: data.trailer?.youtube_id ? [{
          key: data.trailer.youtube_id,
          name: 'Trailer',
          site: 'YouTube',
          type: 'Trailer'
        }] : [],
        recommendations: [],
        cast: [],
        reviews: reviews.map(review => ({
          id: review._id,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
          movieDetails: review.movieDetails
        })),
      };
    } catch (error) {
      return handleError(error);
    }
  }

  const endpoints = {
    movie: {
      details: `${TMDB_API_BASE_URL}/movie/${id}`,
      videos: `${TMDB_API_BASE_URL}/movie/${id}/videos`,
      credits: `${TMDB_API_BASE_URL}/movie/${id}/credits`,
      similar: `${TMDB_API_BASE_URL}/movie/${id}/similar`
    },
    tv: {
      details: `${TMDB_API_BASE_URL}/tv/${id}`,
      videos: `${TMDB_API_BASE_URL}/tv/${id}/videos`,
      credits: `${TMDB_API_BASE_URL}/tv/${id}/credits`,
      similar: `${TMDB_API_BASE_URL}/tv/${id}/similar`
    }
  };

  if (!endpoints[type]) {
    throw new Error(`Invalid content type: ${type}`);
  }

  const currentEndpoints = endpoints[type];
  console.log('TMDB endpoints:', currentEndpoints);

  try {
    console.log('Fetching TMDB data with API key:', TMDB_API_KEY);
    const [details, videos, credits, similar] = await Promise.all([
      axios.get<TMDBDetailsResponse>(`${currentEndpoints.details}?api_key=${TMDB_API_KEY}&language=en-US`),
      axios.get<TMDBVideosResponse>(`${currentEndpoints.videos}?api_key=${TMDB_API_KEY}&language=en-US`),
      axios.get<TMDBCreditsResponse>(`${currentEndpoints.credits}?api_key=${TMDB_API_KEY}&language=en-US`),
      axios.get<TMDBSimilarResponse>(`${currentEndpoints.similar}?api_key=${TMDB_API_KEY}&language=en-US&page=1`)
    ]);

    console.log('TMDB API responses:', {
      details: details.data,
      videos: videos.data,
      credits: credits.data,
      similar: similar.data
    });

    const detailsData = details.data;
    const videosData = videos.data;
    const creditsData = credits.data;
    const similarData = similar.data;
    const reviews = await getReviews(type, id);

    // For TV shows, map name to title for consistency
    const title = type === 'tv' ? detailsData.name : detailsData.title;
    const release_date = type === 'tv' ? detailsData.first_air_date : detailsData.release_date;

    const movieDetails: MovieDetails = {
      ...detailsData,
      title: title || '',
      release_date: release_date || '',
      runtime: detailsData.runtime?.toString() || 'Unknown',
      videos: videosData.results,
      cast: creditsData.cast.slice(0, 10),
      recommendations: similarData.results.slice(0, 4),
      reviews: reviews.map(review => ({
        id: review._id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        movieDetails: review.movieDetails
      })),
    };

    // Add full URLs for images if they're relative paths
    if (movieDetails.poster_path && !movieDetails.poster_path.startsWith('http')) {
      movieDetails.poster_path = `${TMDB_IMAGE_BASE_URL}/w500${movieDetails.poster_path}`;
    }
    if (movieDetails.backdrop_path && !movieDetails.backdrop_path.startsWith('http')) {
      movieDetails.backdrop_path = `${TMDB_IMAGE_BASE_URL}/original${movieDetails.backdrop_path}`;
    }

    console.log('Transformed movie details:', movieDetails);
    return movieDetails;
  } catch (error) {
    return handleError(error);
  }
};