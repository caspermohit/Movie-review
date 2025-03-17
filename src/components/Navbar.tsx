import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Flex,
  Button,
  useColorMode,
  useColorModeValue,
  Stack,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, logout } = useAuth();
  const bgColor = useColorModeValue('white', 'gray.800');

  const handleLogout = () => {
    logout();
  };

  return (
    <Box bg={bgColor} px={4} position="fixed" width="100%" zIndex={1}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Box>
          <Link as={RouterLink} to="/" fontSize="xl" fontWeight="bold">
            Movie Reviews
          </Link>
        </Box>

        <Flex alignItems="center">
          <Stack direction="row" spacing={4} alignItems="center">
            <Link as={RouterLink} to="/">
              Home
            </Link>
            <Link as={RouterLink} to="/wishlist">
              Wishlist
            </Link>
            <Button onClick={toggleColorMode}>
              {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            </Button>

            {user ? (
              <Menu>
                <MenuButton as={Button} rounded="full" variant="link" cursor="pointer" minW={0}>
                  <Avatar size="sm" name={user.username} />
                </MenuButton>
                <MenuList>
                  <MenuItem as={RouterLink} to="/profile">
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Stack direction="row" spacing={4}>
                <Button as={RouterLink} to="/login" variant="ghost">
                  Login
                </Button>
                <Button as={RouterLink} to="/register" colorScheme="blue">
                  Register
                </Button>
              </Stack>
            )}
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar; 