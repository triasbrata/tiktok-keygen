import React from 'react';
import { createRoot } from 'react-dom/client';
import WindowFrame from '@renderer/window/WindowFrame';
import Layout from '@components/Layout';
import '@styles/app.scss';
import '@styles/global.css';
import 'react-data-grid/lib/styles.css';
import '@styles/ui/supabase/code.scss';
import '@styles/ui/supabase/contextMenu.scss';
import '@styles/ui/supabase/date-picker.scss';
import '@styles/ui/supabase/editor.scss';
import '@styles/ui/supabase/grid.scss';
import '@styles/ui/supabase/main.scss';
import '@styles/ui/supabase/monaco.scss';
import '@styles/ui/supabase/toast.scss';
import '@styles/ui/supabase/ui.scss';
import '@styles/ui/build/css/themes/dark.css';
import '@styles/ui/build/css/themes/light.css';
import WrapperProvider from './provider/WrapperProvider';
import Application from '@components/Application';
// Application to Render
const app = (
  <WindowFrame title='Tiktok OBS'>
    <WrapperProvider
      themes={{
        enableSystem: true,
        themes: ['dark', 'light', 'classic-dark'],
        defaultTheme: 'system',
      }}
    >
      <Layout>
        <Application />
      </Layout>
    </WrapperProvider>
  </WindowFrame>
);

// Render application in DOM
createRoot(document.getElementById('app')).render(app);
