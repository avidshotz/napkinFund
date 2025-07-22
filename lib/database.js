import { supabase } from './supabase'

// Check if supabase is configured
if (!supabase) {
  console.warn('Supabase not configured - database operations will fail')
}

// PDFs service
export const pdfsService = {
  // Fetch all PDFs/ideas
  async getAllPdfs() {
    if (!supabase) {
      console.warn('Supabase not configured - cannot fetch PDFs')
      return []
    }
    
    try {
      const { data, error } = await supabase
        .from('pdfs')
        .select('*')
        .or('deleted.is.null,deleted.eq.false')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching PDFs:', error)
      return []
    }
  },

  // Create a new PDF/idea
  async createPdf(ideaName, userId, pdfUrl = null, filename = null) {
    if (!supabase) {
      console.warn('Supabase not configured - cannot create PDF')
      return null
    }

    try {
      const { data, error } = await supabase
        .from('pdfs')
        .insert([
          {
            idea_name: ideaName,
            user_id: userId,
            pdf_url: pdfUrl,
            filename: filename,
            is_primary: false
          }
        ])
        .select()
      
      if (error) throw error
      return data?.[0] || null
    } catch (error) {
      console.error('Error creating PDF:', error)
      return null
    }
  },

  // Update PDF
  async updatePdf(id, updates) {
    if (!supabase) {
      console.warn('Supabase not configured - cannot update PDF')
      return null
    }

    try {
      const { data, error } = await supabase
        .from('pdfs')
        .update(updates)
        .eq('id', id)
        .select()
      
      if (error) throw error
      return data?.[0] || null
    } catch (error) {
      console.error('Error updating PDF:', error)
      return null
    }
  },

  // Soft delete PDF (set deleted flag to true)
  async deletePdf(id) {
    if (!supabase) {
      console.warn('Supabase not configured - cannot delete PDF')
      return null
    }

    try {
      const { data, error } = await supabase
        .from('pdfs')
        .update({ deleted: true })
        .eq('id', id)
        .select()
      
      if (error) throw error
      return data?.[0] || null
    } catch (error) {
      console.error('Error deleting PDF:', error)
      return null
    }
  },

  // Get PDFs liked by a specific user (using connections table)
  async getLikedPdfsByUser(userId) {
    if (!supabase) {
      console.warn('Supabase not configured - cannot get liked PDFs by user')
      return []
    }

    try {
      // Get connections where user is the VC and status is curious, pending, requested, or connected
      const { data: connections, error: connectionsError } = await supabase
        .from('connections')
        .select('*, idea:idea_id (*, creator:user_id (name, link, vcphotourl, vcphotolink))')
        .eq('vc_id', userId)
        .in('status', ['curious', 'pending', 'requested', 'connected'])
        .order('created_at', { ascending: false })
      
      if (connectionsError) throw connectionsError
      
      if (!connections || connections.length === 0) {
        return []
      }

      // Extract PDFs from connections and add creator info
      return connections.map(conn => ({
        ...conn.idea,
        profilePicture: conn.idea?.creator?.vcphotourl || conn.idea?.creator?.vcphotolink || null,
        profileName: conn.idea?.creator?.name || null,
        connectionId: conn.id,
        connectionStatus: conn.status
      }))
    } catch (error) {
      console.error('Error fetching liked PDFs:', error)
      return []
    }
  },

  // Get PDFs created by a founder that have been liked by VCs
  async getFounderLikedPdfs(founderId) {
    if (!supabase) {
      console.warn('Supabase not configured - cannot get founder liked PDFs')
      return []
    }

    try {
      // Get connections where founder is the creator and status is pending (founder has liked back)
      const { data: connections, error: connectionsError } = await supabase
        .from('connections')
        .select('*, vc:vc_id (name, link, vcphotourl, vcphotolink), idea:idea_id (*)')
        .eq('founder_id', founderId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
      
      if (connectionsError) throw connectionsError
      
      if (!connections || connections.length === 0) {
        return []
      }

      // Extract PDFs from connections and add VC info
      return connections.map(conn => ({
        ...conn.idea,
        profilePicture: conn.vc?.vcphotourl || conn.vc?.vcphotolink || null,
        profileName: conn.vc?.name || null,
        connectionId: conn.id,
        connectionStatus: conn.status
      }))
    } catch (error) {
      console.error('Error fetching founder liked PDFs:', error)
      return []
    }
  },

  // Like a PDF (create connection with 'curious' status)
  async likePdf(pdfId, userId) {
    if (!supabase) {
      console.warn('Supabase not configured - cannot like PDF')
      return null
    }

    try {
      // Get the PDF to find the founder
      const { data: pdfData, error: pdfError } = await supabase
        .from('pdfs')
        .select('user_id')
        .eq('id', pdfId)
        .single()
      if (pdfError) throw pdfError
      const founderId = pdfData.user_id
      // Check if the liker is a VC (not looking) and the PDF creator is a founder (looking)
      const { data: likerProfile, error: likerError } = await supabase
        .from('profiles')
        .select('isLooking')
        .eq('id', userId)
        .single()
      const { data: creatorProfile, error: creatorError } = await supabase
        .from('profiles')
        .select('isLooking')
        .eq('id', founderId)
        .single()
      console.log('[likePdf] likerProfile:', likerProfile, 'creatorProfile:', creatorProfile)
      if (likerError || creatorError) throw likerError || creatorError
      // Only create connection if VC is liking founder's idea
      if (likerProfile.isLooking === false && creatorProfile.isLooking === true) {
        // Check if connection already exists
        const { data: existingConnection, error: checkError } = await supabase
          .from('connections')
          .select('id')
          .eq('vc_id', userId)
          .eq('founder_id', founderId)
          .eq('idea_id', pdfId)
          .maybeSingle()
        if (checkError) {
          throw checkError
        }
        if (!existingConnection) {
          // Create curious connection
          const connection = await connectionsService.createCuriousConnection(userId, founderId, pdfId)
          console.log('[likePdf] Created new connection:', connection)
          return connection
        } else {
          // Connection already exists, return success
          console.log('[likePdf] Connection already exists:', existingConnection)
          return existingConnection
        }
      } else {
        // For founder liking founder's idea or VC liking VC's idea, just return success
        console.log('[likePdf] Not allowed to like: likerProfile.isLooking:', likerProfile.isLooking, 'creatorProfile.isLooking:', creatorProfile.isLooking)
        return { id: pdfId }
      }
    } catch (error) {
      console.error('Error liking PDF:', error)
      return null
    }
  },

  // Unlike a PDF (delete connection or update status)
  async unlikePdf(pdfId, userId) {
    if (!supabase) {
      console.warn('Supabase not configured - cannot unlike PDF')
      return null
    }

    try {
      // Get the PDF to find the founder
      const { data: pdfData, error: pdfError } = await supabase
        .from('pdfs')
        .select('user_id')
        .eq('id', pdfId)
        .single()
      
      if (pdfError) throw pdfError
      
      const founderId = pdfData.user_id
      
      // Find the connection
      const { data: connection, error: connectionError } = await supabase
        .from('connections')
        .select('id, status')
        .eq('vc_id', userId)
        .eq('founder_id', founderId)
        .eq('idea_id', pdfId)
        .maybeSingle()
      
      if (connectionError) {
        throw connectionError
      }
      
      if (connection) {
        // If connection exists, delete it
        const { error: deleteError } = await supabase
          .from('connections')
          .delete()
          .eq('id', connection.id)
        
        if (deleteError) throw deleteError
      }
      
      return { id: pdfId }
    } catch (error) {
      console.error('Error unliking PDF:', error)
      return null
    }
  },

  // Pass a PDF (create connection with 'blocked' status to track passed ideas)
  async passPdf(pdfId, userId) {
    if (!supabase) {
      console.warn('Supabase not configured - cannot pass PDF')
      return null
    }

    try {
      console.log('passPdf called with pdfId:', pdfId, 'userId:', userId)
      
      // Get the PDF to find the founder
      const { data: pdfData, error: pdfError } = await supabase
        .from('pdfs')
        .select('user_id')
        .eq('id', pdfId)
        .single()
      
      if (pdfError) throw pdfError
      
      const founderId = pdfData.user_id
      console.log('Found founderId:', founderId)
      
      // Check if connection already exists
      const { data: existingConnection, error: checkError } = await supabase
        .from('connections')
        .select('id')
        .eq('vc_id', userId)
        .eq('founder_id', founderId)
        .eq('idea_id', pdfId)
        .maybeSingle()
      
      if (checkError) {
        throw checkError
      }
      
      console.log('Existing connection:', existingConnection)
      
      if (!existingConnection) {
        // Create blocked connection to track passed idea
        console.log('Creating new blocked connection')
        const { data, error } = await supabase
          .from('connections')
          .insert([
            {
              vc_id: userId,
              founder_id: founderId,
              idea_id: pdfId,
              status: 'blocked'
            }
          ])
          .select()
        
        if (error) throw error
        console.log('Created connection:', data?.[0])
        return data?.[0] || null
      } else {
        // Connection already exists, update status to blocked
        console.log('Updating existing connection to blocked')
        const { data, error } = await supabase
          .from('connections')
          .update({ status: 'blocked' })
          .eq('id', existingConnection.id)
          .select()
        
        if (error) throw error
        console.log('Updated connection:', data?.[0])
        return data?.[0] || null
      }
    } catch (error) {
      console.error('Error passing PDF:', error)
      return null
    }
  },

  // Unpass a PDF (delete blocked connection)
  async unpassPdf(pdfId, userId) {
    if (!supabase) {
      console.warn('Supabase not configured - cannot unpass PDF')
      return null
    }

    try {
      // Get the PDF to find the founder
      const { data: pdfData, error: pdfError } = await supabase
        .from('pdfs')
        .select('user_id')
        .eq('id', pdfId)
        .single()
      
      if (pdfError) throw pdfError
      
      const founderId = pdfData.user_id
      
      // Find the blocked connection
      const { data: connection, error: connectionError } = await supabase
        .from('connections')
        .select('id')
        .eq('vc_id', userId)
        .eq('founder_id', founderId)
        .eq('idea_id', pdfId)
        .eq('status', 'blocked')
        .maybeSingle()
      
      if (connectionError) {
        throw connectionError
      }
      
      if (connection) {
        // Delete the blocked connection
        const { error: deleteError } = await supabase
          .from('connections')
          .delete()
          .eq('id', connection.id)
        
        if (deleteError) throw deleteError
      }
      
      return { id: pdfId }
    } catch (error) {
      console.error('Error unpassing PDF:', error)
      return null
    }
  },

  // Get PDFs passed by a specific user (using connections table with 'blocked' status)
  async getPassedPdfsByUser(userId) {
    if (!supabase) {
      console.warn('Supabase not configured - cannot get passed PDFs by user')
      return []
    }

    try {
      console.log('getPassedPdfsByUser called for userId:', userId)
      
      // Get connections where user is the VC and status is blocked
      const { data: connections, error: connectionsError } = await supabase
        .from('connections')
        .select('*, idea:idea_id (*, creator:user_id (name, link, vcphotourl, vcphotolink))')
        .eq('vc_id', userId)
        .eq('status', 'blocked')
        .order('created_at', { ascending: false })
      
      if (connectionsError) throw connectionsError
      
      console.log('Found connections with blocked status:', connections?.length || 0)
      console.log('Connections data:', connections)
      
      if (!connections || connections.length === 0) {
        return []
      }

      // Extract PDFs from connections and add creator info
      const result = connections.map(conn => ({
        ...conn.idea,
        profilePicture: conn.idea?.creator?.vcphotourl || conn.idea?.creator?.vcphotolink || null,
        profileName: conn.idea?.creator?.name || null,
        connectionId: conn.id,
        connectionStatus: conn.status
      }))
      
      console.log('Processed passed PDFs:', result.length)
      return result
    } catch (error) {
      console.error('Error fetching passed PDFs:', error)
      return []
    }
  },

  // Get PDFs liked by VCs (users not looking - isLooking = false)
  async getVCLikedPdfs() {
    if (!supabase) {
      console.warn('Supabase not configured - cannot get VC liked PDFs')
      return []
    }

    try {
      // Get all VC profiles with liked_pdfs
      const { data: vcProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, liked_pdfs')
        .eq('isLooking', false)
        .not('liked_pdfs', 'eq', '{}')
      
      if (profilesError) throw profilesError

      // Get all liked PDF IDs from VCs
      const vcLikedPdfIds = new Set()
      vcProfiles.forEach(profile => {
        profile.liked_pdfs?.forEach(pdfId => vcLikedPdfIds.add(pdfId))
      })

      if (vcLikedPdfIds.size === 0) {
        return []
      }

      // Fetch the actual PDFs
      const { data, error } = await supabase
        .from('pdfs')
        .select('*')
        .in('id', [...vcLikedPdfIds])
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching VC liked PDFs:', error)
      return []
    }
  },

  // Get VCs with their liked ideas (organized by VC) - only for current founder's ideas
  async getVCLikedIdeasByVC(currentFounderId) {
    if (!supabase) {
      console.warn('Supabase not configured - cannot get VC liked ideas by VC')
      return []
    }

    try {
      // Get connections where the founder is the creator and status is pending, requested, or connected (founder has reciprocated)
      const { data: connections, error: connectionsError } = await supabase
        .from('connections')
        .select('*, vc:vc_id (name, link, vcphotourl), idea:idea_id (*)')
        .eq('founder_id', currentFounderId)
        .in('status', ['pending', 'requested', 'connected'])
        .order('created_at', { ascending: false })
      
      if (connectionsError) throw connectionsError
      
      if (!connections || connections.length === 0) {
        return []
      }

      // Group connections by VC
      const vcMap = new Map()
      
      connections.forEach(conn => {
        const vcId = conn.vc_id
        if (!vcMap.has(vcId)) {
          vcMap.set(vcId, {
            vcId: vcId,
            vcName: conn.vc?.name || `VC ${vcId.slice(0, 8)}...`,
            vcLinkedin: conn.vc?.link,
            vcPhoto: conn.vc?.vcphotourl,
            likedIdeas: []
          })
        }
        
        if (conn.idea) {
          vcMap.get(vcId).likedIdeas.push({
            id: conn.idea.id,
            idea_name: conn.idea.idea_name,
            created_at: conn.idea.created_at,
            connectionId: conn.id,
            connectionStatus: conn.status
          })
        }
      })

      // Convert map to array and sort ideas by creation date
      const vcsWithLikedIdeas = Array.from(vcMap.values()).map(vc => ({
        ...vc,
        likedIdeas: vc.likedIdeas.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      }))

      return vcsWithLikedIdeas
    } catch (error) {
      console.error('Error fetching VC liked ideas by VC:', error)
      return []
    }
  },

  // Get matched PDFs (liked by both VCs and founders) - only for VCs
  async getMatchedPdfs() {
    if (!supabase) {
      console.warn('Supabase not configured - cannot get matched PDFs')
      return []
    }

    try {
      // Get all profiles with liked_pdfs
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, liked_pdfs, isLooking')
        .not('liked_pdfs', 'eq', '{}')
      
      if (profilesError) throw profilesError

      // Separate VCs and founders
      const vcProfiles = profiles.filter(p => p.isLooking === false)
      const founderProfiles = profiles.filter(p => p.isLooking === true)

      // Get all liked PDF IDs from VCs
      const vcLikedPdfIds = new Set()
      vcProfiles.forEach(profile => {
        profile.liked_pdfs?.forEach(pdfId => vcLikedPdfIds.add(pdfId))
      })

      // Get all liked PDF IDs from founders
      const founderLikedPdfIds = new Set()
      founderProfiles.forEach(profile => {
        profile.liked_pdfs?.forEach(pdfId => founderLikedPdfIds.add(pdfId))
      })

      // Find intersection (PDFs liked by both VCs and founders)
      const matchedPdfIds = [...vcLikedPdfIds].filter(id => founderLikedPdfIds.has(id))

      if (matchedPdfIds.length === 0) {
        return []
      }

      // Fetch the actual PDFs
      const { data, error } = await supabase
        .from('pdfs')
        .select('*')
        .in('id', matchedPdfIds)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching matched PDFs:', error)
      return []
    }
  },

  // Get connection requests for founders
  async getConnectionRequests(founderId) {
    if (!supabase) {
      console.warn('Supabase not configured - cannot get connection requests')
      return []
    }

    try {
      const { data, error } = await supabase
        .from('connections')
        .select(`
          id,
          status,
          created_at,
          vc_id,
          idea_id,
          messages (
            id,
            content,
            message_type,
            created_at
          )
        `)
        .eq('founder_id', founderId)
        .in('status', ['pending', 'requested', 'connected'])
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching connection requests:', error)
      return []
    }
  },

  // Create a connection request from VC to founder
  async createConnectionRequest(vcId, founderId, message) {
    if (!supabase) {
      console.warn('Supabase not configured - cannot create connection request')
      return null
    }

    try {
      // First create the connection
      const { data: connection, error: connectionError } = await supabase
        .from('connections')
        .insert([
          {
            vc_id: vcId,
            founder_id: founderId,
            status: 'pending'
          }
        ])
        .select()
        .maybeSingle()
      
      if (connectionError) throw connectionError

      // Then create the message
      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .insert([
          {
            connection_id: connection.id,
            sender_id: vcId,
            content: message,
            message_type: 'text'
          }
        ])
        .select()
      
      if (messageError) throw messageError

      return connection
    } catch (error) {
      console.error('Error creating connection request:', error)
      return null
    }
  }
}

// Profiles service
export const profilesService = {
  // Get user profile
  async getProfile(userId) {
    if (!supabase) {
      console.warn('Supabase not configured - cannot get profile')
      return null
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  },

  // Create or update user profile
  async upsertProfile(profile) {
    if (!supabase) {
      console.warn('Supabase not configured - cannot upsert profile')
      return null
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert(profile)
        .select()
      
      if (error) throw error
      return data?.[0] || null
    } catch (error) {
      console.error('Error upserting profile:', error)
      return null
    }
  },

  // Get VCs (users not looking - isLooking = false)
  async getVCs() {
    if (!supabase) {
      console.warn('Supabase not configured - cannot get VCs')
      return []
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('isLooking', false)
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching VCs:', error)
      return []
    }
  },

  // Get founders (users looking - isLooking = true)
  async getFounders() {
    if (!supabase) {
      console.warn('Supabase not configured - cannot get founders')
      return []
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('isLooking', true)
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching founders:', error)
      return []
    }
  }
}

// --- CONNECTIONS SERVICE ---
export const connectionsService = {
  async createCuriousConnection(vcId, founderId, ideaId) {
    if (!supabase) {
      console.warn('Supabase not configured - cannot create curious connection')
      return null
    }
    try {
      const { data, error } = await supabase
        .from('connections')
        .insert([
          {
            vc_id: vcId,
            founder_id: founderId,
            idea_id: ideaId,
            status: 'curious'
          }
        ])
        .select()
      if (error) {
        console.error('Error creating curious connection:', error)
        throw error
      }
      return data?.[0] || null
    } catch (error) {
      console.error('Error creating curious connection:', error)
      return null
    }
  },
  async likeVC(founderId, vcId, ideaId) {
    if (!supabase) {
      console.warn('Supabase not configured - cannot like VC')
      return null
    }
    try {
      const { data, error } = await supabase
        .from('connections')
        .update({ status: 'pending' })
        .eq('vc_id', vcId)
        .eq('founder_id', founderId)
        .eq('idea_id', ideaId)
        .eq('status', 'curious')
        .select()
        .maybeSingle()
      if (error) throw error
      return data || null
    } catch (error) {
      console.error('Error liking VC:', error)
      return null
    }
  },
  async requestConnection(vcId, founderId, ideaId, message) {
    if (!supabase) {
      console.warn('Supabase not configured - cannot request connection')
      return null
    }
    try {
      const { data: connection, error: connectionError } = await supabase
        .from('connections')
        .update({ status: 'requested' })
        .eq('vc_id', vcId)
        .eq('founder_id', founderId)
        .eq('idea_id', ideaId)
        .eq('status', 'pending')
        .select()
        .maybeSingle()
      if (connectionError) throw connectionError
      if (!connection) return null
      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .insert([
          {
            connection_id: connection.id,
            sender_id: vcId,
            content: message,
            message_type: 'text'
          }
        ])
        .select()
      if (messageError) throw messageError
      return connection
    } catch (error) {
      console.error('Error requesting connection:', error)
      return null
    }
  },
  async acceptConnection(connectionId) {
    if (!supabase) {
      console.warn('Supabase not configured - cannot accept connection')
      return null
    }
    try {
      const { data, error } = await supabase
        .from('connections')
        .update({ status: 'connected' })
        .eq('id', connectionId)
        .eq('status', 'requested')
        .select()
      if (error) throw error
      return data?.[0] || null
    } catch (error) {
      console.error('Error accepting connection:', error)
      return null
    }
  },
  async getConnectionsByStatus(userId, status) {
    if (!supabase) {
      console.warn('Supabase not configured - cannot get connections by status')
      return []
    }
    try {
      const { data, error } = await supabase
        .from('connections')
        .select('*, vc:vc_id (name, link, vcphotourl), founder:founder_id (name, link), idea:idea_id (idea_name)')
        .or(`vc_id.eq.${userId},founder_id.eq.${userId}`)
        .eq('status', status)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching connections by status:', error)
      return []
    }
  },
  async getFounderConnectionsByStatus(founderId, status) {
    if (!supabase) {
      console.warn('Supabase not configured - cannot get founder connections by status')
      return []
    }
    try {
      const { data, error } = await supabase
        .from('connections')
        .select('*, vc:vc_id (name, link, vcphotourl), idea:idea_id (idea_name)')
        .eq('founder_id', founderId)
        .eq('status', status)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching founder connections by status:', error)
      return []
    }
  },
  async getConnections(userId) {
    if (!supabase) {
      console.warn('Supabase not configured - cannot get all connections')
      return []
    }
    try {
      const { data, error } = await supabase
        .from('connections')
        .select('*')
        .or(`vc_id.eq.${userId},founder_id.eq.${userId}`)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching connections:', error)
      return []
    }
  },
  async updateConnectionStatus(connectionId, status) {
    if (!supabase) {
      console.warn('Supabase not configured - cannot update connection status')
      return null
    }
    try {
      const { data, error } = await supabase
        .from('connections')
        .update({ status })
        .eq('id', connectionId)
        .select()
      if (error) throw error
      return data?.[0] || null
    } catch (error) {
      console.error('Error updating connection status:', error)
      return null
    }
  }
}

// Messages service
export const messagesService = {
  // Send a message
  async sendMessage(connectionId, senderId, content, messageType = 'text') {
    if (!supabase) {
      console.warn('Supabase not configured - cannot send message')
      return null
    }

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            connection_id: connectionId,
            sender_id: senderId,
            content,
            message_type: messageType
          }
        ])
        .select()
      
      if (error) throw error
      return data?.[0] || null
    } catch (error) {
      console.error('Error sending message:', error)
      return null
    }
  },

  // Get messages for a connection
  async getMessages(connectionId) {
    if (!supabase) {
      console.warn('Supabase not configured - cannot get messages')
      return []
    }

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('connection_id', connectionId)
        .order('created_at', { ascending: true })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching messages:', error)
      return []
    }
  },

  // Mark message as read
  async markMessageAsRead(messageId) {
    if (!supabase) {
      console.warn('Supabase not configured - cannot mark message as read')
      return null
    }

    try {
      const { data, error } = await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('id', messageId)
        .select()
      
      if (error) throw error
      return data?.[0] || null
    } catch (error) {
      console.error('Error marking message as read:', error)
      return null
    }
  }
} 