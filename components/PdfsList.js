'use client'

import { useState } from 'react'
import NapkinCard from '../NapkinCard'

export default function PdfsList({ 
  items, 
  onEdit, 
  onDelete, 
  width = 400, 
  height = 300,
  emptyMessage = "No PDFs yet."
}) {
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  const handleEdit = (item) => {
    setEditingId(item.id)
    setEditText(item.idea_name)
  }

  const handleSave = (id) => {
    onEdit(id, editText)
    setEditingId(null)
    setEditText('')
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditText('')
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this PDF?')) {
      onDelete(id)
    }
  }

  return (
    <NapkinCard width={width} height={height}>
      <h2 className="text-lg font-semibold mb-4">All PDFs</h2>
      <p className="mb-3">Browse all submitted PDFs.</p>
      {items.length > 0 ? (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              {editingId === item.id ? (
                <div className="flex-1 flex items-center space-x-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 text-sm border border-gray-300 rounded px-2 py-1"
                    autoFocus
                  />
                  <button 
                    onClick={() => handleSave(item.id)}
                    className="text-green-600 hover:text-green-800 transition-colors"
                    title="Save"
                  >
                    ✅
                  </button>
                  <button 
                    onClick={handleCancel}
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                    title="Cancel"
                  >
                    ❌
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-sm flex-1">{item.idea_name}</span>
                  <div className="flex items-center space-x-1">
                    <button 
                      onClick={() => handleEdit(item)}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                      title="Edit this item"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Delete this item"
                    >
                      🗑️
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-48">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      )}
    </NapkinCard>
  )
} 