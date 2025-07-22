import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          Could not find the requested resource
        </p>
        <Link
          href="/"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
} 