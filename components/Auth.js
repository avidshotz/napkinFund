'use client'

import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import NapkinCard from '../NapkinCard'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const { signIn, signUp, signInWithGoogle } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { error } = isLogin 
        ? await signIn(email, password)
        : await signUp(email, password)

      if (error) {
        setMessage(error.message)
      } else if (!isLogin) {
        setMessage('Check your email for the confirmation link!')
      }
    } catch (error) {
      setMessage('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setMessage('')
    
    try {
      const { error } = await signInWithGoogle()
      if (error) {
        setMessage(error.message)
      }
    } catch (error) {
      setMessage('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <NapkinCard width={500} height={400}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
            {isLogin ? 'Welcome Back' : 'Join Napkin Fund'}
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
          </form>
          
          <div className="mt-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white text-gray-700 py-3 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
          
          {message && (
            <div className={`mt-4 p-3 rounded-md ${
              message.includes('Check your email') 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {message}
            </div>
          )}
          
          <div className="mt-6">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-500 hover:text-blue-600 transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </NapkinCard>
    </div>
  )
} 