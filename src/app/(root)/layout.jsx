import Navbar from '@/components/navbar';
import React from 'react';

const Layout = ({ children }) => {
  return (
    <main className='w-full min-h-screen'>
      <Navbar />
      {children}
    </main>
  );
};

export default Layout;
