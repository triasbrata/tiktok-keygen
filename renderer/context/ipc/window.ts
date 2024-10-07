"use client";

/**
 * Copyright (c) 2021, Guasam
 *
 * This software is provided "as-is", without any express or implied warranty. In no event
 * will the authors be held liable for any damages arising from the use of this software.
 * Read the LICENSE file for more details.
 *
 * @author  : guasam
 * @project : Electron Window
 * @package : Titlebar Context API
 */
import type { TitlebarContextApi } from "@main/window/titlebarContext";
export default (): TitlebarContextApi => {
  if (!window) {
    return {} as TitlebarContextApi;
  }
  return window?.titlebar;
};
