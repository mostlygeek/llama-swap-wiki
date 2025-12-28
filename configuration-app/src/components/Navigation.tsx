export default function Navigation() {
  return (
    <nav className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold">llama-swap</a>
          </div>
          <div className="flex space-x-4">
            <a href="/" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">Home</a>
            <a href="/getting-started/" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">Getting Started</a>
            <a href="/configuration/" className="bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">Configuration</a>
            <a href="https://github.com/mostlygeek/llama-swap" target="_blank" rel="noopener" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">GitHub</a>
          </div>
        </div>
      </div>
    </nav>
  );
}
