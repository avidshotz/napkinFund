'use client'

import NapkinCard from '../NapkinCard'

export default function SubmitNapkin({ onSubmit, oneLiner, setOneLiner, width = 400, height = 300 }) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSubmit()
    }
  }

  return (
    <NapkinCard width={width} height={height}>
      <h2 className="text-lg font-semibold mb-4">Submit your one-liner here</h2>
      <input 
        type="text" 
        placeholder="Enter your one-liner here" 
        className="w-full p-2 border border-gray-300 rounded-md"
        value={oneLiner}
        onChange={(e) => setOneLiner(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button 
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        onClick={onSubmit}
      >
        Submit
      </button>
    </NapkinCard>
  )
} 