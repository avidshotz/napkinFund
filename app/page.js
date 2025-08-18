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
import AllUsersModal from '../components/AllUsersModal';
import ConfettiBlip from '../components/ConfettiBlip';
import ScrollingIdeasWheel from '../components/ScrollingIdeasWheel';

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
  const [allUsers, setAllUsers] = useState([])
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
  const [showNapkinAnimation, setShowNapkinAnimation] = useState(false)
  const [showNapkinRestore, setShowNapkinRestore] = useState(false)
  const [showIdeasPopup, setShowIdeasPopup] = useState(false)
  const [showConfettiBlip, setShowConfettiBlip] = useState(false)
  const [showAllUsersModal, setShowAllUsersModal] = useState(false)
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

            // Fetch all users for potential matches
            const { data: allUsersData, error: allUsersError } = await supabase
              .from('profiles')
              .select('id, name, link, vcphotourl, isLooking')
              .neq('id', user.id) // Exclude current user
              .eq('isLooking', true); // Only founders (people looking for investment)
            if (!allUsersError) {
              setAllUsers(allUsersData || []);
            }

            setMatchedIdeas([]); // VCs don't see matches until founders like them
            
            // Fetch VC's liked ideas
            const { data: vcLikedIdeasData, error: vcLikedIdeasError } = await supabase
              .from('connections')
              .select(`
                *,
                idea:idea_id (*),
                founder:founder_id (
                  id,
                  name,
                  link,
                  vcphotourl
                )
              `)
              .eq('vc_id', user.id)
              .eq('status', 'curious');
            
            if (!vcLikedIdeasError && vcLikedIdeasData) {
              const formattedLikedIdeas = vcLikedIdeasData.map(conn => ({
                ...conn.idea,
                creatorName: conn.founder?.name,
                creatorPhoto: conn.founder?.vcphotourl,
                creatorLinkedin: conn.founder?.link
              }));
              setVcLikedIdeas(formattedLikedIdeas);
            } else {
              setVcLikedIdeas([]);
            }
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

            // Format curious connections (VCs who liked founder's ideas) for display
            const formattedCuriousConnections = curiousConnections.map(conn => ({
              ...conn,
              vcName: conn.vc?.name || `VC ${conn.vc_id?.slice(0, 8)}...`,
              vcLinkedin: conn.vc?.link,
              vcPhoto: conn.vc?.vcphotourl,
              ideaName: conn.idea?.idea_name || conn.idea_id,
            }));
            setVcReviewItems(formattedCuriousConnections);

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

  const handleLaunchSuccess = () => {
    // Show confetti blip immediately
    setShowConfettiBlip(true)
    
    // Show napkin animation
    setShowNapkinAnimation(true)
    
    // Show ideas popup after napkin animation starts
    setTimeout(() => {
      setShowIdeasPopup(true)
    }, 1200)
    
    // Start restore animation after crumple completes (1.5s) + 1 second delay
    setTimeout(() => {
      setShowNapkinAnimation(false)
      setShowNapkinRestore(true)
    }, 2500)
    
    // Hide popup after 3 seconds
    setTimeout(() => {
      setShowIdeasPopup(false)
    }, 4200)
    
    // Reset restore state after restore animation completes
    setTimeout(() => {
      setShowNapkinRestore(false)
    }, 3300)
  }

  const handleLike = async (index) => {
    console.log('[handleLike] Called with index:', index, 'role:', role)
    try {
      if (role === 'vc') {
        // VC liking an unreviewed idea by index
        const pdf = vcUnreviewedIdeas[index]
        if (pdf) {
          // Create curious connection for VC liking an idea
          await connectionsService.createCuriousConnection(user.id, pdf.user_id, pdf.id)
          
          // Remove from unreviewed ideas
          setVcUnreviewedIdeas(prev => prev.filter((_, i) => i !== index))
          
          // Add to VC's liked ideas
          const likedIdea = {
            ...pdf,
            creatorName: pdf.creatorName || pdf.creator?.name,
            creatorPhoto: pdf.creatorPhoto || pdf.creator?.vcphotourl,
            creatorLinkedin: pdf.creatorLinkedin || pdf.creator?.link
          }
          setVcLikedIdeas(prev => [...prev, likedIdea])
        }
      } else {
        // Founder logic (unchanged)
        const pdf = creativeIdeas[index]
        if (pdf) {
          await pdfsService.likePdf(pdf.id, user.id)
          setCreativeIdeas(prev => prev.filter((_, i) => i !== index))
          setLikedIdeas(prev => [pdf, ...prev])
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
      {/* Confetti Blip */}
      <ConfettiBlip 
        isActive={showConfettiBlip} 
        onComplete={() => setShowConfettiBlip(false)} 
      />
      
      {/* Persistent Left Sidebar */}
                          <PersistentLeftSidebar
                     connectionRequests={connectionRequests}
                     onProfileClick={() => setIsProfileModalOpen(true)}
                     onSettingsClick={() => setIsSettingsModalOpen(true)}
                     onConnectionsClick={() => setIsConnectionsModalOpen(true)}
                     onSubmittedIdeasClick={role === 'founder' ? () => setIsSubmittedIdeasModalOpen(true) : () => setIsVCLikesModalOpen(true)}
                     showIdeasPopup={showIdeasPopup}
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
            {/* VC Mode Layout - Clean Dashboard */}
            {role === 'vc' && (
              <>
                {/* Enhanced VC Dashboard Header */}
                <div className="text-center mb-12 w-full">
                  <div className="flex flex-col items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 rounded-3xl flex items-center justify-center shadow-2xl">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-2 4h2M9 15h2" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                        investor dashboard
                      </h2>
                      <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">
                        discover and evaluate next big ideas by thousands of startup founders
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dashboard Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60 dark:border-gray-700/60 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-2xl font-white">{vcUnreviewedIdeas.length}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">ideas to review</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60 dark:border-gray-700/60 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 transition-transform duration-200"
                       onClick={() => setShowAllUsersModal(true)}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{allUsers.length || 0}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">potential matches</p>
                      </div>
                    </div>
                  </div>
                  

                  

                </div>

                {/* Main Content Area - Side by Side Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                  {/* Ideas to Review Section */}
                  <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl border border-gray-200/60 dark:border-gray-700/60 shadow-xl">
                    <VCUnreviewedIdeas
                      title="ideas to review"
                      description="new ideas waiting for your review"
                      items={vcUnreviewedIdeas}
                      onLike={handleLike}
                      onPass={handlePassVc}
                      emptyMessage="no new ideas to review"
                      width={600}
                      height={400}
                    />
                  </div>
                  
                  {/* Matches Section */}
                  <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl border border-gray-200/60 dark:border-gray-700/60 shadow-xl">
                    <VCMatchedIdeas
                      title="matches"
                      description="ideas where both parties showed interest"
                      items={vcMatchedIdeas}
                      onConnect={handleConnect}
                      onPass={handlePassMatched}
                      emptyMessage="no matches yet"
                      width={600}
                      height={400}
                    />
                  </div>
                </div>
              </>
            )}

                         {/* Founder Mode Layout */}
             {role === 'founder' && (
               <>
                 {/* Side by Side Layout */}
                 <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 w-full">
                   {/* Left Side - Hero Section */}
                   <div className="flex-1 text-center lg:text-left max-w-4xl">
                     <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight 
                                    animate-text-fade delay-200">
                       your idea, one sentence. their investment, one swipe.
                     </h1>
                     <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 
                                   animate-text-fade delay-300">
                       join thousands of founders pitching napkin ideas to top investors in seconds.
                     </p>
                     
                     {/* Live Counter */}
                     <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 
                                    border border-amber-200 dark:border-amber-800 rounded-full
                                    animate-text-fade delay-400 hover:scale-105 transition-transform duration-200">
                       <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                       <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                         {liveCounter.toLocaleString()} ideas launched today
                       </span>
                     </div>
                   </div>

                   {/* Right Side - Napkin Pitch Card */}
                   <div className="flex-1 flex justify-center">
                         <SubmitNapkin 
                            onSubmit={handleSubmit}
                            oneLiner={oneLiner}
                            setOneLiner={setOneLiner}
                            onLaunchSuccess={handleLaunchSuccess}
                            isAnimating={showNapkinAnimation}
                            isRestoring={showNapkinRestore}
                            width={600}
                            height={400}
                          />
                   </div>
                 </div>

                 {/* VCs Who Liked Your Ideas Section */}
                 {vcsWithLikedIdeas.length > 0 && (
                   <div className="w-full max-w-4xl mx-auto">
                     <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/60 dark:border-gray-700/60 shadow-xl">
                       <div className="text-center mb-8">
                         <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                           vcs interested in your ideas
                         </h3>
                         <p className="text-gray-600 dark:text-gray-400">
                           {vcsWithLikedIdeas.length} vc{vcsWithLikedIdeas.length !== 1 ? 's' : ''} have shown interest in your ideas
                         </p>
                       </div>
                       
                       <div className="grid gap-4">
                         {vcsWithLikedIdeas.map((vc) => (
                           <div key={vc.vcId} className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow duration-200">
                             <div className="flex items-center justify-between">
                               <div className="flex items-center gap-4">
                                 {/* VC Profile Picture */}
                                 <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-lg overflow-hidden">
                                   {vc.vcPhoto ? (
                                     <img 
                                       src={vc.vcPhoto} 
                                       alt={`${vc.vcName}'s profile`}
                                       className="w-full h-full object-cover rounded-full"
                                     />
                                   ) : (
                                     vc.vcName?.charAt(0).toUpperCase() || '?'
                                   )}
                                 </div>
                                 
                                 {/* VC Info */}
                                 <div>
                                   <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                                     {vc.vcName}
                                   </h4>
                                   <p className="text-gray-600 dark:text-gray-400 text-sm">
                                     interested in your idea
                                   </p>
                                 </div>
                               </div>
                               
                               {/* LinkedIn Link */}
                               {vc.vcLinkedin && (
                                 <a
                                   href={vc.vcLinkedin}
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className="p-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-full transition-colors duration-200"
                                   title="View LinkedIn Profile"
                                 >
                                   <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                     <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                   </svg>
                                 </a>
                               )}
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>
                   </div>
                 )}
                 
                 {/* Scrolling Ideas Wheel */}
                 <ScrollingIdeasWheel />
                 
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
        vcLikedIdeas={vcLikedIdeas}
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

      <AllUsersModal
        isOpen={showAllUsersModal}
        onClose={() => setShowAllUsersModal(false)}
        users={allUsers}
      />
    </>
  )
}
