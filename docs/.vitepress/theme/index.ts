import DefaultTheme from 'vitepress/theme'
import './style.css'
import ConfigBuilder from './components/ConfigBuilder.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ConfigBuilder', ConfigBuilder)
  }
}
