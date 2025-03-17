export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path?: string;
  vote_average: number;
  release_date: string;
  media_type?: string;
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface Video {
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  movieDetails: {
    title: string;
    overview: string;
    posterPath: string;
  };
}

export interface MovieDetails extends Omit<Movie, 'title' | 'release_date'> {
  title: string;
  name?: string;
  release_date: string;
  first_air_date?: string;
  genres: { id: number; name: string; }[];
  runtime: number | string;
  status: string;
  videos: Video[];
  cast: CastMember[];
  recommendations: Movie[];
  reviews: Review[];
  tagline?: string;
  budget?: number;
  revenue?: number;
  original_language?: string;
  original_title?: string;
  production_companies?: Array<{
    id: number;
    name: string;
    logo_path?: string | null;
    origin_country: string;
  }>;
  production_countries?: Array<{
    iso_3166_1: string;
    name: string;
  }>;
  spoken_languages?: Array<{
    english_name: string;
    iso_639_1: string;
    name: string;
  }>;
} 