'use client';
import { resetDatabase } from '@/database/db';
import { useOnlineStatus } from '@/hooks';
import { Wifi, WifiOff } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const Navbar = () => {
  const { isOnline } = useOnlineStatus();
  return (
    <nav className='w-full bg-background border-gray-300 sticky top-0 z-10'>
      <div className='flex items-center justify-between px-4 py-2 mx-auto border-b border-gray-300'>
        <Link href='/' className='font-semibold text-2xl text-blue-500'>
          NoteApp
        </Link>
        <ul className='flex gap-2 items-center px-4 py-2 md:flex-row md:space-x-8 md:order-1'>
          <li>
            <Link href='/' className='text-sm font-medium'>
              Home
            </Link>
          </li>
          <li>
            <Link href='/addnote' className='text-sm font-medium'>
              Add Note
            </Link>
          </li>
          <li className='flex items-center gap-2'>
            {isOnline ? (
              <Wifi className='w-5 h-5 text-green-500' />
            ) : (
              <WifiOff className='w-5 h-5 text-red-500' />
            )}
            <span className='text-sm text-gray-500'>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </li>
          {/* <button onClick={resetDatabase}>Reset</button> */}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
