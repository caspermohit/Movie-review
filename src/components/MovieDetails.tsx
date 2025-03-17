import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Image,
  Text,
  Badge,
  VStack,
  HStack,
  Box,
  useColorModeValue,
} from '@chakra-ui/react';
import { Movie } from '../types/movie';

interface MovieDetailsProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

const MovieDetails = ({ movie, isOpen, onClose }: MovieDetailsProps) => {
  const modalBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const subTextColor = useColorModeValue('gray.600', 'gray.400');

  if (!movie) return null;

  const formatDate = (dateString: string) => {
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
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent bg={modalBg}>
        <ModalHeader color={textColor}>{movie.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Box position="relative">
            <Image
              src={movie.backdrop_path?.startsWith('http')
                ? movie.backdrop_path
                : `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
              alt={movie.title}
              width="100%"
              height="auto"
              borderRadius="md"
              fallbackSrc="https://via.placeholder.com/1280x720?text=No+Image"
            />
            <Box
              position="absolute"
              bottom={0}
              left={0}
              right={0}
              p={4}
              background="linear-gradient(to top, rgba(0,0,0,0.8), transparent)"
            >
              <HStack spacing={2}>
                {movie.vote_average > 0 && (
                  <Badge colorScheme={getRatingColor(movie.vote_average)}>
                    {movie.vote_average.toFixed(1)}
                  </Badge>
                )}
                <Text color="white" fontSize="sm">
                  {formatDate(movie.release_date)}
                </Text>
              </HStack>
            </Box>
          </Box>

          <VStack align="stretch" mt={4} spacing={4}>
            <Box>
              <Text fontSize="lg" fontWeight="bold" color={textColor} mb={2}>
                Overview
              </Text>
              <Text color={subTextColor}>
                {movie.overview || 'No overview available.'}
              </Text>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default MovieDetails; 