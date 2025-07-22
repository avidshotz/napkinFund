'use client'

export default function ModalItem({ 
  item, 
  onAction, 
  actionIcon, 
  actionTitle,
  actionButtonClass = "text-red-500 hover:text-red-700 transition-colors ml-3 p-1",
  showProfile = false
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-white rounded border border-gray-200 shadow-sm">
      <div className="flex-1 text-center">
        {showProfile && (
          <div className="flex flex-col items-center mb-2">
            {item.creatorPhoto && (
              <img
                src={item.creatorPhoto}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border border-gray-300 mb-1"
              />
            )}
            <div className="text-xs text-gray-700 font-medium">
              {item.creatorName}
              {item.creatorLinkedin && (
                <a href={item.creatorLinkedin} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 underline">LinkedIn</a>
              )}
            </div>
          </div>
        )}
        <p className="text-sm font-medium text-gray-800 mb-1">
          {item.idea_name}
        </p>
        {item.link && (
          <p className="text-xs text-blue-600 mb-1">
            <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {item.link}
            </a>
          </p>
        )}
        <p className="text-xs text-gray-500">
          Created: {new Date(item.created_at).toLocaleDateString()}
        </p>
      </div>
      <button 
        onClick={() => onAction(item.id)}
        className={actionButtonClass}
        title={actionTitle}
      >
        {actionIcon}
      </button>
    </div>
  );
} 