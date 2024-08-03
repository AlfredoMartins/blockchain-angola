import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Entrance from './screens/Entrance';

const queryClient = new QueryClient()

const App = () => {

  return (
    <div className='flex h-full w-full'>
      <AuthProvider>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
          <Entrance />
          </QueryClientProvider>
        </BrowserRouter>
      </AuthProvider>

    </div>
  );
};

export default App;