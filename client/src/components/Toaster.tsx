import { Toaster as HotToaster } from 'react-hot-toast';

export function Toaster() {
  return (
    <HotToaster 
      position="top-right"
      toastOptions={{
        className: '',
        duration: 3000,
        style: {
          background: 'var(--background)',
          color: 'var(--foreground)',
          border: '1px solid var(--border)',
          padding: '16px',
          borderRadius: '6px',
        },
        success: {
          style: {
            background: 'var(--mint-green-50)',
            borderColor: 'var(--mint-green)',
          },
        },
        error: {
          style: {
            background: 'var(--destructive-50)',
            borderColor: 'var(--destructive)',
          },
          duration: 5000,
        },
      }}
    />
  );
}

export default Toaster; 