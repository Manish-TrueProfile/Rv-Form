import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
// import './app.css';
import App from './App.jsx';
import { Toaster } from './components/ui/sonner';
import { BrowserRouter } from 'react-router-dom';
import { SidebarProvider } from './components/ui/sidebar';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" enableSystem defaultTheme="light">
      <BrowserRouter>
        <SidebarProvider>
          <App />
          <Toaster />
        </SidebarProvider>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
)
