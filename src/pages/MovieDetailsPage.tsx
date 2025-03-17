import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Image,
  Text,
  Badge,
  Grid,
  Button,
  VStack,
  HStack,
  Heading,
  SimpleGrid,
  useColorModeValue,
  AspectRatio,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  useToast,
  Card,
  CardBody,
  Avatar,
  IconButton,
} from '@chakra-ui/react';
import { ArrowBackIcon, StarIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { MovieDetails as MovieDetailsType, Review } from '../types/movie';
import MovieCard from '../components/MovieCard';
import * as movieService from '../services/movieService';

const MovieDetailsPage = () => {
  const { id, type: routeType = 'movie' } = useParams<{ id: string; type: string }>();
  const type = routeType === 'movies' ? 'movie' : routeType;
  const navigate = useNavigate();
  const [details, setDetails] = useState<MovieDetailsType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');
  const toast = useToast();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const subTextColor = useColorModeValue('gray.600', 'gray.400');

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) {
        setError('No movie ID provided');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        console.log('Fetching details for:', { id, type });
        const data = await movieService.fetchMovieDetails(
          parseInt(id),
          type as 'movie' | 'tv' | 'anime'
        );
        console.log('Received movie details:', data);
        setDetails(data);
        if (data.videos && data.videos.length > 0) {
          setSelectedVideo(data.videos[0].key);
        }
      } catch (error) {
        console.error('Error fetching details:', error);
        const message = error instanceof Error ? error.message : 'Failed to fetch movie details';
        setError(message);
        toast({
          title: 'Error',
          description: message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [id, type, toast]);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!id) return;
      try {
        setIsLoadingWishlist(true);
        const wishlist = await movieService.getWishlist();
        const isInList = wishlist.some(item => 
          item.movieId === parseInt(id) && item.contentType === type
        );
        setIsInWishlist(isInList);
      } catch (error) {
        console.error('Error checking wishlist status:', error);
        const message = error instanceof Error ? error.message : 'Failed to check wishlist status';
        if (message !== 'Authentication required') {
          toast({
            title: 'Error',
            description: message,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      } finally {
        setIsLoadingWishlist(false);
      }
    };

    checkWishlistStatus();
  }, [id, type, toast]);

  const handleToggleWishlist = async () => {
    try {
      if (!details) {
        toast({
          title: 'Error',
          description: 'Movie details not available',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      if (isInWishlist) {
        await movieService.removeFromWishlist(parseInt(id!), type);
        setIsInWishlist(false);
        toast({
          title: 'Success',
          description: 'Removed from wishlist',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await movieService.addToWishlist(
          parseInt(id!),
          type,
          {
            title: details.title,
            overview: details.overview,
            posterPath: details.poster_path
          }
        );
        setIsInWishlist(true);
        toast({
          title: 'Success',
          description: 'Added to wishlist',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      const message = error instanceof Error ? error.message : 'Failed to update wishlist';
      toast({
        title: 'Error',
        description: message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!details) {
        toast({
          title: 'Error',
          description: 'Movie details not available. Please try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const newReview = await movieService.addReview(
        parseInt(id!),
        type,
        parseInt(rating),
        comment,
        {
          title: details.title,
          overview: details.overview,
          posterPath: details.poster_path
        }
      );

      setDetails(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          reviews: [{
            id: newReview._id,
            rating: newReview.rating,
            comment: newReview.comment,
            createdAt: newReview.createdAt,
            movieDetails: newReview.movieDetails
          }, ...prev.reviews]
        };
      });

      setRating('5');
      setComment('');

      toast({
        title: 'Review submitted',
        description: 'Thank you for your review!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      const message = error instanceof Error ? error.message : 'Failed to submit review';
      toast({
        title: 'Error',
        description: message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return (
      <Box minH="100vh" bg={bgColor} py={8}>
        <Container maxW="container.xl">
          <VStack spacing={4}>
            <Text>Loading movie details...</Text>
          </VStack>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box minH="100vh" bg={bgColor} py={8}>
        <Container maxW="container.xl">
          <VStack spacing={4}>
            <Text color="red.500">Error: {error}</Text>
            <Button onClick={() => navigate(-1)} leftIcon={<ArrowBackIcon />}>
              Go Back
            </Button>
          </VStack>
        </Container>
      </Box>
    );
  }

  if (!details) {
    return (
      <Box minH="100vh" bg={bgColor} py={8}>
        <Container maxW="container.xl">
          <VStack spacing={4}>
            <Text>No movie details available</Text>
            <Button onClick={() => navigate(-1)} leftIcon={<ArrowBackIcon />}>
              Go Back
            </Button>
          </VStack>
        </Container>
      </Box>
    );
  }

  const formatRuntime = (runtime: number | string) => {
    if (typeof runtime === 'string') return runtime;
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <Box minH="100vh" bg={bgColor}>
      <Box
        h="500px"
        position="relative"
        bgImage={details.backdrop_path ? `url(${details.backdrop_path})` : undefined}
        bgSize="cover"
        bgPosition="center"
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bg: 'rgba(0, 0, 0, 0.7)',
        }}
      >
        <Container maxW="container.xl" h="100%" position="relative">
          <Button
            leftIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            position="absolute"
            top={4}
            left={4}
            colorScheme="whiteAlpha"
          >
            Back
          </Button>

          <Grid
            templateColumns={{ base: '1fr', md: '300px 1fr' }}
            gap={8}
            h="100%"
            alignItems="center"
          >
            <Image
              src={details.poster_path}
              alt={details.title}
              borderRadius="lg"
              boxShadow="2xl"
            />
            <VStack align="flex-start" spacing={4} color="white">
              <Heading as="h1" size="2xl">
                {details.title}
              </Heading>
              <HStack spacing={5} wrap="wrap">
                <Badge colorScheme="blue" fontSize="md">
                  {details.status}
                </Badge>
                {details.runtime && (
                  <Text fontSize="md">{formatRuntime(details.runtime)}</Text>
                )}
                {details.vote_average > 0 && (
                  <Badge colorScheme="green" fontSize="md">
                    {details.vote_average.toFixed(1)}
                  </Badge>
                )}
                {details.release_date && (
                  <Text fontSize="md">
                    {new Date(details.release_date).getFullYear()}
                  </Text>
                )}
              </HStack>
              {details.tagline && (
                <Text fontSize="lg" fontStyle="italic" color="gray.300">
                  {details.tagline}
                </Text>
              )}
              <Text fontSize="lg">{details.overview}</Text>
              <HStack spacing={2}>
                {details.genres.map((genre) => (
                  <Badge key={genre.id} colorScheme="purple">
                    {genre.name}
                  </Badge>
                ))}
              </HStack>
              <HStack>
                <IconButton
                  aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                  icon={isInWishlist ? <DeleteIcon /> : <AddIcon />}
                  colorScheme={isInWishlist ? 'red' : 'pink'}
                  isLoading={isLoadingWishlist}
                  onClick={handleToggleWishlist}
                />
              </HStack>
            </VStack>
          </Grid>
        </Container>
      </Box>

      <Container maxW="container.xl" py={8}>
        {selectedVideo && (
          <VStack spacing={4} mb={8}>
            <Heading as="h2" size="lg" color={textColor}>
              Trailer
            </Heading>
            <AspectRatio ratio={16 / 9} w="100%">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo}`}
                title="Movie Trailer"
                allowFullScreen
              />
            </AspectRatio>
          </VStack>
        )}

        {details.cast.length > 0 && (
          <VStack spacing={4} mb={8}>
            <Heading as="h2" size="lg" color={textColor}>
              Cast
            </Heading>
            <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 6 }} spacing={4}>
              {details.cast.map((person) => (
                <Box
                  key={person.id}
                  bg={cardBg}
                  p={4}
                  borderRadius="lg"
                  textAlign="center"
                >
                  <Image
                    src={
                      person.profile_path
                        ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                        : 'https://via.placeholder.com/185x278?text=No+Image'
                    }
                    alt={person.name}
                    borderRadius="md"
                    mb={2}
                  />
                  <Text fontWeight="bold" color={textColor} noOfLines={1}>
                    {person.name}
                  </Text>
                  <Text fontSize="sm" color={subTextColor} noOfLines={1}>
                    {person.character}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        )}

        <VStack spacing={4} mb={8}>
          <Heading as="h2" size="lg" color={textColor}>
            Reviews
          </Heading>
          <form onSubmit={handleSubmitReview} style={{ width: '100%' }}>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Rating</FormLabel>
                <Select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  bg={cardBg}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Comment</FormLabel>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your review here..."
                  bg={cardBg}
                />
              </FormControl>
              <Button type="submit" colorScheme="blue">
                Submit Review
              </Button>
            </VStack>
          </form>

          {details.reviews.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="100%">
              {details.reviews.map((review) => (
                <Card key={review.id} bg={cardBg}>
                  <CardBody>
                    <HStack spacing={4} mb={2}>
                      <Avatar size="sm" name={review.id} />
                      <VStack align="start" spacing={0}>
                        <Badge colorScheme="green">Rating: {review.rating}/10</Badge>
                        <Text fontSize="sm" color={subTextColor}>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </Text>
                      </VStack>
                    </HStack>
                    <Text color={textColor}>{review.comment}</Text>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          ) : (
            <Text color={subTextColor}>No reviews yet. Be the first to review!</Text>
          )}
        </VStack>

        {details.recommendations.length > 0 && (
          <VStack spacing={4} mb={8}>
            <Heading as="h2" size="lg" color={textColor}>
              You May Also Like
            </Heading>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
              {details.recommendations.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onClick={(movie) =>
                    navigate(`/${type}/${movie.id}`)
                  }
                />
              ))}
            </SimpleGrid>
          </VStack>
        )}
      </Container>
    </Box>
  );
};

export default MovieDetailsPage; 