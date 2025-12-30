// VitePress data loader - fetches config.example.yaml at build time
export default {
  async load() {
    const url = 'https://raw.githubusercontent.com/mostlygeek/llama-swap/refs/heads/main/config.example.yaml'
    const response = await fetch(url)
    if (!response.ok) {
      console.warn(`Failed to fetch config.example.yaml: ${response.status}`)
      return { configExample: null }
    }
    const configExample = await response.text()
    return { configExample }
  }
}
