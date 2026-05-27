import { describe, expect, it } from 'vitest'
import { validateActionRef } from '../action-ref'
import type { RefState } from '../types'

describe('validateActionRef', () => {
  const elementRef: RefState = { ref: 'e1', kind: 'element', selector: 'button' }
  const textRef: RefState = { ref: 't1', kind: 'text', selector: 'article' }

  it('allows click on element refs', () => {
    expect(validateActionRef('click', elementRef).ok).toBe(true)
  })

  it('rejects click on text refs', () => {
    expect(validateActionRef('click', textRef)).toEqual({ ok: false, code: 'INVALID_REF' })
  })

  it('allows scrollIntoView on text refs', () => {
    expect(validateActionRef('scrollIntoView', textRef).ok).toBe(true)
  })
})
