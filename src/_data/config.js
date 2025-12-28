export default async function() {
  const configUrl = 'https://raw.githubusercontent.com/mostlygeek/llama-swap/main/config.example.yaml';
  const readmeUrl = 'https://raw.githubusercontent.com/mostlygeek/llama-swap/main/README.md';

  try {
    const [configResponse, readmeResponse] = await Promise.all([
      fetch(configUrl),
      fetch(readmeUrl)
    ]);

    const configText = await configResponse.text();
    const readmeText = await readmeResponse.text();

    return {
      example: configText,
      readme: readmeText,
      url: 'https://github.com/mostlygeek/llama-swap'
    };
  } catch (error) {
    console.error('Error fetching llama-swap data:', error);
    return {
      example: '# Error fetching config.example.yaml',
      readme: '# Error fetching README.md',
      url: 'https://github.com/mostlygeek/llama-swap'
    };
  }
}
