'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'

import { pdfsService, profilesService, connectionsService } from '../lib/database'
import { supabase } from '../lib/supabase'
import SwipeNapkin from '../SwipeNapkin'
import SubmitNapkin from '../components/SubmitNapkin'
import MatchesNapkin from '../components/MatchesNapkin'
import ConnectionRequestsList from '../components/ConnectionRequestsList'
import LikesList from '../components/LikesList'
import VCLikedIdeasList from '../components/VCLikedIdeasList'
import VCUnreviewedIdeas from '../components/VCUnreviewedIdeas'
import VCMatchedIdeas from '../components/VCMatchedIdeas'
import AppLayout from '../components/AppLayout'
import Auth from '../components/Auth'
import LikesModal from '../components/LikesModal'
import SubmittedIdeasModal from '../components/SubmittedIdeasModal'
import VCLikesModal from '../components/VCLikesModal'
import PersistentLeftSidebar from '../components/PersistentLeftSidebar'
import ProfileModal from '../components/ProfileModal'
import ConnectionsModal from '../components/ConnectionsModal'
import ModernTabBar from '../components/ModernTabBar'
import Onboarding from '../components/Onboarding';
import PassedIdeasModal from '../components/PassedIdeasModal';
import OnelinersModal from '../components/OnelinersModal';

export const onboardingQuestions = [
  { key: 'name', label: 'what is your name?', type: 'text' },
  { key: 'isLooking', label: 'are you a founder or vc?', type: 'text' },
  { key: 'history', label: 'what is the name of your company?', type: 'text' },
  { key: 'lookingfor', label: 'what are you looking for (max 69 chars)?', type: 'text' },
  { key: 'link', label: 'please link your linkedin profile', type: 'text' }
];

export default function Home() {
  const [oneLiner, setOneLiner] = useState('')
  const [role, setRole] = useState(null) // Will be set based on user profile
  const [creativeIdeas, setCreativeIdeas] = useState([])
  const [likedIdeas, setLikedIdeas] = useState([])
  const [matchedIdeas, setMatchedIdeas] = useState([])
  // Add state for the two VC napkins
  const [vcUnreviewedIdeas, setVcUnreviewedIdeas] = useState([])
  const [vcMatchedIdeas, setVcMatchedIdeas] = useState([])
  const [vcLikedIdeas, setVcLikedIdeas] = useState([])
  const [vcsWithLikedIdeas, setVcsWithLikedIdeas] = useState([])
  const [connectionRequests, setConnectionRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false)
  const [isSubmittedIdeasModalOpen, setIsSubmittedIdeasModalOpen] = useState(false)
  const [isVCLikesModalOpen, setIsVCLikesModalOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isConnectionsModalOpen, setIsConnectionsModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isPassedIdeasModalOpen, setIsPassedIdeasModalOpen] = useState(false)
  const [isOnelinersModalOpen, setIsOnelinersModalOpen] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [profile, setProfile] = useState(null);
  const [passedIdeas, setPassedIdeas] = useState([])
  const [isPendingConnectionsModalOpen, setIsPendingConnectionsModalOpen] = useState(false);
  const [vcReviewItems, setVcReviewItems] = useState([])
  const [liveCounter, setLiveCounter] = useState(10)
  const [counterStep, setCounterStep] = useState(0)
  const fetchingRef = useRef(false)

  const { user, loading: authLoading, signOut } = useAuth()

  // Live counter that increases by different amounts every 30 seconds and resets daily
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCounter(prev => {
        // Reset to 10 at the start of each day
        const now = new Date()
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const timeSinceStartOfDay = now.getTime() - startOfDay.getTime()
        
        // If it's a new day, reset to 10
        if (timeSinceStartOfDay < 30000) { // First 30 seconds of the day
          setCounterStep(0)
          return 10
        }
        
        // Increase by different amounts every 30 seconds
        const step = Math.floor(timeSinceStartOfDay / 30000) % 3
        setCounterStep(step)
        
        const increments = [23, 34, 37]
        return prev + increments[step]
      })
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Fetch user profile and determine role
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user && !role) { // Only fetch if user exists and role is not set
        try {
          const profile = await profilesService.getProfile(user.id);
          setProfile(profile);
          
          // Check if profile exists and has all required fields
          if (!profile) {
            console.log('No profile found, showing onboarding')
            setShowOnboarding(true);
            setRole(null);
          } else {
            console.log('Profile validation - name:', !!profile.name, 'isLooking:', profile.isLooking, 'history:', !!profile.history, 'lookingfor:', !!profile.lookingfor, 'link:', !!profile.link)
            
            if (!profile.name || profile.isLooking === undefined || !profile.history || !profile.lookingfor || !profile.link) {
              console.log('Profile incomplete, showing onboarding')
              setShowOnboarding(true);
              setRole(null); // Don't set role until profile is complete
            } else {
              setShowOnboarding(false);
              // Determine role based on isLooking field
              // isLooking = true -> founder, isLooking = false -> vc
              const userRole = profile.isLooking ? 'founder' : 'vc'
              console.log('Setting role to:', userRole, 'based on isLooking:', profile.isLooking)
              setRole(userRole)
            }
          }
        } catch (error) {
          console.error('Error fetching user profile:', error)
          // If no profile exists, show onboarding instead of defaulting to VC
          console.log('No profile found due to error, showing onboarding')
          setShowOnboarding(true)
          setRole(null) // Don't set role until profile is created
        }
      } else if (!user) {
        // No user, set role to null to show auth component
        console.log('No user, setting role to null')
        setRole(null)
      }
    }

    fetchUserProfile()
  }, [user, role]) // Add role as dependency to prevent re-fetching when role is already set

  // Fetch PDFs from database
  useEffect(() => {
    const fetchPdfs = async () => {
      if (user && role && !loading && !fetchingRef.current) { // Only fetch if both user and role are available and not already loading
        fetchingRef.current = true
        
        // Add a small delay to ensure authentication is fully settled
        await new Promise(resolve => setTimeout(resolve, 200))
        
        try {
          console.log('Fetching PDFs for user:', user.id, 'role:', role)
          if (role === 'vc') {
            // For VCs: fetch ideas and connections
            const [allPdfs, userLikedPdfs, userPassedPdfs, pendingConnections, requestedConnections, connectedConnections] = await Promise.all([
            pdfsService.getAllPdfs(),
            pdfsService.getLikedPdfsByUser(user.id),
            pdfsService.getPassedPdfsByUser(user.id),
              connectionsService.getConnectionsByStatus(user.id, 'pending'),
              connectionsService.getConnectionsByStatus(user.id, 'requested'),
              connectionsService.getConnectionsByStatus(user.id, 'connected')
            ])

            // LikesModal: use the liked PDFs from connections table (status 'curious' only)
            const curiousConnections = await connectionsService.getConnectionsByStatus(user.id, 'curious');
            setLikedIdeas(userLikedPdfs); // (if you use this elsewhere)

            // Split into two napkins for VCs:
            // 1. Unreviewed Ideas: ideas the VC hasn't liked yet
            const interactedPdfIds = [...userLikedPdfs.map(pdf => pdf.id), ...userPassedPdfs.map(pdf => pdf.id)];
            const unreviewedPdfs = allPdfs.filter(pdf => !interactedPdfIds.includes(pdf.id));
            
            // Debug specific idea filtering (remove after testing)
            // const targetIdeaId = '0b1d2230-a5ed-467d-9837-7cb87506d777';
            // const targetInPassed = userPassedPdfs.find(pdf => pdf.id === targetIdeaId);
            // if (targetInPassed) console.log('🔍 Target idea still in passed list');
            
            let unreviewedPdfsWithCreator = [];
            if (unreviewedPdfs.length > 0) {
              const { data: unreviewedPdfsData, error: unreviewedPdfsError } = await supabase
                .from('pdfs')
                .select('*, creator:user_id (name, link, vcphotourl)')
                .in('id', unreviewedPdfs.map(pdf => pdf.id))
                .order('created_at', { ascending: false });
              if (!unreviewedPdfsError) {
                unreviewedPdfsWithCreator = unreviewedPdfsData
                    .filter(pdf => pdf.creator)
                  .map(pdf => ({
                    ...pdf,
                    creatorName: pdf.creator?.name || 'Unknown',
                    creatorLinkedin: pdf.creator?.link,
                    creatorPhoto: pdf.creator?.vcphotourl
                  }));
              }
            }
            setVcUnreviewedIdeas(unreviewedPdfsWithCreator);

            // 2. Matched Ideas: ideas where both VC and founder have liked each other (status: pending)
            // Filter to only include connections where current user is the VC
            const vcPendingConnections = pendingConnections.filter(conn => conn.vc_id === user.id);
            const matchedConnections = vcPendingConnections.map(conn => ({
              // Spread the idea object but preserve important IDs
              ...conn.idea,
              id: conn.idea_id, // Ensure idea ID is present
              user_id: conn.founder_id, // Add founder ID for connection requests
              creatorName: conn.founder?.name || 'Unknown',
              creatorLinkedin: conn.founder?.link,
              creatorPhoto: conn.founder?.vcphotourl,
              connectionId: conn.id,
              connectionStatus: conn.status,
              created_at: conn.created_at,
              updated_at: conn.updated_at
            }));
            setVcMatchedIdeas(matchedConnections);

            // VCLikesModal: only show 'curious' status
            const vcsWithLikedIdeas = (curiousConnections || []).map(conn => ({
              vcId: conn.vc_id,
              vcName: conn.vc?.name || `VC ${conn.vc_id?.slice(0, 8)}...`,
              vcLinkedin: conn.vc?.link,
              vcPhoto: conn.vc?.vcphotourl,
              likedIdeas: [{ id: conn.idea_id, idea_name: conn.idea?.idea_name }]
            }));
            setVcsWithLikedIdeas(vcsWithLikedIdeas);

            // ConnectionsModal: show 'pending', 'requested', 'connected'
            // Filter connections where current user is the VC
            const vcConnections = [
              ...pendingConnections.filter(conn => conn.vc_id === user.id),
              ...requestedConnections.filter(conn => conn.vc_id === user.id),
              ...connectedConnections.filter(conn => conn.vc_id === user.id)
            ];
            const allConnectionRequests = vcConnections.map(conn => ({
              ...conn,
              founderName: conn.founder?.name || `Founder ${conn.founder_id?.slice(0, 8)}...`,
              founderLinkedin: conn.founder?.link,
              ideaName: conn.idea?.idea_name || `Idea ${conn.idea_id?.slice(0, 8)}...`
            }));
            setConnectionRequests(allConnectionRequests);

          // PassedIdeasModal: use the passed PDFs from connections table
          setPassedIdeas(userPassedPdfs);

          // Clear founder-specific data for VCs
          setCreativeIdeas([]);

          // AccountModal: fetch user profile
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          if (!profileError) setProfile(profileData);

            setMatchedIdeas([]); // VCs don't see matches until founders like them
            setVcLikedIdeas([]);
          } else {
            // For founders: fetch their ideas and VCs who liked them
            const [userPdfs, userLikedPdfs, pendingConnections, requestedConnections, connectedConnections, curiousConnections] = await Promise.all([
              pdfsService.getAllPdfs().then(pdfs => pdfs.filter(pdf => pdf.user_id === user.id)),
              pdfsService.getFounderLikedPdfs(user.id),
              connectionsService.getFounderConnectionsByStatus(user.id, 'pending'),
              connectionsService.getFounderConnectionsByStatus(user.id, 'requested'),
              connectionsService.getFounderConnectionsByStatus(user.id, 'connected'),
              connectionsService.getFounderConnectionsByStatus(user.id, 'curious')
            ]);

            // VCLikesModal: not used for founders

            // ConnectionsModal: show 'requested', 'connected'
            const allConnectionRequests = [
              ...requestedConnections,
              ...connectedConnections
            ].map(conn => ({
              ...conn,
              vcName: conn.vc?.name || `VC ${conn.vc_id?.slice(0, 8)}...`,
              vcLinkedin: conn.vc?.link,
              ideaName: conn.idea?.idea_name || conn.idea_id,
            }));
            setConnectionRequests(allConnectionRequests);
            
            setCreativeIdeas(userPdfs); // Founders see their own submitted ideas
            setLikedIdeas(userLikedPdfs);
            setMatchedIdeas([]);
            setVcLikedIdeas([]);
            setVcReviewItems(curiousConnections);
            
            // Clear VC-specific data for founders
            setVcUnreviewedIdeas([]);
            setVcMatchedIdeas([]);
          }
        } catch (error) {
          console.error('Error fetching PDFs:', error)
          setCreativeIdeas([])
          setLikedIdeas([])
          setPassedIdeas([])
          setMatchedIdeas([])
          setVcLikedIdeas([])
          setVcUnreviewedIdeas([])
          setVcMatchedIdeas([])
          setVcsWithLikedIdeas([])
          setConnectionRequests([])
        } finally {
          setLoading(false)
          fetchingRef.current = false
        }
      } else if (user && !role) {
        console.log('User exists but role not set yet')
      } else {
        console.log('No user, setting loading to false')
        setLoading(false)
      }
    }

    fetchPdfs()
  }, [user, role, loading])

  // Simple refresh function for manual refresh
  const refreshData = async () => {
    if (user && role && !fetchingRef.current) {
      fetchingRef.current = true
      setLoading(true)
      // Trigger re-fetch by updating a dependency
      setLoading(false)
      fetchingRef.current = false
      // Force re-render by updating loading state
      window.location.reload()
    }
  }

  const handleSubmit = async () => {
    if (oneLiner.trim() && user) {
      try {
        const newPdf = await pdfsService.createPdf(oneLiner.trim(), user.id)
        setCreativeIdeas([newPdf, ...creativeIdeas])
        setOneLiner('')
      } catch (error) {
        console.error('Error creating PDF:', error)
        alert('Failed to create PDF. Please try again.')
      }
    }
  }

  const handleLike = async (id) => {
    console.log('[handleLike] Called with id:', id, 'role:', role)
    try {
      if (role === 'vc') {
        // VC liking an unreviewed idea
        const pdf = vcUnreviewedIdeas.find(i => i.id === id)
        if (pdf) {
          // Create curious connection for VC liking an idea
          await connectionsService.createCuriousConnection(user.id, pdf.user_id, id)
          
          // Remove from unreviewed ideas
          setVcUnreviewedIdeas(vcUnreviewedIdeas.filter(i => i.id !== id))
          
          // Add to liked ideas
          setLikedIdeas([...likedIdeas, pdf])
        }
      } else {
        // Founder logic (unchanged)
        const pdf = creativeIdeas.find(i => i.id === id)
        if (pdf) {
          await pdfsService.likePdf(id, user.id)
          setCreativeIdeas(creativeIdeas.filter(p => p.id !== id))
          setLikedIdeas([pdf, ...likedIdeas])
        }
      }
    } catch (error) {
      console.error('Error liking PDF:', error)
      alert('Failed to like PDF. Please try again.')
    }
  }

  const handlePassVc = async (index) => {
    if (role === 'vc') {
      // VC passing on an unreviewed idea
      const currentPdf = vcUnreviewedIdeas[index]
      console.log('handlePassVc called with index:', index, 'pdf:', currentPdf)
      
      try {
        const result = await pdfsService.passPdf(currentPdf.id, user.id)
        console.log('passPdf result:', result)
        
        // Remove from unreviewed ideas
        const remainingPdfs = vcUnreviewedIdeas.filter((_, i) => i !== index)
        console.log('Remaining PDFs after pass:', remainingPdfs.length)
        setVcUnreviewedIdeas(remainingPdfs)
        
        // Refresh passed ideas from database
        const refreshedPassedPdfs = await pdfsService.getPassedPdfsByUser(user.id)
        console.log('Refreshed passed PDFs:', refreshedPassedPdfs.length)
        setPassedIdeas(refreshedPassedPdfs)
      } catch (error) {
        console.error('Error passing PDF:', error)
        alert('Failed to pass PDF. Please try again.')
      }
    } else {
      // Founder logic (unchanged)
      const currentPdf = creativeIdeas[index]
      console.log('handlePassVc called with index:', index, 'pdf:', currentPdf)
      
      try {
        const result = await pdfsService.passPdf(currentPdf.id, user.id)
        console.log('passPdf result:', result)
        
        const remainingPdfs = creativeIdeas.filter((_, i) => i !== index)
        console.log('Remaining PDFs after pass:', remainingPdfs.length)
        setCreativeIdeas(remainingPdfs)
        
        const refreshedPassedPdfs = await pdfsService.getPassedPdfsByUser(user.id)
        console.log('Refreshed passed PDFs:', refreshedPassedPdfs.length)
        setPassedIdeas(refreshedPassedPdfs)
      } catch (error) {
        console.error('Error passing PDF:', error)
      }
    }
  }

  const handlePassMatched = async (index) => {
    const idea = vcMatchedIdeas[index]
    if (idea) {
      try {
        await connectionsService.updateConnectionStatus(idea.connectionId, 'blocked')
        setVcMatchedIdeas(vcMatchedIdeas.filter((_, i) => i !== index))
      } catch (error) {
        console.error('Error passing matched idea:', error)
        alert('Failed to pass idea. Please try again.')
      }
    }
  }

  const handleConnect = async (idea) => {
    try {
      const result = await connectionsService.requestConnection(user.id, idea.user_id, idea.id, 'Hello! I\'d like to connect about your idea.')
      if (result) {
        // Remove from matched ideas
        setVcMatchedIdeas(vcMatchedIdeas.filter(i => i.id !== idea.id))
        alert('Connection request sent successfully!')
      } else {
        alert('Failed to send connection request. Please try again.')
      }
    } catch (error) {
      console.error('Error sending connection request:', error)
      alert('Failed to send connection request. Please try again.')
    }
  }

  const handleUnlike = async (id) => {
    try {
      const pdf = likedIdeas.find(i => i.id === id)
      if (pdf) {
        // Unlike the PDF
        await pdfsService.unlikePdf(id, user.id)
        
        // Remove from likedIdeas
        setLikedIdeas(likedIdeas.filter(p => p.id !== id))
        
        // Add back to appropriate list
        if (role === 'vc') {
          setVcUnreviewedIdeas([pdf, ...vcUnreviewedIdeas])
        } else {
          setCreativeIdeas([...creativeIdeas, pdf])
        }
      }
    } catch (error) {
      console.error('Error unliking PDF:', error)
      alert('Failed to unlike PDF. Please try again.')
    }
  }

  const handleUnpass = async (id) => {
    try {
      const pdf = passedIdeas.find(i => i.id === id)
      if (pdf) {
        console.log('🔄 Unpassing PDF:', id)
        
        // Unpass the PDF
        await pdfsService.unpassPdf(id, user.id)
        console.log('✅ Database unpass successful')
        
        // Remove from passedIdeas
        setPassedIdeas(passedIdeas.filter(p => p.id !== id))
        console.log('✅ Removed from passed ideas state')
        
        // For VCs, we need to fetch the idea with creator data and add to unreviewed
        if (role === 'vc') {
          try {
            console.log('🔍 Fetching idea with creator data for unreviewed list')
            const { data: pdfWithCreator, error } = await supabase
              .from('pdfs')
              .select('*, creator:user_id (name, link, vcphotourl)')
              .eq('id', id)
              .single()
            
            if (!error && pdfWithCreator && pdfWithCreator.creator) {
              const formattedPdf = {
                ...pdfWithCreator,
                creatorName: pdfWithCreator.creator?.name || 'Unknown',
                creatorLinkedin: pdfWithCreator.creator?.link,
                creatorPhoto: pdfWithCreator.creator?.vcphotourl
              };
              setVcUnreviewedIdeas([formattedPdf, ...vcUnreviewedIdeas])
              console.log('✅ Added to unreviewed ideas with creator data')
            } else {
              console.warn('⚠️ Could not fetch creator data, idea may not appear in unreviewed')
            }
          } catch (fetchError) {
            console.error('Error fetching idea with creator:', fetchError)
          }
        } else {
          setCreativeIdeas([...creativeIdeas, pdf])
        }
      }
    } catch (error) {
      console.error('Error unpassing PDF:', error)
      alert('Failed to unpass PDF. Please try again.')
    }
  }

  const handleEditPdf = async (id, newText) => {
    try {
      const updatedPdf = await pdfsService.updatePdf(id, { idea_name: newText })
      if (updatedPdf) {
        // Update in creativeIdeas
        setCreativeIdeas(creativeIdeas.map(pdf => 
          pdf.id === id ? { ...pdf, idea_name: newText } : pdf
        ))
        // Update in likedIdeas if it exists there
        setLikedIdeas(likedIdeas.map(pdf => 
          pdf.id === id ? { ...pdf, idea_name: newText } : pdf
        ))
        // Update in matchedIdeas if it exists there
        setMatchedIdeas(matchedIdeas.map(pdf => 
          pdf.id === id ? { ...pdf, idea_name: newText } : pdf
        ))
      }
    } catch (error) {
      console.error('Error editing PDF:', error)
      alert('Failed to edit PDF. Please try again.')
    }
  }

  const handleDeletePdf = async (id) => {
    try {
      const result = await pdfsService.deletePdf(id)
      if (result) {
        // Remove from all lists
        setCreativeIdeas(creativeIdeas.filter(pdf => pdf.id !== id))
        setLikedIdeas(likedIdeas.filter(pdf => pdf.id !== id))
        setMatchedIdeas(matchedIdeas.filter(pdf => pdf.id !== id))
      } else {
        alert('Failed to delete PDF. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting PDF:', error)
      alert('Failed to delete PDF. Please try again.')
    }
  }

  const handleRoleChange = (newRole) => {
    console.log('Role change requested to:', newRole)
    setRole(newRole)
  }

  const handleSendConnectionRequest = async (founderId, ideaId, message) => {
    try {
      const result = await connectionsService.requestConnection(user.id, founderId, ideaId, message)
      if (result) {
        // Do NOT remove the connection from state here; let status update naturally
        // This ensures requested connections remain visible in the Connections modal
        alert('Connection request sent successfully!')
      } else {
        alert('Failed to send connection request. Please try again.')
      }
    } catch (error) {
      console.error('Error sending connection request:', error)
      throw error
    }
  }

  const handleAcceptConnection = async (connectionId) => {
    try {
      const result = await connectionsService.acceptConnection(connectionId)
      if (result) {
        // Remove the connection request from the list since it was accepted
        setConnectionRequests(connectionRequests.filter(conn => conn.id !== connectionId))
        alert('Connection accepted successfully!')
      } else {
        alert('Failed to accept connection. Please try again.')
      }
    } catch (error) {
      console.error('Error accepting connection:', error)
      alert('Failed to accept connection. Please try again.')
    }
  }

  const handleLikeVC = async (vcId, vcName, ideaId) => {
    try {
      const result = await connectionsService.likeVC(user.id, vcId, ideaId)
      if (result) {
        alert(`You liked ${vcName}! They will now see you in their pending connections.`)
        // Remove the VC from the list since they're now pending
        setVcsWithLikedIdeas(vcsWithLikedIdeas.filter(vc => 
          !(vc.vcId === vcId && vc.likedIdeas.some(idea => idea.id === ideaId))
        ))
      } else {
        alert('Failed to like VC. Please try again.')
      }
    } catch (error) {
      console.error('Error liking VC:', error)
      alert('Failed to like VC. Please try again.')
    }
  }

  // Add a handler for disconnecting a connection
  const handleDisconnectConnection = async (connectionId) => {
    try {
      await connectionsService.updateConnectionStatus(connectionId, 'disconnected')
      // Refresh connections
      await fetchPdfs()
    } catch (error) {
      console.error('Error disconnecting:', error)
    }
  }

  const handleOnelinersButtonClick = () => {
    setIsProfileModalOpen(false)
    setIsOnelinersModalOpen(true)
  }

  // Handler for founder liking a VC (move to 'pending')
  const handleFounderLikeVC = async (id) => {
    const item = vcReviewItems.find(i => i.id === id)
    if (!item) return
    try {
      await connectionsService.likeVC(item.founder_id, item.vc_id, item.idea_id)
      // Remove from review list
      setVcReviewItems(vcReviewItems.filter(i => i.id !== id))
    } catch (error) {
      alert('Failed to like VC. Please try again.')
    }
  }
  // Handler for founder passing on a VC (move to 'blocked')
  const handleFounderPassVC = async (index) => {
    const item = vcReviewItems[index]
    if (!item) return
    try {
      await connectionsService.updateConnectionStatus(item.id, 'blocked')
      setVcReviewItems(vcReviewItems.filter((_, i) => i !== index))
    } catch (error) {
      alert('Failed to pass on VC. Please try again.')
    }
  }

  // Show loading state
  if (authLoading || (loading && user)) {
    console.log('Showing loading state:', { 
      authLoading, 
      loading, 
      role, 
      roleIsNull: role === null,
      user: user?.email,
      shouldShowLoading: authLoading || (loading && user)
    })
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  // Show auth component if not logged in
  if (!user) {
    console.log('No user, showing Auth component')
    return <Auth />
  }

  // Show onboarding if needed
  if (showOnboarding) {
    return (
      <Onboarding 
        user={user} 
        profile={profile}
        onComplete={() => {
          setShowOnboarding(false)
          // Refresh the profile data after onboarding
          window.location.reload()
        }}
      />
    )
  }

  console.log('User authenticated, showing main app:', { user: user?.email, role })

  // Show main app if authenticated
  return (
    <>
             {/* Persistent Left Sidebar */}
       <PersistentLeftSidebar
         connectionRequests={connectionRequests}
         onProfileClick={() => setIsProfileModalOpen(true)}
         onSettingsClick={() => setIsSettingsModalOpen(true)}
         onConnectionsClick={() => setIsConnectionsModalOpen(true)}
         onSubmittedIdeasClick={() => setIsSubmittedIdeasModalOpen(true)}
       />
      
    <AppLayout
      role={role}
      user={user}
      signOut={signOut}
      creativeIdeas={creativeIdeas}
      handleEditPdf={handleEditPdf}
      handleDeletePdf={handleDeletePdf}
      onRoleChange={handleRoleChange}
    >
                     <div className="flex items-center justify-center min-h-screen p-2 sm:p-4 lg:p-6 ml-20">
             {/* Subtle Napkin Paper Texture Background */}
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.02)_1px,transparent_0)] bg-[length:20px_20px] opacity-60"></div>
             
             <div className="max-w-7xl mx-auto w-full relative z-10">
               <div className="flex flex-col items-center justify-center space-y-8 sm:space-y-12">
            {/* VC Mode Layout - Two Napkins */}
            {role === 'vc' && (
              <>
                {/* VC Mode Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-2 4h2M9 15h2" />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">investor dashboard</h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                    discover and evaluate the next big ideas from innovative founders
                  </p>
                </div>

                <VCUnreviewedIdeas
                  title="ideas to review"
                  description="new ideas waiting for your review."
                  items={vcUnreviewedIdeas}
                  onLike={handleLike}
                  onPass={handlePassVc}
                  emptyMessage="no new ideas to review."
                  width={600}
                  height={400}
                />
                <VCMatchedIdeas
                  title="matches"
                  description="ideas where both you and the founder have shown interest."
                  items={vcMatchedIdeas}
                  onConnect={handleConnect}
                  onPass={handlePassMatched}
                  emptyMessage="no matches yet."
                  width={600}
                  height={400}
                />
              </>
            )}

                         {/* Founder Mode Layout */}
             {role === 'founder' && (
               <>
                 {/* Side by Side Layout */}
                 <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 w-full">
                   {/* Left Side - Hero Section */}
                   <div className="flex-1 text-left max-w-4xl lg:ml-0 xl:ml-8">
                     <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight 
                                    animate-text-fade delay-200">
                       your idea, one sentence. their investment, one swipe.
                     </h1>
                     <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 
                                   animate-text-fade delay-300">
                       join thousands of founders pitching napkin ideas to top investors in seconds.
                     </p>
                     
                     {/* Live Counter */}
                     <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 
                                    border border-green-200 dark:border-green-800 rounded-full
                                    animate-text-fade delay-400 hover:scale-105 transition-transform duration-200">
                       <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                       <span className="text-sm font-medium text-green-700 dark:text-green-300">
                         {liveCounter.toLocaleString()} ideas launched today
                       </span>
                     </div>
                   </div>

                   {/* Right Side - Napkin Pitch Card */}
                   <div className="flex-1 flex justify-center lg:justify-end">
                     <SubmitNapkin 
                       onSubmit={handleSubmit}
                       oneLiner={oneLiner}
                       setOneLiner={setOneLiner}
                       width={600}
                       height={400}
                     />
                   </div>
                 </div>



                 
               </>
             )}
           </div>
         </div>
       </div>
     </AppLayout>
      

      
      {/* Modals */}
      <LikesModal
        isOpen={isLikesModalOpen}
        onClose={() => setIsLikesModalOpen(false)}
        items={likedIdeas}
        onUnlike={handleUnlike}
      />
      
             <SubmittedIdeasModal
         isOpen={isSubmittedIdeasModalOpen}
         onClose={() => setIsSubmittedIdeasModalOpen(false)}
         ideas={creativeIdeas}
         onEdit={handleEditPdf}
         onDelete={handleDeletePdf}
       />
      
      <VCLikesModal
        isOpen={isVCLikesModalOpen}
        onClose={() => setIsVCLikesModalOpen(false)}
        vcsWithLikedIdeas={vcsWithLikedIdeas}
        onLikeVC={handleLikeVC}
      />
      
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        role={role}
        signOut={signOut}
        onRoleChange={handleRoleChange}
        items={creativeIdeas}
        onOnelinersClick={handleOnelinersButtonClick}
      />

      <ConnectionsModal
        isOpen={isConnectionsModalOpen}
        onClose={() => setIsConnectionsModalOpen(false)}
        connectionRequests={connectionRequests}
        role={role}
        onRequestConnection={handleSendConnectionRequest}
        onAcceptConnection={handleAcceptConnection}
        onDisconnectConnection={handleDisconnectConnection}
        onOpenLikesModal={() => {
          setIsConnectionsModalOpen(false);
          setIsLikesModalOpen(true);
        }}
        onOpenPassedModal={() => {
          setIsConnectionsModalOpen(false);
          setIsPassedIdeasModalOpen(true);
        }}
      />

      <ModernTabBar
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      <PassedIdeasModal
        isOpen={isPassedIdeasModalOpen}
        onClose={() => setIsPassedIdeasModalOpen(false)}
        passedIdeas={passedIdeas}
        onUnpass={handleUnpass}
        role={role}
      />

      <OnelinersModal
        isOpen={isOnelinersModalOpen}
        onClose={() => setIsOnelinersModalOpen(false)}
        oneliners={creativeIdeas}
        onEdit={handleEditPdf}
        onDelete={handleDeletePdf}
      />
    </>
  )
}
