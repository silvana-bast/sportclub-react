const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const isValidEmail = (value) => EMAIL_REGEX.test(value)

export const isValidPassword = (value) => value.length >= 8

export const isRequired = (value) =>
  value !== undefined && value !== null && String(value).trim().length > 0

export const isPositiveInteger = (value) =>
  Number.isInteger(Number(value)) && Number(value) > 0
