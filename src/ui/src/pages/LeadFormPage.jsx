import { useParams } from 'react-router-dom';
import { Box, Heading } from '@chakra-ui/react';
import { LeadForm } from '../components/leads/LeadForm';

export function LeadFormPage() {
  const { id } = useParams();

  return (
    <Box>
      <Heading mb={6} size="lg">
        {id ? 'Edit Lead' : 'Create New Lead'}
      </Heading>
      <LeadForm leadId={id} />
    </Box>
  );
}
