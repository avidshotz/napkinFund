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
        setUser(session?.user ?? null)
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
    const { error } = await supabase.auth.signOut()
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