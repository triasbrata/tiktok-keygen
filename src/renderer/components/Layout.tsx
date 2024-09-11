import Sidebar from './busines/layout/sidebar';
import Header from './busines/layout/header';
import { PropsWithChildren } from 'react';

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='grid h-full w-full pl-[56px] overflow-hidden  '>
      <Sidebar />
      <div className='flex flex-col'>
        <Header />
        <main className='grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3'>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
