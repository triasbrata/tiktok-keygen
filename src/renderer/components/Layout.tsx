import Sidebar from './busines/layout/sidebar';
import Header from './busines/layout/header';
import { PropsWithChildren } from 'react';
import { CustomScroll } from 'react-custom-scroll';

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='grid h-full w-full pl-[56px] overflow-hidden  '>
      <Sidebar />
      <div className='flex flex-col'>
        <Header />
        <CustomScroll
          heightRelativeToParent='calc(100%-2px)'
          allowOuterScroll
          className='flex-1 h-full'
        >
          <main className='grid gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3 h-full'>
            {children}
          </main>
        </CustomScroll>
      </div>
    </div>
  );
};

export default Layout;
