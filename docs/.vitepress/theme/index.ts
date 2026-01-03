import type { EnhanceAppContext } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import ConfigBuilder from './components/ConfigBuilder.vue'
import ConfigExample from './components/ConfigExample.vue'
import TourConfig from './components/TourConfig.vue'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }: EnhanceAppContext) {
    enhanceAppWithTabs(app)
    app.component('ConfigBuilder', ConfigBuilder)
    app.component('ConfigExample', ConfigExample)
    app.component('TourConfig', TourConfig)
  }
}
