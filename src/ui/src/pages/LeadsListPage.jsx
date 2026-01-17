import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Input,
  VStack,
  HStack,
  Spinner,
  Text,
  Grid,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/useToast';
import leadsApi from '../services/leadsApi';
import { LeadStatusBadge } from '../components/leads/LeadStatusBadge';

export function LeadsListPage() {
  const [leads, setLeads] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const fetchLeads = async (query = '') => {
    try {
      setLoading(true);
      const response = await leadsApi.list({ q: query });
      setLeads(response.data);
    } catch (error) {
      toast.toast({
        title: 'Error loading leads',
        description: error.response?.data?.detail || 'Failed to load leads',
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    fetchLeads(value);
  };

  return (
    <VStack align="stretch" spacing={4}>
      <HStack justify="space-between">
        <Input
          placeholder="Search leads by name..."
          value={searchQuery}
          onChange={handleSearch}
          maxW="300px"
        />
        <Button colorScheme="blue" onClick={() => navigate('/leads/new')}>
          + Add Lead
        </Button>
      </HStack>

      {loading ? (
        <Box textAlign="center" py={10}>
          <Spinner size="lg" color="blue.500" />
        </Box>
      ) : leads.length === 0 ? (
        <Box textAlign="center" py={10}>
          <Text fontSize="lg" color="gray.500">
            {searchQuery ? 'No leads found' : 'No leads yet. Create one to get started!'}
          </Text>
        </Box>
      ) : (
        <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={4}>
          {leads.map((lead) => (
            <Box
              key={lead.id}
              bg="white"
              p={4}
              borderRadius="md"
              shadow="sm"
              cursor="pointer"
              transition="all 0.2s"
              _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
              onClick={() => navigate(`/leads/${lead.id}`)}
            >
              <HStack justify="space-between" mb={2}>
                <Text fontWeight="600" noOfLines={1}>
                  {lead.name}
                </Text>
                <LeadStatusBadge status={lead.status} />
              </HStack>
              <VStack align="start" spacing={1} fontSize="sm" color="gray.600">
                <Text>{lead.email || '-'}</Text>
                <Text>{lead.phone || '-'}</Text>
                <Text>{lead.source || 'No source'}</Text>
                <Text fontSize="xs" color="gray.400">
                  {new Date(lead.created_at).toLocaleDateString()}
                </Text>
              </VStack>
            </Box>
          ))}
        </Grid>
      )}
    </VStack>
  );
}
