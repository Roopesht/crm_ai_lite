import { useState, useEffect } from 'react';
import {
  VStack,
  HStack,
  Box,
  Heading,
  Text,
  Button,
  Spinner,
  Grid,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import leadsApi from '../../services/leadsApi';
import { LeadStatusBadge } from './LeadStatusBadge';
import { LEAD_STATUS_OPTIONS, isPastDue, PAST_DUE_BG_COLOR } from '../../utils/constants';

export function LeadDetails({ leadId }) {
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    loadLead();
  }, [leadId]);

  const loadLead = async () => {
    try {
      const response = await leadsApi.get(leadId);
      setLead(response.data);
    } catch (error) {
toast.toast({
        title: 'Error loading lead',
        description: error.response?.data?.detail || 'Failed to load lead',
        status: 'error',
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === lead.status) return;

    try {
      setUpdatingStatus(true);
      await leadsApi.update(leadId, { status: newStatus });
      setLead((prev) => ({
        ...prev,
        status: newStatus,
      }));
toast.toast({
        title: 'Status updated',
        status: 'success',
      });
    } catch (error) {
toast.toast({
        title: 'Error updating status',
        description: error.response?.data?.detail || 'Failed to update status',
        status: 'error',
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="lg" color="blue.500" />
      </Box>
    );
  }

  if (!lead) {
    return (
      <Box textAlign="center" py={10}>
        <Text>Lead not found</Text>
      </Box>
    );
  }

  return (

    <VStack align="stretch" spacing={6}>
      <Box bg="white" p={6} borderRadius="md" shadow="sm">
        <HStack justify="space-between" mb={6}>
          <Heading size="lg">{lead.name}</Heading>
          <Button
            colorScheme="blue"
            variant="outline"
            onClick={() => navigate(`/leads/${leadId}/edit`)}
          >
            Edit
          </Button>
        </HStack>

        <Grid templateColumns="repeat(2, 1fr)" gap={6}>


          <Box>
            <Text fontSize="sm" color="gray.500" fontWeight="600">
              Email
            </Text>
            <Text>{lead.email || '-'}</Text>
          </Box>

          <Box>
            <Text fontSize="sm" color="gray.500" fontWeight="600">
              Phone
            </Text>
            <Text>{lead.phone || '-'}</Text>
          </Box>
          
          <Box>
            <Text fontSize="sm" color="gray.500" fontWeight="600">
              Status
            </Text>
            <HStack spacing={2} mt={2}>
              <select
                name="status"
                value={lead.status}
                onChange={handleStatusChange}
                disabled={updatingStatus}
                style={{
                  maxWidth: '150px',
                  padding: '0.5rem',
                  fontSize: '0.875rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #e2e8f0',
                }}
              >
                {LEAD_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {updatingStatus && <Spinner size="sm" />}
            </HStack>
          </Box>
          
                
          <Box>
            <Text fontSize="sm" color="gray.500" fontWeight="600">
              Source
            </Text>
            <Text>{lead.source || '-'}</Text>
          </Box>

          <Box>
            <Text fontSize="sm" color="gray.500" fontWeight="600">
              Created
            </Text>
            <Text>{new Date(lead.created_at).toLocaleDateString()}</Text>
          </Box>

          <Box bg={isPastDue(lead.next_contact_date) ? PAST_DUE_BG_COLOR : "white"} p={3} borderRadius="md">
            <Text fontSize="sm" color="gray.500" fontWeight="600">
              Next Contact Date
            </Text>
            <Text>{lead.next_contact_date ? new Date(lead.next_contact_date).toLocaleDateString() : '-'}</Text>
          </Box>

        </Grid>

        {lead.ai_summary && (
          <Box mt={6}>
            <Text fontSize="sm" color="gray.500" fontWeight="600" mb={2}>
              AI Summary
            </Text>
            <Box bg="blue.50" p={3} borderRadius="md" borderLeft="4px" borderColor="blue.500">
              <Text>{lead.ai_summary}</Text>
            </Box>
          </Box>
        )}
      </Box>
    </VStack>
  );
}
