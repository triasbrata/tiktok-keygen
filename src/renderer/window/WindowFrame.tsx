/**
 * Copyright (c) 2021, Guasam
 *
 * This software is provided "as-is", without any express or implied warranty. In no event
 * will the authors be held liable for any damages arising from the use of this software.
 * Read the LICENSE file for more details.
 *
 * @author  : guasam
 * @project : Electron Window
 * @package : Window Frame (Component)
 */

import React, { useEffect, useRef, useState } from 'react';
import Titlebar from './Titlebar';
import logo from '@assets/images/logo.png';
import context from '@main/window/titlebarContextApi';

type Props = {
  title?: string;
  borderColor?: string;
  children: React.ReactNode;
};

type Context = {
  platform: 'windows' | 'mac';
};

export const WindowContext = React.createContext<Context>({
  platform: 'windows',
});

const WindowFrame: React.FC<Props> = (props) => {
  const itsRef = useRef<HTMLDivElement>(null);
  const [platform, setPlatform] = useState<'windows' | 'mac'>('windows');

  useEffect(() => {
    context.os().then((res) => {
      setPlatform(res);
    });
    const { parentElement } = itsRef.current;
    parentElement.classList.add('has-electron-window');
    parentElement.classList.add('has-border');

    // Apply border color if prop given
    if (props.borderColor) {
      parentElement.style.borderColor = props.borderColor;
    }
  }, []);

  return (
    <WindowContext.Provider value={{ platform: platform }}>
      {/* Reference creator */}
      <div className='start-electron-window' ref={itsRef}></div>
      {/* Window Titlebar */}
      <Titlebar
        platform={platform}
        title={props.title ?? 'Electron Window'}
        mode='centered-title'
        icon={logo}
      />
      {/* Window Content (Application to render) */}
      <div className='window-content'>{props.children}</div>
    </WindowContext.Provider>
  );
};

export default WindowFrame;
