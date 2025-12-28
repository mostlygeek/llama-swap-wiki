import { examples } from '../examples'

interface ExampleSelectorProps {
  selectedExample: string
  onExampleChange: (exampleId: string) => void
}

export default function ExampleSelector({ selectedExample, onExampleChange }: ExampleSelectorProps) {
  return (
    <div>
      <label htmlFor="example-select" className="block text-sm font-medium text-gray-700 mb-2">
        Choose an example configuration:
      </label>
      <select
        id="example-select"
        value={selectedExample}
        onChange={(e) => onExampleChange(e.target.value)}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
      >
        {examples.map((example) => (
          <option key={example.id} value={example.id}>
            {example.name}
          </option>
        ))}
      </select>
      <p className="mt-2 text-sm text-gray-500">
        {examples.find(e => e.id === selectedExample)?.description}
      </p>
    </div>
  )
}
