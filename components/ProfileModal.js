'use client'

import React, { useState, useEffect } from 'react'
import { profilesService } from '../lib/database'

/**
 * Profile management modal
 */
export default function ProfileModal({ 
  isOpen, 
  onClose, 
  user,
  role,
  signOut,
  onRoleChange,
  items = [],
  onOnelinersClick
}) {

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [profileUpdateMessage, setProfileUpdateMessage] = useState('')
  const [profile, setProfile] = useState(null)
  const [profileForm, setProfileForm] = useState({
    name: '',
    link: '',
    lookingFor: '',
    profilePicture: null
  })

  // Fetch profile data when modal opens
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200/60 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between p-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 
                           bg-clip-text text-transparent">
              Profile Management
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
        </div>

        {/* Content area */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-8 space-y-8">
          {/* Profile Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Profile Information
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Manage your personal details and preferences
                </p>
              </div>
              
              {role === 'founder' && (
                <button
                  onClick={onOnelinersClick}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 
                             hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-white 
                             rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Ideas ({items?.length || 0})
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 
                               bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                               focus:ring-2 focus:ring-amber-500 focus:border-transparent
                               transition-all duration-200"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    value={profileForm.link}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, link: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 
                               bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                               focus:ring-2 focus:ring-amber-500 focus:border-transparent
                               transition-all duration-200"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    What I'm Looking For
                  </label>
                  <textarea
                    value={profileForm.lookingFor}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, lookingFor: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 
                               bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                               focus:ring-2 focus:ring-amber-500 focus:border-transparent
                               transition-all duration-200 resize-none"
                    placeholder={role === 'vc' ? "e.g., Early-stage SaaS, FinTech, AI/ML" : "e.g., Seed funding, Series A, Strategic partnerships"}
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleProfileUpdate}
              disabled={isUpdatingProfile}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 
                         hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 disabled:opacity-50
                         text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
                         focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
              {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
            </button>

            {profileUpdateMessage && (
              <div className={`mt-3 p-3 rounded-xl text-sm font-medium ${
                profileUpdateMessage.includes('successfully') 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                  : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
              }`}>
                {profileUpdateMessage}
              </div>
            )}
          </div>

          {/* Account Role */}
          <div className="space-y-6 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                account role
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                your role was set during onboarding and cannot be changed
              </p>
            </div>

            <div className="max-w-md">
              <div className={`p-6 rounded-2xl border-2 ${
                role === 'vc' 
                  ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20' 
                  : 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    role === 'vc' ? 'bg-blue-600' : 'bg-green-600'
                  }`}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {role === 'vc' ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-2 4h2M9 15h2" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      )}
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {role === 'vc' ? 'investor mode' : 'founder mode'}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {role === 'vc' 
                        ? 'browse and like founder ideas, discover investment opportunities' 
                        : 'submit ideas and connect with interested investors'
                      }
                    </p>
                    <div className={`inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full text-xs font-medium ${
                      role === 'vc'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                        : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        role === 'vc' ? 'bg-blue-500' : 'bg-green-500'
                      }`}></div>
                      current role
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    role locked for security
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                    to maintain platform integrity, users cannot switch between founder and investor roles after onboarding.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Info & Sign Out */}
          <div className="space-y-6 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Account Information
              </h3>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Email:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{user?.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">User ID:</span>
                  <span className="font-mono text-sm text-gray-900 dark:text-white">{user?.id?.slice(0, 8)}...</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={signOut}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl 
                           transition-colors duration-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
