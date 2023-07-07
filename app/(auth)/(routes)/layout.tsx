import type { FC } from 'react';
import React from 'react';

interface LayoutProps {
  children: React.ReactNode
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (<div className='flex items-center justify-center h-full'>
    {children}
  </div>);
}

export default Layout;
