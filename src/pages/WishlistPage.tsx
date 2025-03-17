import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Text,
  Button,
  VStack,
  HStack,
  Heading,
  SimpleGrid,
  useColorModeValue,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import MovieCard from '../components/MovieCard';
import * as movieService from '../services/movieService';
import { WishlistResponse } from '../services/movieService';

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState<WishlistResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'white');

  const fetchWishlist = async () => {
    try {
      setIsLoading(true);
      const items = await movieService.getWishlist();
      setWishlist(items);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      const message = error instanceof Error ? error.message : 'Failed to fetch wishlist';
      if (message !== 'Authentication required') {
        toast({
          title: 'Error',
          description: message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
      if (message === 'Authentication required') {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [navigate, toast]);

  const handleRemoveFromWishlist = async (movieId: number, contentType: string) => {
    try {
      await movieService.removeFromWishlist(movieId, contentType);
      setWishlist(prev => prev.filter(item => !(item.movieId === movieId && item.contentType === contentType)));
      toast({
        title: 'Success',
        description: 'Removed from wishlist',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      const message = error instanceof Error ? error.message : 'Failed to remove from wishlist';
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
          <Text>Loading...</Text>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={bgColor} py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <HStack justify="space-between">
            <Heading as="h1" size="xl" color={textColor}>
              My Wishlist
            </Heading>
            <Button onClick={() => navigate('/')} colorScheme="blue">
              Browse Movies
            </Button>
          </HStack>

          {wishlist.length === 0 ? (
            <VStack spacing={4} py={8}>
              <Text color={textColor}>Your wishlist is empty</Text>
              <Button onClick={() => navigate('/')} colorScheme="blue">
                Discover Movies
              </Button>
            </VStack>
          ) : (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
              {wishlist.map((item) => (
                <Box key={`${item.movieId}-${item.contentType}`} position="relative">
                  <IconButton
                    aria-label="Remove from wishlist"
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    size="sm"
                    position="absolute"
                    top={2}
                    right={2}
                    zIndex={1}
                    onClick={() => handleRemoveFromWishlist(item.movieId, item.contentType)}
                  />
                  <MovieCard
                    movie={{
                      id: item.movieId,
                      title: item.movieDetails.title,
                      overview: item.movieDetails.overview,
                      poster_path: item.movieDetails.posterPath,
                      backdrop_path: '',
                      vote_average: 0,
                      release_date: '',
                    }}
                    onClick={() => navigate(`/${item.contentType}/${item.movieId}`)}
                  />
                </Box>
              ))}
            </SimpleGrid>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default WishlistPage; 