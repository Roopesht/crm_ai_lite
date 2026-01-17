// Simple toast implementation for MVP using browser APIs
export function useToast() {
  return {
    toast: ({ title, description, status, duration, isClosable }) => {
      const message = description ? `${title}: ${description}` : title;

      // Log to console
      console.log(`[${status}] ${message}`);

      // For error status, you can also use alert for MVP
      // Uncomment below for more visible notifications:
      // if (status === 'error') {
      //   alert(`Error: ${message}`);
      // }
    },
  };
}

// Alternative: Create a global toast container if needed
export const showToast = ({ title, description, status = 'info' }) => {
  const message = description ? `${title}: ${description}` : title;
  console.log(`[${status}] ${message}`);
};
