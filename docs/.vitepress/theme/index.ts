import type { EnhanceAppContext } from "vitepress";
import DefaultTheme from "vitepress/theme";
import "./style.css";
import ConfigExplorer from "./components/ConfigExplorer.vue";
import { enhanceAppWithTabs } from "vitepress-plugin-tabs/client";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }: EnhanceAppContext) {
    enhanceAppWithTabs(app);
    app.component("ConfigExplorer", ConfigExplorer);
  },
};
