import { describe, expect, it } from 'vitest'
import { isValidPhone, phoneToChatId } from '../src/utils/phone'

describe('phoneToChatId', () => {
  it('убирает всё, кроме цифр, и добавляет @c.us', () => {
    expect(phoneToChatId('+7 (999) 123-45-67')).toBe('79991234567@c.us')
  })
  it('работает с чистыми цифрами', () => {
    expect(phoneToChatId('79991234567')).toBe('79991234567@c.us')
  })
})

describe('isValidPhone', () => {
  it('принимает 11-значный номер', () => {
    expect(isValidPhone('7 999 123 45 67')).toBe(true)
  })
  it('отклоняет слишком короткий', () => {
    expect(isValidPhone('12345')).toBe(false)
  })
  it('отклоняет слишком длинный', () => {
    expect(isValidPhone('1234567890123456')).toBe(false)
  })
})
