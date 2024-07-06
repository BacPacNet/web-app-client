import { NavLink } from './global'

export const CommunityNavbarLinks: NavLink[] = [
  { label: 'Timeline', href: '/timeline' },
  { label: 'Profile', href: '/:id' },
  { label: 'Notifications', href: '/notifications' },
  { label: 'Messages', href: '/messages' },
  { label: 'Connections', href: '/community/:id/connections' },
  { label: 'University Community', href: '/community' },
  { label: 'Chatbot', href: '/chatbot' },
]
