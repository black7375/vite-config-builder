import type { ConfigEnv } from "vite";
import dts from "vite-plugin-dts";

import { initConfigBuilder, PluginBuilder, ViteEnv } from "./index";

export function userConfig(viteConfigEnv: ConfigEnv) {
  const configs = initConfigBuilder(viteConfigEnv, {
    
  });
 
  if (ViteEnv.isDevBuild()) {
    configs.add({
      build: {
        sourcemap: true,
        minify: false
      }
    });
  }
  if (ViteEnv.isProdBuild()) {
    configs.add({
      build: {
        sourcemap: false,
        minify: "terser"
      }
    });
  }
  
  return configs;
}

export function pluginOption() {
  const options = new PluginBuilder();
  if (ViteEnv.isProdBuild()) {
    options.add(dts);
  }
  return options;
}
