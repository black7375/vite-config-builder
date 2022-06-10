# vite-config-builder

A simple builder for Vite setting.

## Installation

```shell
npm install -D vite-config-builder

# or

yarn add -D vite-config-builder
```

## Example

You can refer to [vite.config.ts](./vite.config.ts) in this repository.

```typescript
import { resolve } from "path";
import { defineConfig, ConfigEnv } from "vite";
import { initConfigBuilder, PluginBuilder, ViteEnv } from "./src";
import dts from "vite-plugin-dts";

// == Vite Config =============================================================
// https://vitejs.dev/config/#build-lib
export default (viteConfigEnv: ConfigEnv) => {
  return defineConfig({
    ...userConfig(viteConfigEnv).build(),
    plugins: pluginOption().build()
  });
};

// == Settings ================================================================
function userConfig(viteConfigEnv: ConfigEnv) {
  const configs = initConfigBuilder(viteConfigEnv, {
    build: {
      lib: {
        entry: resolve(__dirname, "src", "index.ts"),
        formats: ["es", "cjs"],
        fileName: format => (format === "es" ? "index.mjs" : "index.cjs")
      }
    },
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

function pluginOption() {
  const options = new PluginBuilder();
  if (ViteEnv.isProdBuild()) {
    options.add(dts());
  }
  return options;
}
```
