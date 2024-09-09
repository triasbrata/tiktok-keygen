import React from 'react';
import { createRoot } from 'react-dom/client';
import WindowFrame from '@renderer/window/WindowFrame';
import Application from '@components/Application';
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
import { TooltipProvider } from '@components/ui/tooltip';
import { Dashboard } from '@components/Dashboard';
// Application to Render
const app = (
  <WindowFrame title='Tiktok OBS'>
    <TooltipProvider>
      <Application />
    </TooltipProvider>
  </WindowFrame>
);

// Render application in DOM
createRoot(document.getElementById('app')).render(app);
