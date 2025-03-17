import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  Text,
  Link,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg={bgColor} py={12}>
      <Container maxW="container.sm">
        <Box bg={cardBg} p={8} borderRadius="lg" boxShadow="xl">
          <VStack spacing={6}>
            <Heading>Login</Heading>
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </FormControl>
                <Button
                  type="submit"
                  colorScheme="blue"
                  width="100%"
                  isLoading={isLoading}
                >
                  Login
                </Button>
              </VStack>
            </form>
            <Text>
              Don't have an account?{' '}
              <Link as={RouterLink} to="/register" color="blue.500">
                Register here
              </Link>
            </Text>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage; 