import { Badge } from '@chakra-ui/react';
import { getStatusColor, getStatusLabel } from '../../utils/constants';

export function LeadStatusBadge({ status }) {
  const color = getStatusColor(status);
  const label = getStatusLabel(status);

  return (
    <Badge colorScheme={color} fontSize="xs" px={2} py={1}>
      {label}
    </Badge>
  );
}
