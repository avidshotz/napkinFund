import { useState } from 'react';
import NapkinModal from './NapkinModal';

export default function ConnectionsModal({ isOpen, onClose, connectionRequests, role, onRequestConnection, onAcceptConnection, onDisconnectConnection, onOpenLikesModal, onOpenPassedModal }) {
  const [showDetailsId, setShowDetailsId] = useState(null);
  const [showConfirmDisconnectId, setShowConfirmDisconnectId] = useState(null);
  const [showConfirmPassId, setShowConfirmPassId] = useState(null);

  // Sort: pending first, then requested, then connected (chronologically)
  const sortedConnections = (connectionRequests || []).slice().sort((a, b) => {
    if (a.status === b.status) {
      return new Date(a.created_at) - new Date(a.created_at);
    }
    if (a.status === 'pending') return -1;
    if (b.status === 'pending') return 1;
    if (a.status === 'requested') return -1;
    if (b.status === 'requested') return 1;
    if (a.status === 'connected') return 1;
    if (b.status === 'connected') return -1;
    return 0;
  });

  const customHeader = (
    <div className="flex-1 flex items-center justify-between">
      <button
        onClick={onOpenPassedModal}
        className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm"
      >
        Passed
      </button>
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-800">Connections</h2>
        <p className="text-sm text-gray-600 mt-1">Manage your connections.</p>
      </div>
      <button
        onClick={onOpenLikesModal}
        className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm"
      >
        Likes
      </button>
    </div>
  );

  // Get button properties based on status and role
  const getButtonProps = (conn) => {
    if (role === 'vc') {
      if (conn.status === 'pending') {
        return {
          text: 'Request Connection',
          className: 'bg-green-500 hover:bg-green-600',
          onClick: () => onRequestConnection(conn.founder_id, conn.idea_id, 'Let\'s connect!')
        };
      } else if (conn.status === 'requested') {
        return {
          text: 'Requested',
          className: 'bg-blue-500 hover:bg-blue-600',
          onClick: () => {} // No action needed
        };
      } else if (conn.status === 'connected') {
        return {
          text: 'Connected',
          className: 'bg-orange-500 hover:bg-orange-600',
          onClick: () => setShowDetailsId(conn.id)
        };
      }
    } else if (role === 'founder') {
      if (conn.status === 'requested') {
        return {
          text: 'Accept',
          className: 'bg-green-500 hover:bg-green-600',
          onClick: () => onAcceptConnection(conn.id)
        };
      } else if (conn.status === 'connected') {
        return {
          text: 'Connected',
          className: 'bg-orange-500 hover:bg-orange-600',
          onClick: () => setShowDetailsId(conn.id)
        };
      }
    }
    return null;
  };

  const handlePassClick = (conn) => {
    if (conn.status === 'connected') {
      // Show confirmation modal for connected users
      setShowConfirmPassId(conn.id);
    } else {
      // Direct pass for non-connected users
      console.log('Pass connection:', conn.id);
      // Implement actual pass logic here
    }
  };

  return (
    <NapkinModal
      isOpen={isOpen}
      onClose={onClose}
      title="Connections"
      description="Manage your connections."
      width={600}
      height={500}
      customHeader={customHeader}
    >
      {sortedConnections.length > 0 ? (
        <div className="space-y-3">
          {sortedConnections.map((conn) => {
            const buttonProps = getButtonProps(conn);
            
            return (
              <div key={conn.id} className="p-3 bg-white rounded border border-gray-200 shadow-sm flex flex-col">
                <div className="flex justify-between items-center">
                  <div>
                    {role === 'founder' ? (
                      <>
                        <div className="font-medium text-gray-800">{conn.vcName || conn.vc_id}</div>
                        {conn.vcLinkedin && (
                          <div>
                            <a href={conn.vcLinkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">LinkedIn</a>
                          </div>
                        )}
                        <div className="text-xs text-gray-500">Idea: {conn.ideaName || conn.idea_id}</div>
                      </>
                    ) : (
                      <>
                        <div className="font-medium text-gray-800">{conn.founderName || conn.founder_id}</div>
                        {conn.founderLinkedin && (
                          <div>
                            <a href={conn.founderLinkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">LinkedIn</a>
                          </div>
                        )}
                        <div className="text-xs text-gray-500">Idea: {conn.ideaName || conn.idea_id}</div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">{new Date(conn.created_at).toLocaleDateString()}</span>
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                      onClick={() => handlePassClick(conn)}
                    >
                      Pass
                    </button>
                  </div>
                </div>
                {/* Single dynamic button based on status */}
                {buttonProps && (
                  <button
                    className={`mt-2 px-3 py-1 text-white rounded text-xs self-end ${buttonProps.className}`}
                    onClick={buttonProps.onClick}
                  >
                    {buttonProps.text}
                  </button>
                )}
                {/* Details Modal for Accepted connection */}
                {showDetailsId === conn.id && (
                  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-80 relative">
                      <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowDetailsId(null)}>&times;</button>
                      <div className="mb-2 font-semibold text-lg">Connection Details</div>
                      <div className="mb-2">VC: <span className="font-medium">{conn.vcName}</span></div>
                      {conn.vcLinkedin && (
                        <div className="mb-2">
                          <a href={conn.vcLinkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View LinkedIn</a>
                        </div>
                      )}
                      <button
                        className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 mt-2"
                        onClick={() => setShowConfirmDisconnectId(conn.id)}
                      >
                        Disconnect
                      </button>
                    </div>
                  </div>
                )}
                {/* Are you sure modal for disconnect */}
                {showConfirmDisconnectId === conn.id && (
                  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-72">
                      <div className="mb-4 text-center">Are you sure you want to disconnect from <span className="font-semibold">{conn.vcName}</span>?</div>
                      <div className="flex justify-between">
                        <button
                          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                          onClick={() => setShowConfirmDisconnectId(null)}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                          onClick={() => { onDisconnectConnection(conn.id); setShowConfirmDisconnectId(null); setShowDetailsId(null); }}
                        >
                          Disconnect
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {/* Are you sure modal for pass on connected user */}
                {showConfirmPassId === conn.id && (
                  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-72">
                      <div className="mb-4 text-center">
                        Are you sure you want to pass on <span className="font-semibold">
                          {role === 'founder' ? conn.vcName : conn.founderName}
                        </span>?
                      </div>
                      <div className="mb-4 text-center text-sm text-gray-600">
                        This will remove them from your connections and take them out of consideration.
                      </div>
                      <div className="flex justify-between">
                        <button
                          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                          onClick={() => setShowConfirmPassId(null)}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                          onClick={() => { 
                            console.log('Pass connection:', conn.id);
                            // Implement actual pass logic here
                            setShowConfirmPassId(null); 
                          }}
                        >
                          Pass
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center h-32">
          <p className="text-gray-500 text-center">No connections.</p>
        </div>
      )}
    </NapkinModal>
  );
} 