import { useState } from 'react';
import {
  VStack,
  Button,
  HStack,
  Box,
  Text,
} from '@chakra-ui/react';
import { useToast } from '../../hooks/useToast';
import interactionsApi from '../../services/interactionsApi';
import leadsApi from '../../services/leadsApi';
import { INTERACTION_TYPE_OPTIONS } from '../../utils/constants';

export function InteractionForm({ leadId, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    type: 'call',
    notes: '',
  });
  const [suggestedMessage, setSuggestedMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSuggest = async () => {
    if (!formData.notes.trim()) {
toast.toast({
        title: 'Please add notes first',
        status: 'info',
      });
      return;
    }

    try {
      setSuggesting(true);
      const response = await leadsApi.suggest(leadId, {
        type: formData.type,
        notes: formData.notes,
      });
      setSuggestedMessage(response.data.suggested_message);
    } catch (error) {
toast.toast({
        title: 'Error generating suggestion',
        description: error.response?.data?.detail || 'Failed to generate suggestion',
        status: 'error',
      });
    } finally {
      setSuggesting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(suggestedMessage);
toast.toast({
      title: 'Copied to clipboard',
      status: 'success',
      duration: 2000,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.notes.trim()) {
toast.toast({
        title: 'Validation error',
        description: 'Notes are required',
        status: 'error',
      });
      return;
    }

    try {
      setLoading(true);
      await interactionsApi.create(leadId, formData);
      onSuccess();
    } catch (error) {
toast.toast({
        title: 'Error creating interaction',
        description: error.response?.data?.detail || 'Failed to create interaction',
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box bg="white" p={6} borderRadius="md" shadow="sm" borderLeft="4px" borderColor="blue.500">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <Box>
            <Text fontWeight="600" mb={2}>Interaction Type *</Text>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}
            >
              {INTERACTION_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.icon} {option.label}
                </option>
              ))}
            </select>
          </Box>

          <Box>
            <Text fontWeight="600" mb={2}>Notes *</Text>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="What happened during this interaction?"
              rows="3"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}
            />
          </Box>

          {suggestedMessage && (
            <Box bg="blue.50" p={4} borderRadius="md" borderLeft="4px" borderColor="blue.500">
              <Text fontWeight="600" mb={2}>
                ✨ AI-Suggested Message
              </Text>
              <Box bg="white" p={3} borderRadius="md" fontSize="sm" mb={3}>
                {suggestedMessage}
              </Box>
              <Button
                size="sm"
                colorScheme="blue"
                onClick={handleCopy}
              >
                📋 Copy Message
              </Button>
            </Box>
          )}

          <HStack spacing={3} width="100%">
            <Button
              colorScheme="blue"
              variant="outline"
              onClick={handleSuggest}
              isLoading={suggesting}
              isDisabled={!formData.notes.trim() || loading}
              flex={1}
            >
              ✨ Suggest Message
            </Button>
            <Button
              variant="outline"
              onClick={onCancel}
              isDisabled={loading}
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              isLoading={loading}
              flex={1}
            >
              Save Interaction
            </Button>
          </HStack>
        </VStack>
      </form>
    </Box>
  );
}
