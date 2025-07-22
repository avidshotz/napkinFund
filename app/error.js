'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Something went wrong!
        </h2>
        <p className="text-gray-600 mb-6">
          {error.message || 'An unexpected error occurred'}
        </p>
        <button
          onClick={() => reset()}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
} 