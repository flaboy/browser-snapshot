import type { RefState } from './types'

export type ValidateActionRefResult =
  | { ok: true }
  | { ok: false; code: 'INVALID_REF' | 'INVALID_ACTION' }

export function validateActionRef(action: string, ref: RefState): ValidateActionRefResult {
  switch (action) {
    case 'scrollIntoView':
      return { ok: true }
    case 'click':
    case 'doubleClick':
    case 'hover':
    case 'type':
    case 'fill':
    case 'press':
    case 'select':
    case 'waitFor':
      if (ref.kind !== 'element') {
        return { ok: false, code: 'INVALID_REF' }
      }
      return { ok: true }
    default:
      return { ok: false, code: 'INVALID_ACTION' }
  }
}
