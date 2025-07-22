'use client'

import { useState, useEffect } from 'react'
import PdfsList from './PdfsList'
import NapkinModal from './NapkinModal'
import { profilesService } from '../lib/database'

export default function AccountModal({ 
  isOpen, 
  onClose, 
  items, 
  onEdit, 
  onDelete,
  role = 'founder',
  user,
  onRoleChange,
  signOut,
  onOnelinersClick
}) {
  console.log('AccountModal props:', { isOpen, role, user: user?.id, itemsLength: items?.length })
  
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

  // Add escape key functionality
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => {
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [isOpen, onClose])

  // Fetch current profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (user && isOpen) {
        try {
          console.log('Fetching profile for user:', user.id)
          const currentProfile = await profilesService.getProfile(user.id)
          console.log('Fetched profile:', currentProfile)
          setProfile(currentProfile)
          setProfileForm({
            name: currentProfile?.name || '',
            link: currentProfile?.link || '',
            lookingFor: currentProfile?.lookingfor || '',
            profilePicture: currentProfile?.vcphotourl || null
          })
        } catch (error) {
          console.error('Error fetching profile:', error)
          // Set default values if profile fetch fails
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
  }, [user?.id, isOpen])

  const handleRoleChange = async (newRole) => {
    if (!user || newRole === role) return
    
    setIsUpdatingRole(true)
    setRoleUpdateMessage('')
    
    try {
      // Convert role to isLooking boolean
      const isLooking = newRole === 'founder'
      
      // Update the user's profile
      const updatedProfile = await profilesService.upsertProfile({
        id: user.id,
        isLooking: isLooking,
        // Preserve other profile fields if they exist
        name: profile?.name,
        link: profile?.link,
        lookingfor: profile?.lookingfor,
        vcphotourl: profile?.vcphotourl
      })
      
      if (updatedProfile) {
        setRoleUpdateMessage('Role updated successfully!')
        // Call the parent's onRoleChange function to update the UI
        if (onRoleChange) {
          onRoleChange(newRole)
        }
        // Close modal after a short delay
        setTimeout(() => {
          onClose()
        }, 1500)
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
        // Close modal after a short delay
        setTimeout(() => {
          onClose()
        }, 1500)
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

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // For now, we'll store the file name as a placeholder
      // In a real implementation, you'd upload to Supabase Storage
      setProfileForm(prev => ({
        ...prev,
        profilePicture: file.name
      }))
    }
  }

  if (!isOpen) return null

  // Safety check for required props
  if (!user) {
    console.error('AccountModal: user prop is required')
    return null
  }

  console.log('AccountModal rendering with isOpen:', isOpen)

  // Create custom header for founders with oneliners button
  const customHeader = role === 'founder' ? (
    <div className="flex-1 flex items-center justify-between">
      <div></div> {/* Empty div for spacing */}
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-800">Account Settings</h2>
        <p className="text-sm text-gray-600 mt-1">Manage your profile and preferences.</p>
      </div>
      <button
        onClick={onOnelinersClick}
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
      >
        Oneliners ({items?.length || 0})
      </button>
    </div>
  ) : null

  return (
    <NapkinModal
      isOpen={isOpen}
      onClose={onClose}
      title="Account Settings"
      description="Manage your profile and preferences."
      width={700}
      height={700}
      customHeader={customHeader}
    >
      <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
        {/* Profile Information Section */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Profile Information</h3>
          
          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
              />
            </div>

            {/* LinkedIn Profile (for both founders and VCs) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  value={profileForm.link}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, link: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>

            {/* What I'm Looking For */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What I&apos;m Looking For
              </label>
              <textarea
                value={profileForm.lookingFor}
                onChange={(e) => setProfileForm(prev => ({ ...prev, lookingFor: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={role === 'vc' ? "e.g., Early-stage SaaS, FinTech, AI/ML" : "e.g., Seed funding, Series A, Strategic partnerships"}
                rows={3}
              />
            </div>

            {/* Profile Picture (VCs only) */}
            {role === 'vc' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {profileForm.profilePicture && (
                  <p className="text-sm text-gray-600 mt-1">
                    Selected: {profileForm.profilePicture}
                  </p>
                )}
              </div>
            )}

            {/* Update Profile Button */}
          <button
              onClick={handleProfileUpdate}
              disabled={isUpdatingProfile}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
              {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
          </button>

            {profileUpdateMessage && (
              <div className={`p-2 rounded text-sm ${
                profileUpdateMessage.includes('successfully') 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-red-50 text-red-700'
              }`}>
                {profileUpdateMessage}
              </div>
            )}
          </div>
        </div>
        
          {/* Role Management Section */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Role Management</h3>
            <p className="text-gray-600 text-sm mb-4">
              You are currently in <span className="font-medium">{role === 'vc' ? 'VC Mode' : 'Founder Mode'}</span>
            </p>
            
            <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                <h4 className="font-medium text-gray-800">VC Mode</h4>
                  <p className="text-sm text-gray-600">Browse and like founder ideas</p>
                </div>
                <button
                  onClick={() => handleRoleChange('vc')}
                  disabled={role === 'vc' || isUpdatingRole}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    role === 'vc'
                      ? 'bg-blue-500 text-white cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {role === 'vc' ? 'Current' : 'Switch to VC'}
                </button>
              </div>
              
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                <h4 className="font-medium text-gray-800">Founder Mode</h4>
                  <p className="text-sm text-gray-600">Submit ideas and see what VCs like</p>
                </div>
                <button
                  onClick={() => handleRoleChange('founder')}
                  disabled={role === 'founder' || isUpdatingRole}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    role === 'founder'
                      ? 'bg-green-500 text-white cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {role === 'founder' ? 'Current' : 'Switch to Founder'}
                </button>
              </div>
            </div>
            
            {isUpdatingRole && (
              <div className="mt-3 p-2 bg-blue-50 text-blue-700 rounded text-sm">
                Updating role...
              </div>
            )}
            
            {roleUpdateMessage && (
              <div className={`mt-3 p-2 rounded text-sm ${
                roleUpdateMessage.includes('successfully') 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-red-50 text-red-700'
              }`}>
                {roleUpdateMessage}
              </div>
            )}
          </div>

          {/* Account Information Section */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Account Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
              <span className="font-medium text-gray-800">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">User ID:</span>
              <span className="font-mono text-sm text-gray-800">{user?.id}</span>
              </div>
            </div>
          </div>

          {/* Sign Out Button */}
          <div className="pt-6 flex justify-end">
            <button
              onClick={signOut}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
            >
              Sign Out
            </button>
            </div>
        </div>
    </NapkinModal>
  )
} 