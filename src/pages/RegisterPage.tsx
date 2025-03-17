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

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    try {
      await register(username, email, password);
      toast({
        title: 'Registration successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Registration failed',
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
            <Heading>Register</Heading>
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </FormControl>
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
                    autoComplete="new-password"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Confirm Password</FormLabel>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </FormControl>
                <Button
                  type="submit"
                  colorScheme="blue"
                  width="100%"
                  isLoading={isLoading}
                >
                  Register
                </Button>
              </VStack>
            </form>
            <Text>
              Already have an account?{' '}
              <Link as={RouterLink} to="/login" color="blue.500">
                Login here
              </Link>
            </Text>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default RegisterPage; 