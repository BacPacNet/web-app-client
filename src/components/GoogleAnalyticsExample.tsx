'use client'

import { useGoogleAnalytics } from '@/hooks/useGoogleAnalytics'

export default function GoogleAnalyticsExample() {
  const {
    trackUserRegistration,
    trackUserLogin,
    trackPostCreation,
    trackCommunityJoin,
    trackSearch,
    trackButtonClick,
    trackFormSubmission,
    trackFileUpload,
    trackShare,
    trackError,
  } = useGoogleAnalytics()

  const handleRegistration = () => {
    // Example: Track user registration
    trackUserRegistration('email')
    console.log('User registration tracked')
  }

  const handleLogin = () => {
    // Example: Track user login
    trackUserLogin('email')
    console.log('User login tracked')
  }

  const handlePostCreation = () => {
    // Example: Track post creation
    trackPostCreation('text_post')
    console.log('Post creation tracked')
  }

  const handleCommunityJoin = () => {
    // Example: Track community join
    trackCommunityJoin('university_community')
    console.log('Community join tracked')
  }

  const handleSearch = () => {
    // Example: Track search
    trackSearch('university_search')
    console.log('Search tracked')
  }

  const handleButtonClick = () => {
    // Example: Track button click
    trackButtonClick('cta_button', 'landing_page')
    console.log('Button click tracked')
  }

  const handleFormSubmission = () => {
    // Example: Track form submission
    trackFormSubmission('contact_form', true)
    console.log('Form submission tracked')
  }

  const handleFileUpload = () => {
    // Example: Track file upload
    trackFileUpload('image', 1024000) // 1MB in bytes
    console.log('File upload tracked')
  }

  const handleShare = () => {
    // Example: Track share
    trackShare('post', 'facebook')
    console.log('Share tracked')
  }

  const handleError = () => {
    // Example: Track error
    trackError('api_error', 'Failed to fetch data')
    console.log('Error tracked')
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Google Analytics Tracking Examples</h2>
      <p className="text-sm text-gray-600">
        These buttons demonstrate how to track various events in your application. Check the browser console to see tracking messages.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={handleRegistration} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Track Registration
        </button>

        <button onClick={handleLogin} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Track Login
        </button>

        <button onClick={handlePostCreation} className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
          Track Post Creation
        </button>

        <button onClick={handleCommunityJoin} className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
          Track Community Join
        </button>

        <button onClick={handleSearch} className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600">
          Track Search
        </button>

        <button onClick={handleButtonClick} className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">
          Track Button Click
        </button>

        <button onClick={handleFormSubmission} className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600">
          Track Form Submission
        </button>

        <button onClick={handleFileUpload} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
          Track File Upload
        </button>

        <button onClick={handleShare} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Track Share
        </button>

        <button onClick={handleError} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          Track Error
        </button>
      </div>
    </div>
  )
}
