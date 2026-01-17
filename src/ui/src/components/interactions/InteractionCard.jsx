import { Box, HStack, VStack, Text, Badge } from '@chakra-ui/react';
import { getInteractionIcon } from '../../utils/constants';

export function InteractionCard({ interaction }) {
  const icon = getInteractionIcon(interaction.type);
  const date = new Date(interaction.created_at);

  return (
    <Box bg="white" p={4} borderRadius="md" shadow="sm" borderLeft="4px" borderColor="blue.500">
      <HStack spacing={3} align="start" mb={2}>
        <Text fontSize="2xl">{icon}</Text>
        <VStack align="start" spacing={0} flex={1}>
          <HStack>
            <Badge colorScheme="purple" fontSize="xs">
              {interaction.type}
            </Badge>
            <Text fontSize="xs" color="gray.500">
              {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </HStack>
          <Text mt={2}>{interaction.notes}</Text>
        </VStack>
      </HStack>
    </Box>
  );
}
