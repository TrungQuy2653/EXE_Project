'use client'
import React, { useState } from 'react'

export const ColorOverrideExample = () => {
  const [selectedColor, setSelectedColor] = useState('#df6853')
  const [customColors, setCustomColors] = useState({
    primary: '#df6853',
    secondary: '#363636',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  })

  const handleColorChange = (colorType: string, newColor: string) => {
    setCustomColors(prev => ({
      ...prev,
      [colorType]: newColor
    }))
    
    // Apply the color change to CSS custom properties
    document.documentElement.style.setProperty(`--color-${colorType}`, newColor)
  }

  const resetColors = () => {
    const defaultColors = {
      primary: '#df6853',
      secondary: '#363636',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    }
    
    setCustomColors(defaultColors)
    
    // Reset CSS custom properties
    Object.entries(defaultColors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--color-${key}`, value)
    })
  }

  return (
    <div className='p-6 rounded-md border mt-4'>
      <h4 className='text-lg font-semibold text-black mb-4'>
        Interactive Color Override Example
      </h4>
      
      {/* Color Controls */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6'>
        {Object.entries(customColors).map(([colorType, colorValue]) => (
          <div key={colorType} className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700 capitalize'>
              {colorType} Color
            </label>
            <div className='flex items-center space-x-2'>
              <input
                type='color'
                value={colorValue}
                onChange={(e) => handleColorChange(colorType, e.target.value)}
                className='w-10 h-10 rounded border border-gray-300 cursor-pointer'
              />
              <input
                type='text'
                value={colorValue}
                onChange={(e) => handleColorChange(colorType, e.target.value)}
                className='flex-1 px-3 py-2 border border-gray-300 rounded text-sm font-mono'
                placeholder='#000000'
              />
            </div>
          </div>
        ))}
      </div>

      {/* Reset Button */}
      <button
        onClick={resetColors}
        className='mb-6 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors'
      >
        Reset to Default Colors
      </button>

      {/* Preview Components */}
      <div className='space-y-4'>
        <h5 className='text-md font-medium text-black'>Live Preview:</h5>
        
        {/* Button Examples */}
        <div className='flex flex-wrap gap-3'>
          <button 
            className='px-4 py-2 rounded text-white font-medium'
            style={{ backgroundColor: customColors.primary }}
          >
            Primary Button
          </button>
          <button 
            className='px-4 py-2 rounded text-white font-medium'
            style={{ backgroundColor: customColors.secondary }}
          >
            Secondary Button
          </button>
          <button 
            className='px-4 py-2 rounded text-white font-medium'
            style={{ backgroundColor: customColors.success }}
          >
            Success Button
          </button>
          <button 
            className='px-4 py-2 rounded text-white font-medium'
            style={{ backgroundColor: customColors.warning }}
          >
            Warning Button
          </button>
          <button 
            className='px-4 py-2 rounded text-white font-medium'
            style={{ backgroundColor: customColors.error }}
          >
            Error Button
          </button>
        </div>

        {/* Card Example */}
        <div 
          className='p-4 rounded-lg border-l-4 bg-gray-50'
          style={{ borderLeftColor: customColors.primary }}
        >
          <h6 className='font-semibold text-gray-900'>Sample Card</h6>
          <p className='text-gray-600 mt-1'>
            This card uses the primary color for its left border. Change the primary color above to see it update in real-time.
          </p>
        </div>

        {/* Alert Examples */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div 
            className='p-3 rounded border-l-4 bg-green-50'
            style={{ borderLeftColor: customColors.success }}
          >
            <p className='text-sm font-medium text-green-800'>Success Alert</p>
            <p className='text-sm text-green-700'>Operation completed successfully!</p>
          </div>
          <div 
            className='p-3 rounded border-l-4 bg-red-50'
            style={{ borderLeftColor: customColors.error }}
          >
            <p className='text-sm font-medium text-red-800'>Error Alert</p>
            <p className='text-sm text-red-700'>Something went wrong!</p>
          </div>
        </div>
      </div>

      {/* CSS Code Example */}
      <div className='mt-6 p-4 bg-gray-100 rounded'>
        <h6 className='text-sm font-semibold text-gray-800 mb-2'>Generated CSS:</h6>
        <pre className='text-xs text-gray-700 font-mono overflow-x-auto'>
{`:root {
  --color-primary: ${customColors.primary};
  --color-secondary: ${customColors.secondary};
  --color-success: ${customColors.success};
  --color-warning: ${customColors.warning};
  --color-error: ${customColors.error};
}`}
        </pre>
      </div>
    </div>
  )
}
