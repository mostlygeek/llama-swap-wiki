import Editor from '@monaco-editor/react'

interface YamlEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function YamlEditor({ value, onChange }: YamlEditorProps) {
  return (
    <div className="h-[600px]">
      <Editor
        height="100%"
        defaultLanguage="yaml"
        value={value}
        onChange={(value) => onChange(value || '')}
        theme="vs-light"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          wrappingIndent: 'indent',
          automaticLayout: true,
        }}
      />
    </div>
  )
}
