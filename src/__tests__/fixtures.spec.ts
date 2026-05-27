import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { buildPageSnapshot } from '../build-page-snapshot'
import type { SnapshotRow } from '../types'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '../..')

describe('golden fixtures', () => {
  it('matches sample page and refs output', () => {
    const rows = JSON.parse(readFileSync(resolve(root, 'fixtures/sample-rows.json'), 'utf8')) as SnapshotRow[]
    const expectedPage = JSON.parse(readFileSync(resolve(root, 'fixtures/sample-page.json'), 'utf8'))
    const expectedRefs = JSON.parse(readFileSync(resolve(root, 'fixtures/sample-refs.json'), 'utf8'))

    const { page, refs } = buildPageSnapshot(rows, 'https://example.com', 'Example')

    expect(page).toEqual(expectedPage)
    expect(refs).toEqual(expectedRefs)
  })
})
