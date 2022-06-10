import type { UserConfig, PluginOption, ConfigEnv } from "vite";
import { merge } from "webpack-merge";

// == Init Config Builder =====================================================
export function initConfigBuilder(
  { command, mode }: ConfigEnv,
  defaultOption: UserConfig = {}
) {
  ViteEnv.set(command, mode);
  return new ConfigBuilder(defaultOption);
}

// == Vite Config Builder =====================================================
interface UserConfigBuilderI<CustomConfig> {
  add: (...configs: CustomConfig[]) => this;
  build: () => CustomConfig;
}

export class ConfigBuilder implements UserConfigBuilderI<UserConfig> {
  private _configs: UserConfig;

  constructor(configs: UserConfig = {}) {
    this._configs = configs;
  }

  add(...configs: UserConfig[]) {
    this._configs = merge<UserConfig>(this._configs, ...configs);
    return this;
  }

  build(): UserConfig {
    return this._configs;
  }
}

export class PluginBuilder implements UserConfigBuilderI<PluginOption> {
  private readonly _plugins: Array<PluginOption>;

  constructor(plugins: PluginOption[] = []) {
    this._plugins = plugins;
  }

  add(...plugins: PluginOption[]) {
    plugins.forEach(plugin => this._plugins.push(plugin));
    return this;
  }

  build(): PluginOption[] {
    return this._plugins;
  }
}

// == Vite Env ================================================================
export class ViteEnv {
  private static COMMAND: ConfigEnv["command"] = "build";
  private static MODE: ConfigEnv["mode"] =
    process.env.NODE_ENV || "development";

  public static set(command: ConfigEnv["command"], mode: ConfigEnv["mode"]) {
    ViteEnv.COMMAND = command;
    ViteEnv.MODE = mode;
  }
  public static getCommand() {
    return ViteEnv.COMMAND;
  }
  public static getMode() {
    return ViteEnv.MODE;
  }

  public static is(command: ConfigEnv["command"], mode: ConfigEnv["mode"]) {
    return ViteEnv.COMMAND === command && ViteEnv.MODE === mode;
  }
  public static isBuild() {
    return ViteEnv.COMMAND === "build";
  }
  public static isServe() {
    return ViteEnv.COMMAND === "serve";
  }
  public static isDev() {
    return ViteEnv.MODE === "development";
  }
  public static isProd() {
    return ViteEnv.MODE === "production";
  }
  public static isDevBuild() {
    return ViteEnv.is("build", "development");
  }
  public static isProdBuild() {
    return ViteEnv.is("build", "production");
  }
  public static isTest() {
    return this.is("serve", "test");
  }
}
