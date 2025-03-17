import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Input,
  Box,
  Button,
  ButtonGroup,
  useColorModeValue,
  SimpleGrid,
  Text,
  Link,
  Flex,
  Skeleton,
} from '@chakra-ui/react';
import MovieCard from '../components/MovieCard';
import { MovieResponse, Movie } from '../types/movie';
import * as movieService from '../services/movieService';

type ContentType = 'movies' | 'tv' | 'anime';
type Category = 'popular' | 'top_rated' | 'upcoming' | 'airing_today' | 'seasonal' | 'movies'| 'latest';

const HomePage = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<MovieResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<ContentType>('movies');
  const [activeCategory, setActiveCategory] = useState<Category>('popular');
  const [latestMovies, setLatestMovies] = useState<MovieResponse | null>(null);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const footerBg = useColorModeValue('white', 'gray.800');
  const footerText = useColorModeValue('gray.600', 'gray.400');

  const handleMovieClick = (movie: Movie) => {
    navigate(`/${activeSection}/${movie.id}`);
  };

  const getCategoryButtons = () => {
    switch (activeSection) {
      case 'movies':
        return [
          { category: 'popular', label: 'Popular' },
          { category: 'top_rated', label: 'Top Rated' },
          { category: 'upcoming', label: 'Upcoming' },
          { category: 'latest', label: 'Latest' },
        ];
      case 'tv':
        return [
          { category: 'popular', label: 'Popular' },
          { category: 'top_rated', label: 'Top Rated' },
          { category: 'upcoming', label: 'On The Air' },
          { category: 'airing_today', label: 'Airing Today' },
          { category: 'latest', label: 'Latest' },
        ];
      case 'anime':
        return [
          { category: 'popular', label: 'Popular' },
          { category: 'top_rated', label: 'Top Rated' },
          { category: 'seasonal', label: 'Seasonal' },
          { category: 'movies', label: 'Movies' },
          { category: 'latest', label: 'Latest' },
        ];
      default:
        return [];
    }
  };

  const fetchContent = async (section: ContentType, category: Category, searchTerm: string = '', pageNum: number = 1) => {
    setIsLoading(true);
    try {
      let response: MovieResponse | undefined;
      
      if (searchTerm) {
        switch (section) {
          case 'movies':
            response = await movieService.searchMovies(searchTerm, pageNum);
            break;
          case 'tv':
            response = await movieService.searchTVShows(searchTerm, pageNum);
            break;
          case 'anime':
            response = await movieService.searchAnime(searchTerm, pageNum);
            break;
        }
      } else {
        switch (section) {
          case 'movies':
            switch (category) {
              case 'popular':
                response = await movieService.fetchPopularMovies(pageNum);
                break;
              case 'top_rated':
                response = await movieService.fetchTopRatedMovies(pageNum);
                break;
              case 'upcoming':
                response = await movieService.fetchUpcomingMovies(pageNum);
                break;
              case 'latest':
                response = await movieService.fetchLatestMovies(pageNum);
                break;
            }
            break;
          case 'tv':
            switch (category) {
              case 'popular':
                response = await movieService.fetchPopularTVShows(pageNum);
                break;
              case 'top_rated':
                response = await movieService.fetchTopRatedTVShows(pageNum);
                break;
              case 'upcoming':
                response = await movieService.fetchUpcomingTVShows(pageNum);
                break;
              case 'airing_today':
                response = await movieService.fetchAiringTodayTVShows(pageNum);
                break;
              case 'latest':
                response = await movieService.fetchLatestTVShows(pageNum);
                break;
            }
            break;
          case 'anime':
            switch (category) {
              case 'popular':
                response = await movieService.fetchPopularAnime(pageNum);
                break;
              case 'top_rated':
                response = await movieService.fetchTopRatedAnime(pageNum);
                break;
              case 'seasonal':
                response = await movieService.fetchSeasonalAnime(pageNum);
                break;
              case 'movies':
                response = await movieService.fetchAnimeMovies(pageNum);
                break;
              case 'latest':
                response = await movieService.fetchLatestAnime(pageNum);
                break;
            }
            break;
        }
      }
      
      if (response) {
        setMovies(response);
        setTotalPages(response.total_pages);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContent(activeSection, activeCategory, searchQuery, page);
  }, [activeSection, activeCategory, searchQuery, page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchContent(activeSection, activeCategory, searchQuery, 1);
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
  };

  const handleSectionChange = (section: ContentType) => {
    setActiveSection(section);
    setSearchQuery('');
    setPage(1);
    setActiveCategory('popular');
  };

  const handleCategoryChange = (category: Category) => {
    setActiveCategory(category);
    setSearchQuery('');
    setPage(1);
  };

  const getPlaceholderText = () => {
    switch (activeSection) {
      case 'movies':
        return 'Search for movies...';
      case 'tv':
        return 'Search for TV shows...';
      case 'anime':
        return 'Search for anime...';
    }
  };

  return (
    <Box bg={bgColor} minH="100vh" display="flex" flexDirection="column">
      <Container maxW="container.xl" py={8} flex="1">
        <Box mb={8}>
          <ButtonGroup variant="ghost" spacing={4} mb={6} width="100%">
            <Button
              isActive={activeSection === 'movies'}
              onClick={() => handleSectionChange('movies')}
              flex={1}
            >
              Movies
            </Button>
            <Button
              isActive={activeSection === 'tv'}
              onClick={() => handleSectionChange('tv')}
              flex={1}
            >
              TV Shows
            </Button>
            <Button
              isActive={activeSection === 'anime'}
              onClick={() => handleSectionChange('anime')}
              flex={1}
            >
              Anime
            </Button>
          </ButtonGroup>

          <ButtonGroup variant="ghost" spacing={2} mb={6} width="100%" overflowX="auto" display="flex">
            {getCategoryButtons().map(({ category, label }) => (
              <Button
                key={category}
                isActive={activeCategory === category}
                onClick={() => handleCategoryChange(category as Category)}
                colorScheme="blue"
                flexShrink={0}
              >
                {label}
              </Button>
            ))}
          </ButtonGroup>

          <form onSubmit={handleSearch} style={{ width: '100%' }}>
            <Input
              placeholder={getPlaceholderText()}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="lg"
              mb={8}
              bg={useColorModeValue('white', 'gray.800')}
            />
          </form>

          {isLoading ? (
            <SimpleGrid columns={[1, 2, 3, 4]} spacing={6} py={8}>
              {[...Array(8)].map((_, index) => (
                <Box key={index} height="400px">
                  <Skeleton height="100%" />
                </Box>
              ))}
            </SimpleGrid>
          ) : movies && movies.results && movies.results.length > 0 ? (
            <>
              <SimpleGrid columns={[1, 2, 3, 4]} spacing={6} py={8}>
                {movies.results.map((movie) => (
                  <MovieCard 
                    key={movie.id} 
                    movie={movie} 
                    onClick={() => handleMovieClick(movie)}
                  />
                ))}
              </SimpleGrid>
              {movies.page < movies.total_pages && (
                <Button
                  onClick={loadMore}
                  isLoading={isLoading}
                  loadingText="Loading more..."
                  variant="outline"
                  colorScheme="blue"
                  mb={8}
                >
                  Load More
                </Button>
              )}
            </>
          ) : (
            <Text fontSize="xl" textAlign="center" py={8}>
              No results found. Try adjusting your search or category.
            </Text>
          )}
        </Box>
      </Container>

      <Box as="footer" bg={footerBg} py={8} px={4}>
        <Container maxW="container.xl">
          <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align="center" gap={4}>
            <Text color={footerText} textAlign="center">
              © 2024 Movie Reviews. All rights reserved.
            </Text>
            <Flex gap={6}>
              <Link color={footerText} href="#" _hover={{ color: 'blue.500' }}>
                About
              </Link>
              <Link color={footerText} href="#" _hover={{ color: 'blue.500' }}>
                Privacy Policy
              </Link>
              <Link color={footerText} href="#" _hover={{ color: 'blue.500' }}>
                Terms of Service
              </Link>
            </Flex>
            <Flex direction="column" align="center" gap={1}>
              <Text color={footerText} fontSize="sm">
                Powered by TMDB and Jikan API
              </Text>
              <Text color={footerText} fontSize="sm">
                Developed by Mohit Shah
              </Text>
            </Flex>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage; 