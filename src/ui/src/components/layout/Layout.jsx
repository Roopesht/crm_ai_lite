import { Box } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export function Layout() {
  return (
    <Box minH="100vh" bg="gray.50">
      <Header />
      <Box as="main" maxW="1400px" mx="auto" p={6}>
        <Outlet />
      </Box>
    </Box>
  );
}
