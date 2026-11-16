import { describe, expect, test } from 'vitest'
import {
  banExpiresSchema,
  changeEmailSchema,
  changePasswordSchema,
  createUserSchema,
  getUsersSchema,
  profileCallbackPaths,
  updateUserSchema,
} from '@/server/validation/user'

describe('createUserSchema', () => {
  test('rol por defecto student', () => {
    expect(
      createUserSchema.parse({
        name: 'Ana',
        email: 'ana@x.com',
        password: '12345678',
      }).role,
    ).toBe('student')
  })

  test('hace trim de nombre y email', () => {
    const result = createUserSchema.parse({
      name: '  Ana  ',
      email: ' ana@x.com ',
      password: '12345678',
    })
    expect(result).toMatchObject({ name: 'Ana', email: 'ana@x.com' })
  })

  test('rechaza contraseña corta', () => {
    expect(
      createUserSchema.safeParse({
        name: 'Ana',
        email: 'ana@x.com',
        password: '1234567',
      }).success,
    ).toBe(false)
  })

  test('rechaza email inválido y rol desconocido', () => {
    expect(
      createUserSchema.safeParse({
        name: 'A',
        email: 'no-es-email',
        password: '12345678',
      }).success,
    ).toBe(false)
    expect(
      createUserSchema.safeParse({
        name: 'A',
        email: 'a@x.com',
        password: '12345678',
        role: 'root',
      }).success,
    ).toBe(false)
  })
})

describe('updateUserSchema', () => {
  test('acepta una actualización parcial (solo nombre)', () => {
    const result = updateUserSchema.safeParse({
      id: 'u1',
      name: 'Nuevo nombre',
    })
    expect(result.success).toBe(true)
  })

  /**
   * CONTRATO: una actualización parcial no debe cambiar el rol.
   * El schema deriva de createUserSchema con `.partial()`, y en Zod el
   * default de un campo parcial se aplica igual que en el original,
   * inyectando `role: "student"` en updates que no lo enviaron.
   * Si este test falla al revés (role presente), alguien degradó el rol.
   */
  test.fails('no debe inyectar role en una actualización parcial', () => {
    const result = updateUserSchema.parse({ id: 'u1', name: 'Nuevo nombre' })
    expect(result).not.toHaveProperty('role')
  })

  test('rechaza un rol inválido cuando sí se envía', () => {
    expect(updateUserSchema.safeParse({ id: 'u1', role: 'root' }).success).toBe(
      false,
    )
  })
})

describe('banExpiresSchema', () => {
  test('acepta Date y la conserva', () => {
    const date = new Date('2030-01-02T00:00:00.000Z')
    expect(banExpiresSchema.parse(date)).toEqual(date)
  })

  test('acepta fecha ISO (YYYY-MM-DD) y la convierte a Date', () => {
    const result = banExpiresSchema.parse('2030-01-02')
    expect(result).toBeInstanceOf(Date)
    expect(result?.toISOString().startsWith('2030-01-02')).toBe(true)
  })

  test('acepta null y undefined, normalizando a null', () => {
    expect(banExpiresSchema.parse(null)).toBeNull()
    expect(banExpiresSchema.parse(undefined)).toBeNull()
  })

  test('rechaza texto que no es fecha', () => {
    expect(banExpiresSchema.safeParse('ayer').success).toBe(false)
    expect(banExpiresSchema.safeParse(123).success).toBe(false)
  })
})

describe('changePasswordSchema', () => {
  test('acepta cuando confirmPassword coincide', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: 'actual123',
      newPassword: 'nueva12345',
      confirmPassword: 'nueva12345',
    })
    expect(result.success).toBe(true)
  })

  test('rechaza cuando no coinciden', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: 'actual123',
      newPassword: 'nueva12345',
      confirmPassword: 'distinta123',
    })
    expect(result.success).toBe(false)
  })

  test('rechaza nueva contraseña corta', () => {
    expect(
      changePasswordSchema.safeParse({
        currentPassword: 'actual123',
        newPassword: 'corta',
        confirmPassword: 'corta',
      }).success,
    ).toBe(false)
  })
})

describe('changeEmailSchema', () => {
  test('acepta solo las rutas de la lista cerrada', () => {
    for (const path of profileCallbackPaths) {
      expect(
        changeEmailSchema.safeParse({ newEmail: 'a@x.com', callbackPath: path })
          .success,
      ).toBe(true)
    }
  })

  test('callbackPath por defecto es el perfil admin', () => {
    expect(changeEmailSchema.parse({ newEmail: 'a@x.com' }).callbackPath).toBe(
      '/admin/panel/profile',
    )
  })

  test('rechaza rutas arbitrarias (open redirect)', () => {
    for (const path of ['https://malicioso.com', '/otp', '../admin']) {
      expect(
        changeEmailSchema.safeParse({ newEmail: 'a@x.com', callbackPath: path })
          .success,
      ).toBe(false)
    }
  })

  test('rechaza email inválido', () => {
    expect(
      changeEmailSchema.safeParse({ newEmail: 'no-es-email' }).success,
    ).toBe(false)
  })
})

describe('getUsersSchema', () => {
  test('defaults de paginación y conversión de strings', () => {
    expect(getUsersSchema.parse({})).toMatchObject({ page: 1, limit: 10 })
    expect(getUsersSchema.parse({ page: '3', limit: '5' })).toMatchObject({
      page: 3,
      limit: 5,
    })
  })

  test('banned ausente = sin filtro', () => {
    expect(getUsersSchema.parse({})).not.toHaveProperty('banned')
    expect(getUsersSchema.parse({ banned: true })).toMatchObject({
      banned: true,
    })
  })

  test('rechaza limit mayor a 100 y roles desconocidos', () => {
    expect(getUsersSchema.safeParse({ limit: 101 }).success).toBe(false)
    expect(getUsersSchema.safeParse({ role: 'root' }).success).toBe(false)
  })
})
