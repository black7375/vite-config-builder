import { resolve, join } from "node:path";
import { cwd } from "process";
import { defineConfig, ConfigEnv } from "vite";
import { dtsForEsm, dtsForCjs } from "vite-plugin-dts-build";
import { ModuleKind, ModuleResolutionKind } from "typescript";
import { initConfigBuilder, PluginBuilder, ViteEnv } from "./src/index.js";

const PACKAGE_ROOT = cwd();

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
        entry: resolve(PACKAGE_ROOT, "src", "index.ts"),
        formats: ["es", "cjs"],
        fileName: format => (format === "es" ? join("esm", "index.mjs") : join("cjs", "index.cjs"))
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
    options.add(
      dtsForEsm({
        tsconfigPath: resolve(PACKAGE_ROOT, "tsconfig.lib.json"),
        compilerOptions: {
          tsBuildInfoFile: resolve(PACKAGE_ROOT, ".cache", "typescript", ".tsbuildinfo-mjs")
        }
      }),
      dtsForCjs({ 
        tsconfigPath: resolve(PACKAGE_ROOT, "tsconfig.lib.json"),
        compilerOptions: {
          module: ModuleKind.ES2020,
          moduleResolution: ModuleResolutionKind.Bundler,
          tsBuildInfoFile: resolve(PACKAGE_ROOT, ".cache", "typescript", ".tsbuildinfo-cjs")
        }
      })
    );
  }
  return options;
}
