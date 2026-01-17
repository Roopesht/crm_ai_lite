// Simple notification utility using browser APIs
export const showNotification = (message, type = 'info') => {
  // For MVP, we can use a simple approach
  // In production, consider using a proper toast library
  if (type === 'error') {
    console.error('Error:', message);
    // You can also use window.alert for MVP
  } else if (type === 'success') {
    console.log('Success:', message);
  } else {
    console.log('Info:', message);
  }
};

export const showError = (error) => {
  const message = error?.response?.data?.detail || error?.message || 'An error occurred';
  showNotification(message, 'error');
};
