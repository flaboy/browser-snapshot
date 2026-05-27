import type { PageSnapshot, PageTable, RefState, SnapshotRow } from './types.js'

export type BuildPageSnapshotResult = {
  page: PageSnapshot
  refs: Record<string, RefState>
}

export function buildPageSnapshot(rows: SnapshotRow[], url: string, title: string): BuildPageSnapshotResult {
  const groups: Record<string, PageTable> = {}
  const refs: Record<string, RefState> = {}
  let elementIndex = 0
  let textIndex = 0

  const addRow = (group: string, columns: string[], values: unknown[]) => {
    const table = groups[group] ?? { columns: [], rows: [] }
    if (table.columns.length === 0) {
      table.columns = columns
    }
    table.rows.push(values)
    groups[group] = table
  }

  for (const row of rows) {
    const group = row.group.trim() || inferGroup(row)
    let kind: RefState['kind'] = 'element'
    let ref: string
    if (group === 'texts') {
      textIndex += 1
      ref = `t${textIndex}`
      kind = 'text'
    } else {
      elementIndex += 1
      ref = `e${elementIndex}`
    }

    refs[ref] = {
      ref,
      kind,
      role: row.role,
      name: row.name,
      tagName: row.tagName,
      text: row.text,
      selector: row.selector
    }

    const tagName = row.tagName.toUpperCase()
    switch (group) {
      case 'links':
        addRow(group, ['ref', 'tag', 'text', 'href'], [ref, tagName, row.text, row.href])
        break
      case 'buttons':
        addRow(group, ['ref', 'tag', 'text'], [ref, tagName, row.text])
        break
      case 'inputs':
      case 'textareas':
        addRow(group, ['ref', 'tag', 'value', 'placeholder'], [ref, tagName, row.value, row.placeholder])
        break
      case 'selects':
        addRow(group, ['ref', 'tag', 'value'], [ref, tagName, row.value])
        break
      case 'areas':
        addRow(group, ['ref', 'tag', 'text', 'href'], [ref, tagName, row.text, row.href])
        break
      case 'customs':
        addRow(group, ['ref', 'tag', 'role', 'text'], [ref, tagName, row.role, row.text])
        break
      case 'texts':
        addRow(group, ['ref', 'tag', 'text', 'textLength'], [ref, tagName, row.text, row.textLength])
        break
    }
  }

  return {
    page: {
      url,
      title,
      groups
    },
    refs
  }
}

export function inferGroup(row: SnapshotRow): string {
  const explicit = row.group.trim().toLowerCase()
  if (['links', 'buttons', 'inputs', 'textareas', 'selects', 'areas', 'customs', 'texts'].includes(explicit)) {
    return explicit
  }
  switch (row.tagName.trim().toLowerCase()) {
    case 'a':
      return 'links'
    case 'button':
      return 'buttons'
    case 'input':
      return 'inputs'
    case 'textarea':
      return 'textareas'
    case 'select':
      return 'selects'
    case 'area':
      return 'areas'
    default:
      if (row.role.trim() !== '') {
        return 'customs'
      }
      return 'texts'
  }
}
