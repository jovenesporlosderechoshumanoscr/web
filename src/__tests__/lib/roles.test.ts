import { describe, expect, test } from 'vitest'
import { USER_ROLES, USER_ROLE_LABELS, getRoleLabel } from '@/lib/roles'

describe('USER_ROLES', () => {
  test('los roles del sistema son admin, editor y student', () => {
    expect(USER_ROLES).toEqual(['admin', 'editor', 'student'])
  })

  test('cada rol tiene etiqueta en español', () => {
    for (const role of USER_ROLES) {
      expect(USER_ROLE_LABELS[role]).toBeTruthy()
    }
  })
})

describe('getRoleLabel', () => {
  test('traduce los roles conocidos al español', () => {
    expect(getRoleLabel('admin')).toBe('Administrador')
    expect(getRoleLabel('editor')).toBe('Editor')
    expect(getRoleLabel('student')).toBe('Estudiante')
  })

  test('null/undefined → "Sin rol"', () => {
    expect(getRoleLabel(null)).toBe('Sin rol')
    expect(getRoleLabel(undefined)).toBe('Sin rol')
    expect(getRoleLabel('')).toBe('Sin rol')
  })

  test('un rol desconocido se muestra tal cual', () => {
    expect(getRoleLabel('moderator')).toBe('moderator')
  })
})
