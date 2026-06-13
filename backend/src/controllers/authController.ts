import { Request, Response } from 'express'
import { supabase, supabaseAdmin } from '../config/supabase'

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, full_name } = req.body

    if (!email || !password || !full_name) {
      res
        .status(400)
        .json({ error: 'Email, password, and full name are required' })
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Invalid email format' })
      return
    }

    const { error: signUpError, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name },
      },
    })

    if (signUpError) {
      const status = signUpError.status === 400 || signUpError.status === 409 ? signUpError.status : 400
      res.status(status).json({ error: signUpError.message })
      return
    }
    if (!data.user) throw new Error('User creation failed')

    await supabaseAdmin.from('auth_users').insert({
      id: data.user.id,
      email,
      password_hash: 'managed-by-supabase-auth',
      full_name,
    })

    await supabaseAdmin.from('profiles').insert({
      id: data.user.id,
      email,
      full_name,
      cefr_level: 'A1',
    })

    const session = data.session
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          full_name,
        },
        tokens: {
          accessToken: session?.access_token,
          refreshToken: session?.refresh_token,
        },
      },
    })
  } catch (error: any) {
    console.error('Error registering user:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' })
      return
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      const status = error.status === 400 || error.status === 401 ? 401 : 500
      res.status(status).json({ error: error.message })
      return
    }
    if (!data.user || !data.session) {
      res.status(401).json({ error: 'Invalid email or password' })
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, is_admin')
      .eq('id', data.user.id)
      .single()

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          full_name: profile?.full_name,
          isAdmin: profile?.is_admin || false,
        },
        tokens: {
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
        },
      },
    })
  } catch (error: any) {
    console.error('Error logging in:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
}

export const refreshToken = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { refreshToken: token } = req.body

    if (!token) {
      res.status(400).json({ error: 'Refresh token is required' })
      return
    }

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: token,
    })

    if (error || !data.session) {
      res.status(401).json({ error: 'Invalid refresh token' })
      return
    }

    res.json({
      success: true,
      data: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
      },
    })
  } catch (error: any) {
    console.error('Error refreshing token:', error)
    res.status(401).json({ error: 'Invalid refresh token' })
  }
}

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error

    res.json({
      success: true,
      message: 'Logout successful',
    })
  } catch (error: any) {
    console.error('Error logging out:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
}

export const getAuthStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.json({ authenticated: false })
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, is_admin, created_at')
      .eq('id', req.user.id)
      .single()

    if (!profile) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    res.json({
      authenticated: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        full_name: profile.full_name,
        isAdmin: profile.is_admin,
      },
    })
  } catch (error: any) {
    console.error('Error checking auth status:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
}

export const requestPasswordReset = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email } = req.body

    if (!email) {
      res.status(400).json({ error: 'Email is required' })
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL}/reset-password`,
    })

    if (error) {
      res.json({
        success: true,
        message: 'If email exists, reset link has been sent',
      })
      return
    }

    res.json({
      success: true,
      message: 'Password reset link sent to email',
    })
  } catch (error: any) {
    console.error('Error requesting password reset:', error)
    res.json({
      success: true,
      message: 'If email exists, reset link has been sent',
    })
  }
}

export const resetPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { newPassword } = req.body

    if (!newPassword) {
      res.status(400).json({ error: 'New password is required' })
      return
    }

    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' })
      return
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) throw error

    res.json({
      success: true,
      message: 'Password updated successfully',
    })
  } catch (error: any) {
    console.error('Error resetting password:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
}