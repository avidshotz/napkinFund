'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  console.log('AuthContext state:', { user: user?.email, loading })

  useEffect(() => {
    // If supabase is not configured, skip auth
    if (!supabase) {
      console.warn('Supabase not configured - skipping auth')
      setLoading(false)
      return
    }

    let timeoutId

    // Get initial session
    const getSession = async () => {
      try {
        console.log('Getting initial session...')
        const { data: { session } } = await supabase.auth.getSession()
        console.log('Session result:', { hasSession: !!session, user: session?.user?.email })
        
        if (session) {
          // Check if session is expired
          const now = Math.floor(Date.now() / 1000)
          const expiresAt = session.expires_at || 0
          
          if (expiresAt < now) {
            console.log('Session expired, attempting refresh...')
            try {
              const { data: { session: refreshedSession }, error } = await supabase.auth.refreshSession()
              if (error) {
                console.warn('Session refresh failed:', error.message)
                setUser(null)
              } else if (refreshedSession) {
                console.log('Session refreshed successfully')
                setUser(refreshedSession.user)
              } else {
                console.log('No refreshed session returned')
                setUser(null)
              }
            } catch (refreshError) {
              console.warn('Session refresh error:', refreshError.message)
              setUser(null)
            }
          } else {
            console.log('Session is valid')
            setUser(session.user)
          }
        } else {
          console.log('No session found')
          setUser(null)
        }
        
        setLoading(false)
        clearTimeout(timeoutId) // Clear timeout when session is determined
      } catch (error) {
        console.warn('Auth session check failed:', error.message)
        setUser(null)
        setLoading(false)
        clearTimeout(timeoutId) // Clear timeout on error
      }
    }

    // Set a timeout to prevent infinite loading
    timeoutId = setTimeout(() => {
      console.warn('Auth loading timeout - forcing loading to false')
      setLoading(false)
    }, 5000)

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email)
        
        // Only update state for meaningful auth changes, not token refreshes
        if (event === 'TOKEN_REFRESHED') {
          // Don't update state for token refreshes to prevent infinite loops
          console.log('Token refreshed, not updating state')
          return
        }
        
        setUser(session?.user ?? null)
        setLoading(false)
        clearTimeout(timeoutId) // Clear timeout when auth state changes
      }
    )

    return () => {
      clearTimeout(timeoutId)
      subscription?.unsubscribe()
    }
  }, [])

  const signUp = async (email, password) => {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase not configured' } }
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  }

  const signIn = async (email, password) => {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase not configured' } }
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signOut = async () => {
    if (!supabase) {
      return { error: { message: 'Supabase not configured' } }
    }
    console.log('Signing out...')
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setUser(null)
      setLoading(false)
    }
    return { error }
  }

  const signInWithGoogle = async () => {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase not configured' } }
    }
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
    return { data, error }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 