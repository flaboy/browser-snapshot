export type SnapshotRow = {
  selector: string
  group: string
  role: string
  name: string
  text: string
  tagName: string
  href: string
  value: string
  placeholder: string
  textLength: number
}

export type PageTable = {
  columns: string[]
  rows: unknown[][]
}

export type PageSnapshot = {
  url?: string
  title?: string
  groups: Record<string, PageTable>
}

export type RefState = {
  ref: string
  kind: 'element' | 'text'
  role?: string
  name?: string
  text?: string
  tagName?: string
  selector: string
  snapshotId?: string
}
