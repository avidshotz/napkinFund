'use client'

export default function AppLayout({ 
  children, 
  role, 
  user, 
  signOut, 
  creativeIdeas, 
  handleEditPdf, 
  handleDeletePdf,
  onRoleChange
}) {
  return (
    <div className="min-h-screen">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-6 py-3 z-30">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-800">
              Napkin Reborn
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {user.email}
            </span>
            
            <span className={`px-3 py-1 rounded-md font-medium text-sm ${
              role === 'vc' 
                ? 'bg-blue-500 text-white' 
                : 'bg-green-500 text-white'
            }`}>
              {role === 'vc' ? 'VC Mode' : 'Founder Mode'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20">
        {children}
      </div>
    </div>
  )
} 