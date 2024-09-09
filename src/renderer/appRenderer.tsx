import React from 'react';
import { createRoot } from 'react-dom/client';
import WindowFrame from '@renderer/window/WindowFrame';
import Application from '@components/Application';
import '@styles/app.scss';
import '@styles/global.scss';
import Dashboard from '@components/Dashboard';
// Application to Render
const app = (
  <WindowFrame title='Tiktok OBS'>
    <Application />
    {/* <TooltipProvider></TooltipProvider> */}
  </WindowFrame>
);

// Render application in DOM
createRoot(document.getElementById('app')).render(app);
