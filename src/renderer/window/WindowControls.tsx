/**
 * Copyright (c) 2021, Guasam
 *
 * This software is provided "as-is", without any express or implied warranty. In no event
 * will the authors be held liable for any damages arising from the use of this software.
 * Read the LICENSE file for more details.
 *
 * @author  : guasam
 * @project : Electron Window
 * @package : Window Controls - Close, Minimize, Maximize (Component)
 */

import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import context from '@main/window/titlebarContextApi';

import ControlButton from './ControlButton';
import { Minus, Moon, Square, Sun, X } from 'lucide-react';
type Props = {
  platform: string;
  tooltips?: boolean;
};

const closePath =
  'M 0,0 0,0.7 4.3,5 0,9.3 0,10 0.7,10 5,5.7 9.3,10 10,10 10,9.3 5.7,5 10,0.7 10,0 9.3,0 5,4.3 0.7,0 Z';
const maximizePath = 'M 0,0 0,10 10,10 10,0 Z M 1,1 9,1 9,9 1,9 Z';
const minimizePath = 'M 0,5 10,5 10,6 0,6 Z';

const WindowControls: React.FC<Props> = (props) => {
  const [darkTheme, setDarkTheme] = useState(true);

  /**
   * On Dark theme change
   */
  useEffect(() => {
    if (darkTheme) {
      localStorage.setItem('dark-mode', '1');
      document.body.classList.add('dark-mode');
    } else {
      localStorage.setItem('dark-mode', '0');
      document.body.classList.remove('dark-mode');
    }
  }, [darkTheme]);

  /**
   * Toggle Theme
   */
  function toggleTheme() {
    setDarkTheme(!darkTheme);
  }
  return (
    <section
      className={classNames(
        'window-titlebar-controls',
        `type-${props.platform}`,
      )}
    >
      <ControlButton
        name='theme'
        onClick={() => toggleTheme()}
        svgIcon={darkTheme ? <Moon size={16} /> : <Sun size={16} />}
        title={props.tooltips ? 'Theme' : null}
      />
      <ControlButton
        name='minimize'
        onClick={() => context.minimize()}
        svgIcon={<Minus size={16} />}
        title={props.tooltips ? 'Minimize' : null}
      />
      <ControlButton
        name='maximize'
        onClick={() => context.toggle_maximize()}
        svgIcon={<Square size={16} />}
        title={props.tooltips ? 'Maximize' : null}
      />
      <ControlButton
        name='close'
        onClick={() => context.exit()}
        svgIcon={<X size={16} />}
        title={props.tooltips ? 'Close' : null}
      />
    </section>
  );
};

export default WindowControls;
