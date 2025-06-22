import { ColorOverrideExample } from './ColorOverrideExample'

export const ColorConfiguration = () => {
  return (
    <>
      <h3 className=' text-xl font-semibold mt-8 text-black'>Colors</h3>
      
      {/* Method 1: Global Color Override */}
      <div className='p-6 rounded-md border mt-4 '>
        <p className='text-base font-medium text-black/60'>
          <span className='font-semibold text-lg text-black'>
            1. Global Color Override
          </span>{' '}
          <br />
          To change colors globally, edit the <code className='bg-gray-100 px-2 py-1 rounded text-sm'>@theme</code> section in <code className='bg-gray-100 px-2 py-1 rounded text-sm'>src/app/globals.css</code>
        </p>
        <div className='py-4 px-5 rounded-md bg-gray-100 mt-4'>
          <p className='text-sm text-gray-700 flex flex-col gap-2 font-mono'>
            <span className='text-green-600'>/* In globals.css */</span>
            <span>@theme &#123;</span>
            <span className='ml-4'>--color-primary: #df6853;</span>
            <span className='ml-4'>--color-grey: #363636;</span>
            <span className='ml-4'>--color-success: #10b981;</span>
            <span className='ml-4'>--color-warning: #f59e0b;</span>
            <span className='ml-4'>--color-error: #ef4444;</span>
            <span>&#125;</span>
          </p>
        </div>
      </div>

      {/* Method 2: CSS Custom Properties */}
      <div className='p-6 rounded-md border mt-4 '>
        <p className='text-base font-medium text-black/60'>
          <span className='font-semibold text-lg text-black'>
            2. CSS Custom Properties Override
          </span>{' '}
          <br />
          Use CSS custom properties for dynamic color changes and theme switching
        </p>
        <div className='py-4 px-5 rounded-md bg-gray-100 mt-4'>
          <p className='text-sm text-gray-700 flex flex-col gap-2 font-mono'>
            <span className='text-green-600'>/* Component-level override */</span>
            <span>.my-component &#123;</span>
            <span className='ml-4'>--color-primary: #3b82f6;</span>
            <span className='ml-4'>background-color: var(--color-primary);</span>
            <span>&#125;</span>
          </p>
        </div>
      </div>

      {/* Method 3: Tailwind Utilities */}
      <div className='p-6 rounded-md border mt-4 '>
        <p className='text-base font-medium text-black/60'>
          <span className='font-semibold text-lg text-black'>
            3. Tailwind Utility Classes
          </span>{' '}
          <br />
          Use Tailwind's color utilities with custom values
        </p>
        <div className='py-4 px-5 rounded-md bg-gray-100 mt-4'>
          <p className='text-sm text-gray-700 flex flex-col gap-2 font-mono'>
            <span className='text-green-600'>/* JSX Examples */</span>
            <span>&lt;div className="bg-primary text-white"&gt;</span>
            <span>&lt;div className="bg-[#custom-color]"&gt;</span>
            <span>&lt;div style=&#123;&#123;backgroundColor: 'var(--color-primary)'&#125;&#125;&gt;</span>
          </p>
        </div>
      </div>

      {/* Method 4: Dark Mode Colors */}
      <div className='p-6 rounded-md border mt-4 '>
        <p className='text-base font-medium text-black/60'>
          <span className='font-semibold text-lg text-black'>
            4. Dark Mode Color Override
          </span>{' '}
          <br />
          Define different colors for dark mode using CSS custom properties
        </p>
        <div className='py-4 px-5 rounded-md bg-gray-100 mt-4'>
          <p className='text-sm text-gray-700 flex flex-col gap-2 font-mono'>
            <span className='text-green-600'>/* Dark mode colors */</span>
            <span>@media (prefers-color-scheme: dark) &#123;</span>
            <span className='ml-4'>:root &#123;</span>
            <span className='ml-6'>--color-primary: #60a5fa;</span>
            <span className='ml-6'>--color-grey: #f3f4f6;</span>
            <span className='ml-4'>&#125;</span>
            <span>&#125;</span>
          </p>
        </div>
      </div>

      {/* Current Color Palette */}
      <div className='p-6 rounded-md border mt-4 '>
        <p className='text-base font-medium text-black/60'>
          <span className='font-semibold text-lg text-black'>
            Current Color Palette
          </span>
        </p>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-4'>
          <div className='text-center'>
            <div className='w-16 h-16 bg-primary rounded-lg mx-auto mb-2'></div>
            <p className='text-sm font-medium'>Primary</p>
            <p className='text-xs text-gray-500'>#df6853</p>
          </div>
          <div className='text-center'>
            <div className='w-16 h-16 bg-grey rounded-lg mx-auto mb-2'></div>
            <p className='text-sm font-medium'>Grey</p>
            <p className='text-xs text-gray-500'>#363636</p>
          </div>
          <div className='text-center'>
            <div className='w-16 h-16 bg-black rounded-lg mx-auto mb-2'></div>
            <p className='text-sm font-medium'>Black</p>
            <p className='text-xs text-gray-500'>#000000</p>
          </div>
          <div className='text-center'>
            <div className='w-16 h-16 bg-white border rounded-lg mx-auto mb-2'></div>
            <p className='text-sm font-medium'>White</p>
            <p className='text-xs text-gray-500'>#ffffff</p>
          </div>
        </div>
      </div>

      {/* Interactive Example */}
      <ColorOverrideExample />
    </>
  )
}
