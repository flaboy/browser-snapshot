import { describe, expect, it } from 'vitest'
import { snapshotScript } from '../snapshot'

describe('browser-snapshot package', () => {
  it('exports a page snapshot script', () => {
    expect(snapshotScript()).toContain('document.querySelectorAll')
  })
})
