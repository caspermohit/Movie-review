import { Box, Image, Text, Badge, useColorModeValue } from '@chakra-ui/react';
import { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Partial<Movie> & { id: number; title: string; overview: string; poster_path: string };
  onClick: (movie: any) => void;
}

const MovieCard = ({ movie, onClick }: MovieCardProps) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Release date unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'green';
    if (rating >= 6) return 'yellow';
    if (rating >= 4) return 'orange';
    return 'red';
  };

  return (
    <Box
      borderRadius="lg"
      overflow="hidden"
      bg={cardBg}
      boxShadow="xl"
      transition="transform 0.2s"
      _hover={{ transform: 'scale(1.02)', cursor: 'pointer' }}
      onClick={() => onClick(movie)}
    >
      <Image
        src={movie.poster_path?.startsWith('http') 
          ? movie.poster_path 
          : `https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        width="100%"
        height="auto"
        fallbackSrc="https://via.placeholder.com/300x450?text=No+Image"
      />

      <Box p={4}>
        <Text
          fontWeight="bold"
          fontSize="lg"
          mb={2}
          color={textColor}
          noOfLines={2}
        >
          {movie.title}
        </Text>

        {movie.vote_average && movie.vote_average > 0 && (
          <Badge
            colorScheme={getRatingColor(movie.vote_average)}
            mb={2}
          >
            {movie.vote_average.toFixed(1)}
          </Badge>
        )}

        <Text
          fontSize="sm"
          color={useColorModeValue('gray.600', 'gray.400')}
          mb={2}
        >
          {formatDate(movie.release_date)}
        </Text>

        <Text
          fontSize="sm"
          color={useColorModeValue('gray.700', 'gray.300')}
          noOfLines={3}
        >
          {movie.overview || 'No description available.'}
        </Text>
      </Box>
    </Box>
  );
};

export default MovieCard; 