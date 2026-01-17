import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react';
import { Layout } from './components/layout/Layout';
import { LeadsListPage } from './pages/LeadsListPage';
import { LeadFormPage } from './pages/LeadFormPage';
import { LeadDetailsPage } from './pages/LeadDetailsPage';

const system = createSystem(defaultConfig);

function App() {
  return (
    <ChakraProvider value={system}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LeadsListPage />} />
            <Route path="/leads/new" element={<LeadFormPage />} />
            <Route path="/leads/:id/edit" element={<LeadFormPage />} />
            <Route path="/leads/:id" element={<LeadDetailsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
