import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import WishlistPage from './pages/WishlistPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const App = () => {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Router>
          <Box>
            <Navbar />
            <Box pt="64px">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/movies/:id" element={<MovieDetailsPage />} />
                <Route path="/tv/:id" element={<MovieDetailsPage />} />
                <Route path="/anime/:id" element={<MovieDetailsPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
};

export default App;
