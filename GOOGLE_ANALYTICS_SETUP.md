# Google Analytics Setup Guide

This guide will help you set up Google Analytics 4 (GA4) for your Next.js application.

## Prerequisites

1. **Google Analytics Account**: You need a Google Analytics account
2. **Website Property**: Create a GA4 property for your website
3. **Measurement ID**: Get your unique Measurement ID (format: G-XXXXXXXXXX)

## Step 1: Create Google Analytics Account

1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. Click "Start measuring"
4. Fill in your account details:
   - Account name: Your organization name
   - Data sharing settings: Choose your preferences
5. Click "Next"

## Step 2: Create Property

1. Property name: Your website name (e.g., "UniBuzz")
2. Reporting time zone: Choose your timezone
3. Currency: Choose your currency
4. Click "Next"

## Step 3: Configure Property

1. Industry category: Choose "Education" or appropriate category
2. Business size: Choose your business size
3. How do you plan to use Google Analytics: Select relevant options
4. Click "Create"

## Step 4: Set Up Data Stream

1. Choose platform: **Web**
2. Website URL: Enter your website URL
3. Stream name: Your website name
4. Click "Create stream"

## Step 5: Get Your Measurement ID

After creating the stream, you'll see your Measurement ID (format: G-XXXXXXXXXX). Copy this ID.

## Step 6: Environment Variables Setup

Create or update your `.env.local` file in the root directory:

```env
# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Replace `G-XXXXXXXXXX` with your actual Measurement ID.

## Step 7: Verify Installation

1. Start your development server: `npm run dev`
2. Open your website
3. Open browser developer tools (F12)
4. Go to Network tab
5. Look for requests to `google-analytics.com` or `googletagmanager.com`
6. You should see analytics requests being sent

## Step 8: Test Custom Events

1. Navigate to `/test` page (if you add the example component)
2. Click the tracking buttons
3. Check browser console for tracking messages
4. In Google Analytics, go to Reports > Engagement > Events to see your custom events

## Usage Examples

### Basic Event Tracking

```tsx
import { useGoogleAnalytics } from '@/hooks/useGoogleAnalytics'

function MyComponent() {
  const { trackButtonClick, trackUserLogin } = useGoogleAnalytics()

  const handleLogin = () => {
    trackUserLogin('email')
  }

  const handleButtonClick = () => {
    trackButtonClick('signup_button', 'landing_page')
  }

  return <button onClick={handleLogin}>Login</button>
}
```

### Custom Event Tracking

```tsx
import { useGoogleAnalytics } from '@/hooks/useGoogleAnalytics'

function MyComponent() {
  const { trackEvent } = useGoogleAnalytics()

  const handleCustomAction = () => {
    trackEvent({
      action: 'custom_action',
      category: 'user_engagement',
      label: 'specific_action',
      value: 1,
    })
  }

  return <button onClick={handleCustomAction}>Custom Action</button>
}
```

## Available Tracking Functions

The `useGoogleAnalytics` hook provides these pre-built tracking functions:

- `trackUserRegistration(method)` - Track user registrations
- `trackUserLogin(method)` - Track user logins
- `trackPostCreation(postType)` - Track post creation
- `trackCommunityJoin(communityType)` - Track community joins
- `trackSearch(searchTerm)` - Track search queries
- `trackButtonClick(buttonName, location)` - Track button clicks
- `trackFormSubmission(formName, success)` - Track form submissions
- `trackFileUpload(fileType, fileSize)` - Track file uploads
- `trackShare(contentType, platform)` - Track content sharing
- `trackError(errorType, errorMessage)` - Track errors

## Google Analytics Dashboard

After setup, you can view your data in the Google Analytics dashboard:

1. **Real-time**: See live user activity
2. **Reports**: View detailed analytics
3. **Engagement**: Track user interactions
4. **Events**: Monitor custom events
5. **Audience**: Understand your users

## Privacy Considerations

1. **GDPR Compliance**: Ensure you have proper consent mechanisms
2. **Cookie Notice**: Display cookie consent if required
3. **Data Retention**: Configure data retention settings in GA4
4. **IP Anonymization**: Consider enabling IP anonymization

## Troubleshooting

### Analytics Not Working

1. Check if `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set correctly
2. Verify the Measurement ID format (G-XXXXXXXXXX)
3. Check browser console for errors
4. Ensure no ad blockers are interfering

### Events Not Appearing

1. Wait 24-48 hours for data to appear in GA4
2. Check Real-time reports for immediate feedback
3. Verify event names and parameters
4. Use Google Analytics Debugger extension

### Development vs Production

- Analytics work in both development and production
- Use different Measurement IDs for testing if needed
- Consider using Google Analytics Debug View for testing

## Additional Resources

- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [Next.js Analytics Integration](https://nextjs.org/docs/app/building-your-application/optimizing/analytics)
- [Google Analytics Help Center](https://support.google.com/analytics/)

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Google Analytics documentation
3. Check browser console for errors
4. Verify environment variables are loaded correctly
