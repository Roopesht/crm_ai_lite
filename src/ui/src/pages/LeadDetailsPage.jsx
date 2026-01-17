import { useParams } from 'react-router-dom';
import { VStack } from '@chakra-ui/react';
import { LeadDetails } from '../components/leads/LeadDetails';
import { InteractionsList } from '../components/interactions/InteractionsList';

export function LeadDetailsPage() {
  const { id } = useParams();

  return (
    <VStack align="stretch" spacing={8}>
      <LeadDetails leadId={parseInt(id)} />
      <InteractionsList leadId={parseInt(id)} />
    </VStack>
  );
}
