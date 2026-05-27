import { describe, expect, it } from 'vitest'
import { buildPageSnapshot } from '../build-page-snapshot'
import type { SnapshotRow } from '../types'

describe('buildPageSnapshot', () => {
  it('groups actionable elements and assigns e refs', () => {
    const rows: SnapshotRow[] = [
      { selector: 'button:nth-of-type(1)', group: 'buttons', role: 'button', name: 'Save', text: 'Save', tagName: 'button', href: '', value: '', placeholder: '', textLength: 4 },
      { selector: 'input:nth-of-type(1)', group: 'inputs', role: 'input', name: '', text: '', tagName: 'input', href: '', value: 'abc', placeholder: 'Name', textLength: 0 }
    ]

    const { page, refs } = buildPageSnapshot(rows, 'https://example.com', 'Example')

    expect(page.groups.buttons.rows).toEqual([['e1', 'BUTTON', 'Save']])
    expect(page.groups.inputs.rows).toEqual([['e2', 'INPUT', 'abc', 'Name']])
    expect(refs.e1.selector).toBe('button:nth-of-type(1)')
    expect(refs.e2.kind).toBe('element')
  })

  it('assigns t refs to text rows', () => {
    const rows: SnapshotRow[] = [
      { selector: 'article:nth-of-type(1)', group: 'texts', role: '', name: '', text: 'Readable text block', tagName: 'article', href: '', value: '', placeholder: '', textLength: 19 }
    ]

    const { page, refs } = buildPageSnapshot(rows, 'https://example.com', 'Example')

    expect(page.groups.texts.rows).toEqual([['t1', 'ARTICLE', 'Readable text block', 19]])
    expect(refs.t1.kind).toBe('text')
  })
})
