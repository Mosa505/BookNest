import { Request, Response, NextFunction } from 'express'
import { UserResponse } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'
import { supabaseAdmin } from '../config/supabase'

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
        isAdmin?: boolean
      }
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || process.env.SUPABASE_JWT_SECRET || ''

interface JwtPayload {
  sub: string
  email: string
  aud?: string
  role?: string
  exp?: number
  iat?: number
}

const verifyTokenLocally = (token: string): { id: string; email: string } | null => {
  if (!JWT_SECRET) return null

  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    }) as JwtPayload

    if (!decoded.sub || !decoded.email) return null

    return { id: decoded.sub, email: decoded.email }
  } catch {
    return null
  }
}

const retryGetUser = async (token: string, retries = 2, delay = 500): Promise<UserResponse> => {
  for (let i = 0; i <= retries; i++) {
    try {
      return await supabaseAdmin.auth.getUser(token) as UserResponse
    } catch (err) {
      if (i === retries) throw err
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
    }
  }
  throw new Error('Failed to get user after retries')
}

const fetchProfile = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single()
    if (error) {
      console.error('Profile fetch error:', error.message)
      return false
    }
    return data?.is_admin || false
  } catch (err: any) {
    console.error('Profile fetch error:', err.message)
    return false
  }
}

export const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    res.status(401).json({ error: 'Authorization header required' })
    return
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
    res.status(401).json({ error: 'Token required' })
    return
  }

  try {
    // Try local JWT verification first (fast, works offline)
    let userId = ''
    let userEmail = ''

    const localUser = verifyTokenLocally(token)
    if (localUser) {
      userId = localUser.id
      userEmail = localUser.email
    } else {
      // Fall back to remote Supabase auth verification
      const result: UserResponse = await retryGetUser(token)
      const { data, error } = result

      if (error || !data.user) {
        res.status(401).json({ error: 'Invalid or expired token' })
        return
      }

      userId = data.user.id
      userEmail = data.user.email || ''
    }

    const isAdmin = await fetchProfile(userId)

    req.user = {
      id: userId,
      email: userEmail,
      isAdmin,
    }
    next()
  } catch (err: any) {
    console.error('Auth middleware error:', {
      message: err.message,
      code: err?.cause?.code || 'UNKNOWN',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    })
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.user?.isAdmin) {
    res.status(403).json({ error: 'Admin access required' })
    return
  }
  next()
}
