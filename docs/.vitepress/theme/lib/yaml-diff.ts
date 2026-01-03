// Simple line-based diff computation for YAML configs

export interface DiffLine {
  content: string
  lineNumber: number
  status: 'unchanged' | 'added'
}

export interface DiffResult {
  lines: DiffLine[]
  changedLineNumbers: Set<number>
  firstChangedLine: number | null
}

/**
 * Computes a simple line-based diff between two YAML configurations.
 * Lines that exist in current but not in previous are marked as 'added'.
 *
 * This is a simple approach that works well for cumulative configs
 * where each step adds new sections without modifying existing lines.
 */
export function computeYamlDiff(
  previousYaml: string | undefined,
  currentYaml: string
): DiffResult {
  const currLines = currentYaml.split('\n')

  // If no previous config, all lines are "new"
  if (!previousYaml) {
    const changedLineNumbers = new Set(currLines.map((_, i) => i + 1))
    return {
      lines: currLines.map((content, i) => ({
        content,
        lineNumber: i + 1,
        status: 'added'
      })),
      changedLineNumbers,
      firstChangedLine: currLines.length > 0 ? 1 : null
    }
  }

  const prevLines = new Set(previousYaml.split('\n'))
  const result: DiffLine[] = []
  const changedLineNumbers = new Set<number>()
  let firstChangedLine: number | null = null

  for (let i = 0; i < currLines.length; i++) {
    const line = currLines[i]
    const lineNum = i + 1

    // Check if this exact line existed in previous config
    const isNew = !prevLines.has(line)

    result.push({
      content: line,
      lineNumber: lineNum,
      status: isNew ? 'added' : 'unchanged'
    })

    if (isNew) {
      changedLineNumbers.add(lineNum)
      if (firstChangedLine === null) {
        firstChangedLine = lineNum
      }
    }
  }

  return { lines: result, changedLineNumbers, firstChangedLine }
}
