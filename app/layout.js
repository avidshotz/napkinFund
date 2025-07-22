import './globals.css'
import { AuthProvider } from '../contexts/AuthContext'

export const metadata = {
  title: 'Napkin Fund',
  description: 'A beautiful napkin card interface',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
} 