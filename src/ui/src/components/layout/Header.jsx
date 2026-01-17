import { Box, Heading, HStack, Button } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const showBackButton = location.pathname !== '/';

  return (
    <Box
      bg="blue.500"
      color="white"
      py={4}
      px={6}
      shadow="sm"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      <HStack>
        {showBackButton && (
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            _hover={{ bg: 'blue.600' }}
            color="white"
          >
            ← Back
          </Button>
        )}
        <Heading as="h1" size="lg" fontWeight="bold">
          🚀 AICRM Lite
        </Heading>
      </HStack>
    </Box>
  );
}
