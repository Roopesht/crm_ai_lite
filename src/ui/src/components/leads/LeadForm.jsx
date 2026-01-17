import { useState, useEffect } from 'react';
import {
  VStack,
  Button,
  HStack,
  Box,
  Text,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import leadsApi from '../../services/leadsApi';
import { LEAD_STATUS_OPTIONS } from '../../utils/constants';

export function LeadForm({ leadId }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'new',
    source: '',
    ai_summary: '',
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!leadId);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (leadId) {
      loadLead();
    }
  }, [leadId]);

  const loadLead = async () => {
    try {
      const response = await leadsApi.get(leadId);
      setFormData(response.data);
    } catch (error) {
      toast({
        title: 'Error loading lead',
        description: error.response?.data?.detail || 'Failed to load lead',
        status: 'error',
      });
      navigate('/');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: 'Validation error',
        description: 'Lead name is required',
        status: 'error',
      });
      return;
    }

    if (formData.name.length < 2) {
      toast({
        title: 'Validation error',
        description: 'Lead name must be at least 2 characters',
        status: 'error',
      });
      return;
    }

    try {
      setLoading(true);
      if (leadId) {
        await leadsApi.update(leadId, formData);
        toast({
          title: 'Lead updated',
          status: 'success',
        });
      } else {
        await leadsApi.create(formData);
        toast({
          title: 'Lead created',
          status: 'success',
        });
      }
      navigate(`/leads/${leadId || ''}`);
    } catch (error) {
      toast({
        title: 'Error saving lead',
        description: error.response?.data?.detail || 'Failed to save lead',
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4} maxW="500px" align="stretch">
        <Box>
          <Text fontWeight="600" mb={2}>Lead Name *</Text>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Acme Corp"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}
          />
        </Box>

        <Box>
          <Text fontWeight="600" mb={2}>Email</Text>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="contact@example.com"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}
          />
        </Box>

        <Box>
          <Text fontWeight="600" mb={2}>Phone</Text>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1-555-0123"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}
          />
        </Box>

        <Box>
          <Text fontWeight="600" mb={2}>Status</Text>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}
          >
            {LEAD_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Box>

        <Box>
          <Text fontWeight="600" mb={2}>Source</Text>
          <input
            name="source"
            value={formData.source}
            onChange={handleChange}
            placeholder="e.g., Website, Referral"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}
          />
        </Box>

        <Box>
          <Text fontWeight="600" mb={2}>AI Summary</Text>
          <textarea
            name="ai_summary"
            value={formData.ai_summary}
            onChange={handleChange}
            placeholder="Add notes about this lead..."
            rows="4"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}
          />
        </Box>

        <HStack spacing={3} width="100%">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
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
            {leadId ? 'Update Lead' : 'Create Lead'}
          </Button>
        </HStack>
      </VStack>
    </form>
  );
}
