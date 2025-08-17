'use client'

import React, { useState, useEffect } from 'react'
import { profilesService } from '../lib/database'

/**
 * Left sidebar component for account and connections management
 */
export default function LeftSidebar({ 
  isOpen, 
  onClose, 
  user,
  role,
  signOut,
  onRoleChange,
  items = [],
  connectionRequests = [],
  onOnelinersClick,
  onRequestConnection,
  onAcceptConnection,
  onDisconnectConnection,
  onOpenLikesModal,
  onOpenPassedModal,
  className = ''
}) {
  const [activeTab, setActiveTab] = useState('account')
  const [isUpdatingRole, setIsUpdatingRole] = useState(false)
  const [roleUpdateMessage, setRoleUpdateMessage] = useState('')
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [profileUpdateMessage, setProfileUpdateMessage] = useState('')
  const [profile, setProfile] = useState(null)
  const [profileForm, setProfileForm] = useState({
    name: '',
    link: '',
    lookingFor: '',
    profilePicture: null
  })

  // Fetch profile data when sidebar opens
  useEffect(() => {
    const fetchProfile = async () => {
      if (user && isOpen) {
        try {
          const currentProfile = await profilesService.getProfile(user.id)
          setProfile(currentProfile)
          setProfileForm({
            name: currentProfile?.name || '',
            link: currentProfile?.link || '',
            lookingFor: currentProfile?.lookingfor || '',
            profilePicture: currentProfile?.vcphotourl || null
          })
        } catch (error) {
          console.error('Error fetching profile:', error)
          setProfile(null)
          setProfileForm({
            name: '',
            link: '',
            lookingFor: '',
            profilePicture: null
          })
        }
      }
    }

    fetchProfile()
  }, [user, isOpen])

  if (!isOpen) return null

  const tabs = [
    {
      id: 'account',
      label: 'Account',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      badge: null
    },
    {
      id: 'connections',
      label: 'Connections',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      badge: connectionRequests?.length || 0
    }
  ]

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-96 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg
                       border-r border-gray-200/60 dark:border-gray-700/60 shadow-2xl z-50
                       transform transition-transform duration-300 ease-in-out ${
                         isOpen ? 'translate-x-0' : '-translate-x-full'
                       }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/60 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-800/50">
          <h1 className="text-xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 
                         bg-clip-text text-transparent">
            Profile & Connections
          </h1>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 
                       flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200
                       transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-4 bg-gray-50/30 dark:bg-gray-800/30">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 relative flex-1 justify-center ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge > 0 && (
                  <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-1 shadow-lg border-2 border-white">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content area */}
        <div className="overflow-y-auto h-[calc(100vh-140px)]">
          {activeTab === 'account' && (
            <AccountTabContent
              user={user}
              role={role}
              signOut={signOut}
              onRoleChange={onRoleChange}
              items={items}
              onOnelinersClick={onOnelinersClick}
              isUpdatingRole={isUpdatingRole}
              setIsUpdatingRole={setIsUpdatingRole}
              roleUpdateMessage={roleUpdateMessage}
              setRoleUpdateMessage={setRoleUpdateMessage}
              isUpdatingProfile={isUpdatingProfile}
              setIsUpdatingProfile={setIsUpdatingProfile}
              profileUpdateMessage={profileUpdateMessage}
              setProfileUpdateMessage={setProfileUpdateMessage}
              profile={profile}
              setProfile={setProfile}
              profileForm={profileForm}
              setProfileForm={setProfileForm}
            />
          )}

          {activeTab === 'connections' && (
            <ConnectionsTabContent
              connectionRequests={connectionRequests}
              role={role}
              onRequestConnection={onRequestConnection}
              onAcceptConnection={onAcceptConnection}
              onDisconnectConnection={onDisconnectConnection}
              onOpenLikesModal={onOpenLikesModal}
              onOpenPassedModal={onOpenPassedModal}
            />
          )}
        </div>
      </div>
    </>
  )
}

// Account Tab Content Component
function AccountTabContent({ 
  user, 
  role, 
  signOut, 
  onRoleChange, 
  items = [], 
  onOnelinersClick,
  isUpdatingRole,
  setIsUpdatingRole,
  roleUpdateMessage,
  setRoleUpdateMessage,
  isUpdatingProfile,
  setIsUpdatingProfile,
  profileUpdateMessage,
  setProfileUpdateMessage,
  profile,
  setProfile,
  profileForm,
  setProfileForm
}) {
  const handleRoleChange = async (newRole) => {
    if (!user || newRole === role) return
    
    setIsUpdatingRole(true)
    setRoleUpdateMessage('')
    
    try {
      const isLooking = newRole === 'founder'
      
      const updatedProfile = await profilesService.upsertProfile({
        id: user.id,
        isLooking: isLooking,
        name: profile?.name,
        link: profile?.link,
        lookingfor: profile?.lookingfor,
        vcphotourl: profile?.vcphotourl
      })
      
      if (updatedProfile) {
        setRoleUpdateMessage('Role updated successfully!')
        if (onRoleChange) {
          onRoleChange(newRole)
        }
        setTimeout(() => {
          setRoleUpdateMessage('')
        }, 3000)
      } else {
        setRoleUpdateMessage('Failed to update role. Please try again.')
      }
    } catch (error) {
      console.error('Error updating role:', error)
      setRoleUpdateMessage('Error updating role. Please try again.')
    } finally {
      setIsUpdatingRole(false)
    }
  }

  const handleProfileUpdate = async () => {
    if (!user) return
    
    setIsUpdatingProfile(true)
    setProfileUpdateMessage('')
    
    try {
      const updatedProfile = await profilesService.upsertProfile({
        id: user.id,
        isLooking: role === 'founder',
        name: profileForm.name,
        link: profileForm.link,
        lookingfor: profileForm.lookingFor,
        vcphotourl: profileForm.profilePicture
      })
      
      if (updatedProfile) {
        setProfileUpdateMessage('Profile updated successfully!')
        setProfile(updatedProfile)
        setTimeout(() => {
          setProfileUpdateMessage('')
        }, 3000)
      } else {
        setProfileUpdateMessage('Failed to update profile. Please try again.')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setProfileUpdateMessage('Error updating profile. Please try again.')
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Profile Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Profile Information
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Manage your personal details
            </p>
          </div>
          
          {role === 'founder' && (
            <button
              onClick={onOnelinersClick}
              className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 
                         hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-white 
                         rounded-lg font-medium text-sm transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Ideas ({items?.length || 0})
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm
                         focus:ring-2 focus:ring-amber-500 focus:border-transparent
                         transition-all duration-200"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              LinkedIn Profile
            </label>
            <input
              type="url"
              value={profileForm.link}
              onChange={(e) => setProfileForm(prev => ({ ...prev, link: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm
                         focus:ring-2 focus:ring-amber-500 focus:border-transparent
                         transition-all duration-200"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              What I'm Looking For
            </label>
            <textarea
              value={profileForm.lookingFor}
              onChange={(e) => setProfileForm(prev => ({ ...prev, lookingFor: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm
                         focus:ring-2 focus:ring-amber-500 focus:border-transparent
                         transition-all duration-200 resize-none"
              placeholder={role === 'vc' ? "e.g., Early-stage SaaS, FinTech, AI/ML" : "e.g., Seed funding, Series A, Strategic partnerships"}
              rows={3}
            />
          </div>
        </div>

        <button
          onClick={handleProfileUpdate}
          disabled={isUpdatingProfile}
          className="w-full px-4 py-2 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 
                     hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 disabled:opacity-50
                     text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
                     focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        >
          {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
        </button>

        {profileUpdateMessage && (
          <div className={`mt-3 p-3 rounded-lg text-sm font-medium ${
            profileUpdateMessage.includes('successfully') 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
              : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
          }`}>
            {profileUpdateMessage}
          </div>
        )}
      </div>

      {/* Role Management */}
      <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Role Management
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Currently in <span className="font-semibold">{role === 'vc' ? 'VC Mode' : 'Founder Mode'}</span>
          </p>
        </div>

        <div className="space-y-3">
          <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
            role === 'vc' 
              ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20' 
              : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                role === 'vc' ? 'bg-blue-600' : 'bg-gray-400'
              }`}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-2 4h2M9 15h2" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">VC Mode</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">Browse and like founder ideas</p>
              </div>
            </div>
            
            {role !== 'vc' && (
              <button
                onClick={() => handleRoleChange('vc')}
                disabled={isUpdatingRole}
                className="w-full px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg 
                           font-medium text-sm transition-colors duration-200 disabled:opacity-50"
              >
                Switch to VC Mode
              </button>
            )}
            
            {role === 'vc' && (
              <div className="flex items-center justify-center py-2">
                <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">Current Mode</span>
              </div>
            )}
          </div>

          <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
            role === 'founder' 
              ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' 
              : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                role === 'founder' ? 'bg-green-600' : 'bg-gray-400'
              }`}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">Founder Mode</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">Submit ideas and see what VCs like</p>
              </div>
            </div>
            
            {role !== 'founder' && (
              <button
                onClick={() => handleRoleChange('founder')}
                disabled={isUpdatingRole}
                className="w-full px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg 
                           font-medium text-sm transition-colors duration-200 disabled:opacity-50"
              >
                Switch to Founder Mode
              </button>
            )}
            
            {role === 'founder' && (
              <div className="flex items-center justify-center py-2">
                <span className="text-green-600 dark:text-green-400 font-medium text-sm">Current Mode</span>
              </div>
            )}
          </div>
        </div>

        {roleUpdateMessage && (
          <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${
            roleUpdateMessage.includes('successfully') 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
              : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
          }`}>
            {roleUpdateMessage}
          </div>
        )}
      </div>

      {/* Account Info & Sign Out */}
      <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Account Information
          </h3>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400 text-sm">Email:</span>
              <span className="font-medium text-gray-900 dark:text-white text-sm">{user?.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400 text-sm">User ID:</span>
              <span className="font-mono text-xs text-gray-900 dark:text-white">{user?.id?.slice(0, 8)}...</span>
            </div>
          </div>
        </div>

        <button
          onClick={signOut}
          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg 
                     transition-colors duration-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}

// Connections Tab Content Component (simplified for sidebar)
function ConnectionsTabContent({ 
  connectionRequests = [], 
  role, 
  onRequestConnection,
  onAcceptConnection,
  onDisconnectConnection,
  onOpenLikesModal,
  onOpenPassedModal 
}) {
  const [showDetailsId, setShowDetailsId] = useState(null)

  // Sort connections by status priority
  const sortedConnections = connectionRequests.slice().sort((a, b) => {
    if (a.status === b.status) {
      return new Date(b.created_at) - new Date(a.created_at)
    }
    if (a.status === 'pending') return -1
    if (b.status === 'pending') return 1
    if (a.status === 'requested') return -1
    if (b.status === 'requested') return 1
    return 0
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'requested': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'connected': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  return (
    <div className="p-6 space-y-4">
      {/* Header with action buttons */}
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Connections
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Manage your professional connections
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onOpenPassedModal}
            className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700
                       text-gray-700 dark:text-gray-300 rounded-lg font-medium text-sm transition-colors duration-200"
          >
            Passed
          </button>
          <button
            onClick={onOpenLikesModal}
            className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700
                       text-gray-700 dark:text-gray-300 rounded-lg font-medium text-sm transition-colors duration-200"
          >
            Likes
          </button>
        </div>
      </div>

      {/* Connections list */}
      {sortedConnections.length > 0 ? (
        <div className="space-y-3">
          {sortedConnections.map((conn) => (
            <div key={conn.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow duration-200">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                    {role === 'founder' ? (conn.vcName || conn.vc_id) : (conn.founderName || conn.founder_id)}
                  </h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(conn.status)}`}>
                    {conn.status}
                  </span>
                </div>
                
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Idea: {conn.ideaName || conn.idea_id}
                </p>
                
                {(role === 'founder' ? conn.vcLinkedin : conn.founderLinkedin) && (
                  <a
                    href={role === 'founder' ? conn.vcLinkedin : conn.founderLinkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-xs font-medium"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </a>
                )}
                
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(conn.created_at).toLocaleDateString()}
                  </span>
                  
                  {/* Action buttons based on status */}
                  {conn.status === 'pending' && role === 'vc' && (
                    <button
                      onClick={() => onRequestConnection(conn.founder_id, conn.idea_id, 'Let\'s connect!')}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-xs transition-colors duration-200"
                    >
                      Connect
                    </button>
                  )}
                  
                  {conn.status === 'requested' && role === 'founder' && (
                    <button
                      onClick={() => onAcceptConnection(conn.id)}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-xs transition-colors duration-200"
                    >
                      Accept
                    </button>
                  )}
                  
                  {conn.status === 'connected' && (
                    <button
                      onClick={() => setShowDetailsId(conn.id)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-xs transition-colors duration-200"
                    >
                      Details
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">
            No connections yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Start connecting with founders and VCs
          </p>
        </div>
      )}
    </div>
  )
}
