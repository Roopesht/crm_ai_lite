export const LEAD_STATUS_OPTIONS = [
  { value: 'new', label: 'New', color: 'purple' },
  { value: 'contacted', label: 'Contacted', color: 'blue' },
  { value: 'interested', label: 'Interested', color: 'green' },
  { value: 'qualified', label: 'Qualified', color: 'orange' },
  { value: 'lost', label: 'Lost', color: 'red' },
];

export const INTERACTION_TYPE_OPTIONS = [
  { value: 'call', label: 'Call', icon: '📞' },
  { value: 'email', label: 'Email', icon: '📧' },
  { value: 'meeting', label: 'Meeting', icon: '🤝' },
  { value: 'note', label: 'Note', icon: '📝' },
];

export const getStatusColor = (status) => {
  const option = LEAD_STATUS_OPTIONS.find((opt) => opt.value === status);
  return option ? option.color : 'gray';
};

export const getInteractionIcon = (type) => {
  const option = INTERACTION_TYPE_OPTIONS.find((opt) => opt.value === type);
  return option ? option.icon : '📌';
};

export const getStatusLabel = (status) => {
  const option = LEAD_STATUS_OPTIONS.find((opt) => opt.value === status);
  return option ? option.label : status;
};
