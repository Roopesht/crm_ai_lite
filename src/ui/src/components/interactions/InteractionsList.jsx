import { useState, useEffect } from 'react';
import {
  VStack,
  HStack,
  Heading,
  Button,
  Spinner,
  Text,
  Box,
} from '@chakra-ui/react';
import { useToast } from '../../hooks/useToast';
import interactionsApi from '../../services/interactionsApi';
import { InteractionCard } from './InteractionCard';
import { InteractionForm } from './InteractionForm';

export function InteractionsList({ leadId, onInteractionAdded }) {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const toast = useToast();

  useEffect(() => {
    loadInteractions();
  }, [leadId]);

  const loadInteractions = async () => {
    try {
      setLoading(true);
      const response = await interactionsApi.list(leadId);
      setInteractions(response.data);
    } catch (error) {
      const { toast } = useToast();
      toast({
        title: 'Error loading interactions',
        description: error.response?.data?.detail || 'Failed to load interactions',
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInteractionAdded = async () => {
    setShowForm(false);
    await loadInteractions();
    if (onInteractionAdded) {
      onInteractionAdded();
    }
toast.toast({
      title: 'Interaction added',
      status: 'success',
    });
  };

  return (
    <VStack align="stretch" spacing={4}>
      <HStack justify="space-between">
        <Heading size="md">Interactions</Heading>
        <Button
          colorScheme="blue"
          size="sm"
          onClick={() => setShowForm(true)}
        >
          + Add Interaction
        </Button>
      </HStack>

      {showForm && (
        <InteractionForm
          leadId={leadId}
          onSuccess={handleInteractionAdded}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading ? (
        <Box textAlign="center" py={6}>
          <Spinner size="lg" color="blue.500" />
        </Box>
      ) : interactions.length === 0 ? (
        <Box textAlign="center" py={6} bg="gray.50" borderRadius="md">
          <Text color="gray.500">No interactions yet. Add one to get started!</Text>
        </Box>
      ) : (
        <VStack align="stretch" spacing={3}>
          {interactions.map((interaction) => (
            <InteractionCard key={interaction.id} interaction={interaction} />
          ))}
        </VStack>
      )}
    </VStack>
  );
}
