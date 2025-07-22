'use client'

import { useState, useEffect } from 'react'
import PdfsList from './PdfsList'
import NapkinModal from './NapkinModal'
import ModalItem from './ModalItem'
import { profilesService } from '../lib/database'

// ============================================================================
// LIKES MODAL
// ============================================================================
export class LikesModal {
  constructor({ isOpen, onClose, items, onUnlike }) {
    this.isOpen = isOpen;
    this.onClose = onClose;
    this.items = items;
    this.onUnlike = onUnlike;
  }

  render() {
    const unlikeIcon = (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    );

    return (
      <NapkinModal
        isOpen={this.isOpen}
        onClose={this.onClose}
        title="Likes"
        description="Your liked ideas."
        width={600}
        height={500}
      >
        {this.items.length > 0 ? (
          <div className="space-y-3">
            {this.items.map((item) => (
              <ModalItem
                key={item.id}
                item={item}
                onAction={this.onUnlike}
                actionIcon={unlikeIcon}
                actionTitle="Unlike this item"
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-500 text-center">No liked ideas yet.</p>
          </div>
        )}
      </NapkinModal>
    );
  }
}

// ============================================================================
// SUBMITTED IDEAS MODAL
// ============================================================================
export class SubmittedIdeasModal {
  constructor({ isOpen, onClose, items, onUnlike }) {
    this.isOpen = isOpen;
    this.onClose = onClose;
    this.items = items;
    this.onUnlike = onUnlike;
  }

  render() {
    const deleteIcon = (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    );

    return (
      <NapkinModal
        isOpen={this.isOpen}
        onClose={this.onClose}
        title="Your Submitted Ideas"
        description="Ideas you've submitted for VCs to see."
        width={600}
        height={500}
      >
        {this.items.length > 0 ? (
          <div className="space-y-3">
            {this.items.map((item) => (
              <ModalItem
                key={item.id}
                item={item}
                onAction={this.onUnlike}
                actionIcon={deleteIcon}
                actionTitle="Delete this idea"
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-500 text-center">No submitted ideas yet.</p>
          </div>
        )}
      </NapkinModal>
    );
  }
}

// ============================================================================
// VC LIKES MODAL
// ============================================================================
export class VCLikesModal {
  constructor({ isOpen, onClose, vcsWithLikedIdeas, onLikeVC }) {
    this.isOpen = isOpen;
    this.onClose = onClose;
    this.vcsWithLikedIdeas = vcsWithLikedIdeas;
    this.onLikeVC = onLikeVC;
  }

  render() {
    return (
      <NapkinModal
        isOpen={this.isOpen}
        onClose={this.onClose}
        title="Likes"
        description="VCs who liked your ideas."
        width={600}
        height={500}
      >
        {this.vcsWithLikedIdeas.length > 0 ? (
          <div className="space-y-3">
            {this.vcsWithLikedIdeas.map((vc) => (
              <div key={vc.vcId} className="p-3 bg-white rounded border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1 text-center">
                    <p className="text-sm font-medium text-gray-800">
                      {vc.vcName}
                    </p>
                    {vc.vcLinkedin && (
                      <p className="text-xs text-blue-600">
                        <a href={vc.vcLinkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          LinkedIn
                        </a>
                      </p>
                    )}
                  </div>
                  <button 
                    onClick={() => this.onLikeVC(vc.vcId, vc.vcName, vc.likedIdeas[0]?.id)}
                    className="text-blue-500 hover:text-blue-700 transition-colors ml-3 p-1"
                    title="Like this VC"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
                <div className="text-xs text-gray-600 text-center">
                  <p>Liked: {vc.likedIdeas[0]?.idea_name}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-500 text-center">No VCs have liked your ideas yet.</p>
          </div>
        )}
      </NapkinModal>
    );
  }
}

// ============================================================================
// ACCOUNT MODAL
// ============================================================================
export class AccountModal {
  constructor({ isOpen, onClose, items, onEdit, onDelete, role, user, onRoleChange }) {
    this.isOpen = isOpen;
    this.onClose = onClose;
    this.items = items;
    this.onEdit = onEdit;
    this.onDelete = onDelete;
    this.role = role;
    this.user = user;
    this.onRoleChange = onRoleChange;
    
    this.state = {
      isUpdatingRole: false,
      roleUpdateMessage: '',
      isUpdatingProfile: false,
      profileUpdateMessage: '',
      profile: null,
      profileForm: {
        name: '',
        link: '',
        lookingFor: '',
        profilePicture: null
      }
    };
  }

  async fetchProfile() {
    if (this.user && this.isOpen) {
      try {
        console.log('Fetching profile for user:', this.user.id);
        const currentProfile = await profilesService.getProfile(this.user.id);
        console.log('Fetched profile:', currentProfile);
        this.state.profile = currentProfile;
        this.state.profileForm = {
          name: currentProfile?.name || '',
          link: currentProfile?.link || '',
          lookingFor: currentProfile?.lookingfor || '',
          profilePicture: currentProfile?.vcphotourl || null
        };
      } catch (error) {
        console.error('Error fetching profile:', error);
        this.state.profile = null;
        this.state.profileForm = {
          name: '',
          link: '',
          lookingFor: '',
          profilePicture: null
        };
      }
    }
  }

  async handleRoleChange(newRole) {
    if (!this.user || newRole === this.role) return;
    
    this.state.isUpdatingRole = true;
    this.state.roleUpdateMessage = '';
    
    try {
      const isLooking = newRole === 'founder';
      
      const updatedProfile = await profilesService.upsertProfile({
        id: this.user.id,
        isLooking: isLooking,
        name: this.state.profile?.name,
        link: this.state.profile?.link,
        lookingfor: this.state.profile?.lookingfor,
        vcphotourl: this.state.profile?.vcphotourl
      });
      
      if (updatedProfile) {
        this.state.roleUpdateMessage = 'Role updated successfully!';
        if (this.onRoleChange) {
          this.onRoleChange(newRole);
        }
        setTimeout(() => {
          this.onClose();
        }, 1500);
      } else {
        this.state.roleUpdateMessage = 'Failed to update role. Please try again.';
      }
    } catch (error) {
      console.error('Error updating role:', error);
      this.state.roleUpdateMessage = 'Error updating role. Please try again.';
    } finally {
      this.state.isUpdatingRole = false;
    }
  }

  async handleProfileUpdate() {
    if (!this.user) return;
    
    this.state.isUpdatingProfile = true;
    this.state.profileUpdateMessage = '';
    
    try {
      const updatedProfile = await profilesService.upsertProfile({
        id: this.user.id,
        isLooking: this.role === 'founder',
        name: this.state.profileForm.name,
        link: this.state.profileForm.link,
        lookingfor: this.state.profileForm.lookingFor,
        vcphotourl: this.state.profileForm.profilePicture
      });
      
      if (updatedProfile) {
        this.state.profileUpdateMessage = 'Profile updated successfully!';
        this.state.profile = updatedProfile;
        setTimeout(() => {
          this.onClose();
        }, 1500);
      } else {
        this.state.profileUpdateMessage = 'Failed to update profile. Please try again.';
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      this.state.profileUpdateMessage = 'Error updating profile. Please try again.';
    } finally {
      this.state.isUpdatingProfile = false;
    }
  }

  handleProfilePictureChange(e) {
    const file = e.target.files[0];
    if (file) {
      this.state.profileForm.profilePicture = file.name;
    }
  }

  render() {
    if (!this.isOpen) return null;

    if (!this.user) {
      console.error('AccountModal: user prop is required');
      return null;
    }

    console.log('AccountModal rendering with isOpen:', this.isOpen);

    return (
      <NapkinModal
        isOpen={this.isOpen}
        onClose={this.onClose}
        title="Account Settings"
        description="Manage your profile and preferences."
        width={700}
        height={700}
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
                  value={this.state.profileForm.name}
                  onChange={(e) => this.state.profileForm.name = e.target.value}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your name"
                />
              </div>

              {/* LinkedIn Profile (for VCs) */}
              {this.role === 'vc' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    value={this.state.profileForm.link}
                    onChange={(e) => this.state.profileForm.link = e.target.value}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
              )}

              {/* What I'm Looking For */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What I&apos;m Looking For
                </label>
                <textarea
                  value={this.state.profileForm.lookingFor}
                  onChange={(e) => this.state.profileForm.lookingFor = e.target.value}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={this.role === 'vc' ? "e.g., Early-stage SaaS, FinTech, AI/ML" : "e.g., Seed funding, Series A, Strategic partnerships"}
                  rows={3}
                />
              </div>

              {/* Profile Picture (VCs only) */}
              {this.role === 'vc' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => this.handleProfilePictureChange(e)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {this.state.profileForm.profilePicture && (
                    <p className="text-sm text-gray-600 mt-1">
                      Selected: {this.state.profileForm.profilePicture}
                    </p>
                  )}
                </div>
              )}

              {/* Update Profile Button */}
              <button
                onClick={() => this.handleProfileUpdate()}
                disabled={this.state.isUpdatingProfile}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {this.state.isUpdatingProfile ? 'Updating...' : 'Update Profile'}
              </button>

              {this.state.profileUpdateMessage && (
                <div className={`p-2 rounded text-sm ${
                  this.state.profileUpdateMessage.includes('successfully') 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-red-50 text-red-700'
                }`}>
                  {this.state.profileUpdateMessage}
                </div>
              )}
            </div>
          </div>

          {/* Role Management Section */}
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Role Management</h3>
            <p className="text-gray-600 text-sm mb-4">
              You are currently in <span className="font-medium">{this.role === 'vc' ? 'VC Mode' : 'Founder Mode'}</span>
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800">VC Mode</h4>
                  <p className="text-sm text-gray-600">Browse and like founder ideas</p>
                </div>
                <button
                  onClick={() => this.handleRoleChange('vc')}
                  disabled={this.role === 'vc' || this.state.isUpdatingRole}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    this.role === 'vc'
                      ? 'bg-blue-500 text-white cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {this.role === 'vc' ? 'Current' : 'Switch to VC'}
                </button>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800">Founder Mode</h4>
                  <p className="text-sm text-gray-600">Submit ideas and see what VCs like</p>
                </div>
                <button
                  onClick={() => this.handleRoleChange('founder')}
                  disabled={this.role === 'founder' || this.state.isUpdatingRole}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    this.role === 'founder'
                      ? 'bg-green-500 text-white cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {this.role === 'founder' ? 'Current' : 'Switch to Founder'}
                </button>
              </div>
            </div>
            
            {this.state.isUpdatingRole && (
              <div className="mt-3 p-2 bg-blue-50 text-blue-700 rounded text-sm">
                Updating role...
              </div>
            )}
            
            {this.state.roleUpdateMessage && (
              <div className={`mt-3 p-2 rounded text-sm ${
                this.state.roleUpdateMessage.includes('successfully') 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-red-50 text-red-700'
              }`}>
                {this.state.roleUpdateMessage}
              </div>
            )}
          </div>

          {/* Account Information Section */}
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Account Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium text-gray-800">{this.user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">User ID:</span>
                <span className="font-mono text-sm text-gray-800">{this.user?.id}</span>
              </div>
            </div>
          </div>

          {/* Founder-specific PDFs Management */}
          {this.role === 'founder' && (
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Your PDFs</h3>
              <p className="text-gray-600 text-sm mb-4">Manage all your submitted one-liners and ideas.</p>
              
              <PdfsList
                items={this.items || []}
                onEdit={this.onEdit || (() => {})}
                onDelete={this.onDelete || (() => {})}
                width="100%"
                height={300}
                emptyMessage="No PDFs yet. Submit one above!"
              />
            </div>
          )}
        </div>
      </NapkinModal>
    );
  }
}

// ============================================================================
// MODAL VIEW - ALL MODALS IN ONE PLACE FOR EASY EDITING
// ============================================================================
export function AllNapkinModalsView() {
  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);
  const [isSubmittedIdeasModalOpen, setIsSubmittedIdeasModalOpen] = useState(false);
  const [isVCLikesModalOpen, setIsVCLikesModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  // Sample data for testing
  const sampleItems = [
    { id: 1, idea_name: "Sample Idea 1", link: "https://example.com", created_at: new Date() },
    { id: 2, idea_name: "Sample Idea 2", link: "https://example2.com", created_at: new Date() }
  ];

  const sampleVcsWithLikedIdeas = [
    {
      vcId: "vc1",
      vcName: "Sample VC",
      vcLinkedin: "https://linkedin.com/in/samplevc",
      likedIdeas: [{ id: 1, idea_name: "Sample Idea" }]
    }
  ];

  const sampleUser = { id: "user1", email: "user@example.com" };

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold mb-6">All Napkin Modals - Test View</h1>
      
      {/* Test Buttons */}
      <div className="space-y-2">
        <button 
          onClick={() => setIsLikesModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Open Likes Modal
        </button>
        
        <button 
          onClick={() => setIsSubmittedIdeasModalOpen(true)}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Open Submitted Ideas Modal
        </button>
        
        <button 
          onClick={() => setIsVCLikesModalOpen(true)}
          className="px-4 py-2 bg-purple-500 text-white rounded"
        >
          Open VC Likes Modal
        </button>
        
        <button 
          onClick={() => setIsAccountModalOpen(true)}
          className="px-4 py-2 bg-orange-500 text-white rounded"
        >
          Open Account Modal
        </button>
      </div>

      {/* All Modals */}
      <LikesModal
        isOpen={isLikesModalOpen}
        onClose={() => setIsLikesModalOpen(false)}
        items={sampleItems}
        onUnlike={(id) => console.log('Unlike:', id)}
      />

      <SubmittedIdeasModal
        isOpen={isSubmittedIdeasModalOpen}
        onClose={() => setIsSubmittedIdeasModalOpen(false)}
        items={sampleItems}
        onUnlike={(id) => console.log('Delete:', id)}
      />

      <VCLikesModal
        isOpen={isVCLikesModalOpen}
        onClose={() => setIsVCLikesModalOpen(false)}
        vcsWithLikedIdeas={sampleVcsWithLikedIdeas}
        onLikeVC={(vcId, vcName, ideaId) => console.log('Like VC:', vcId, vcName, ideaId)}
      />

      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        items={sampleItems}
        onEdit={(id, text) => console.log('Edit:', id, text)}
        onDelete={(id) => console.log('Delete:', id)}
        role="founder"
        user={sampleUser}
        onRoleChange={(role) => console.log('Role change:', role)}
      />
    </div>
  );
} 