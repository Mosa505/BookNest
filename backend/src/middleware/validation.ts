import { Request, Response, NextFunction } from 'express'

/**
 * Validation middleware for common patterns
 */

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 255
}

/**
 * Validate password requirements (min 8 chars, at least 1 uppercase, 1 number, 1 special char)
 */
export const validatePassword = (
  password: string,
): { valid: boolean; message?: string } => {
  if (!password || password.length < 8) {
    return {
      valid: false,
      message: 'Password must be at least 8 characters long',
    }
  }

  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one uppercase letter',
    }
  }

  if (!/[0-9]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one number',
    }
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one special character',
    }
  }

  return { valid: true }
}

/**
 * Validate CEFR level
 */
export const validateCEFRLevel = (level: string): boolean => {
  const validLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
  return validLevels.includes(level)
}

/**
 * Validate pagination parameters
 */
export const validatePagination = (
  limit?: any,
  offset?: any,
): { limit: number; offset: number } => {
  let limitNum = parseInt(limit) || 20
  let offsetNum = parseInt(offset) || 0

  // Enforce limits
  limitNum = Math.max(1, Math.min(limitNum, 100))
  offsetNum = Math.max(0, offsetNum)

  return { limit: limitNum, offset: offsetNum }
}

/**
 * Middleware to validate request body for registration
 */
export const validateRegistration = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { email, password, full_name } = req.body

  // Check required fields
  if (!email || !password || !full_name) {
    res
      .status(400)
      .json({ error: 'Email, password, and full name are required' })
    return
  }

  // Validate email
  if (!validateEmail(email)) {
    res.status(400).json({ error: 'Invalid email format' })
    return
  }

  // Validate password
  const passwordValidation = validatePassword(password)
  if (!passwordValidation.valid) {
    res.status(400).json({ error: passwordValidation.message })
    return
  }

  // Validate full name
  if (
    typeof full_name !== 'string' ||
    full_name.trim().length < 2 ||
    full_name.length > 255
  ) {
    res
      .status(400)
      .json({ error: 'Full name must be between 2 and 255 characters' })
    return
  }

  next()
}

/**
 * Middleware to validate request body for login
 */
export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' })
    return
  }

  if (!validateEmail(email)) {
    res.status(400).json({ error: 'Invalid email format' })
    return
  }

  next()
}

/**
 * Middleware to validate content length
 */
export const validateContentLength = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const maxLengths: { [key: string]: number } = {
    bio: 500,
    content: 5000,
    definition: 1000,
    context_sentence: 1000,
  }

  for (const [field, maxLength] of Object.entries(maxLengths)) {
    if (
      req.body[field] &&
      typeof req.body[field] === 'string' &&
      req.body[field].length > maxLength
    ) {
      res
        .status(400)
        .json({ error: `${field} cannot exceed ${maxLength} characters` })
      return
    }
  }

  next()
}

/**
 * Middleware to validate numeric fields
 */
export const validateNumericFields = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    for (const field of fields) {
      if (
        req.body[field] !== undefined &&
        typeof req.body[field] !== 'number'
      ) {
        res.status(400).json({ error: `${field} must be a number` })
        return
      }
    }
    next()
  }
}

/**
 * Middleware to validate required fields
 */
export const validateRequiredFields = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const missing = fields.filter((field) => !req.body[field])

    if (missing.length > 0) {
      res
        .status(400)
        .json({ error: `Missing required fields: ${missing.join(', ')}` })
      return
    }

    next()
  }
}

/**
 * Middleware to validate query string is not too long
 */
export const validateQueryLength = (maxLength: number = 1000) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const queryString = JSON.stringify(req.query)

    if (queryString.length > maxLength) {
      res
        .status(400)
        .json({ error: `Query string too long (max ${maxLength} characters)` })
      return
    }

    next()
  }
}

/**
 * Middleware to prevent SQL injection attempts
 */
export const sanitizeSQLPatterns = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
    /(-{2}|\/\*|\*\/|;)/,
    /(UNION|JOIN|WHERE)/i,
  ]

  const checkString = (str: string): boolean => {
    if (typeof str !== 'string') return false
    return sqlPatterns.some((pattern) => pattern.test(str))
  }

  // Check query parameters
  for (const [key, value] of Object.entries(req.query)) {
    if (checkString(value as string)) {
      console.warn(`Potential SQL injection attempt in query: ${key}=${value}`)
      res.status(400).json({ error: 'Invalid input detected' })
      return
    }
  }

  next()
}
