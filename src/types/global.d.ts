declare global {
  interface College {
    id: string
    name: string
    score: string
    city: string
    country: string
    collegePage: string
  }
}

export type ModalContentType = 'ConnectionsModal' | 'PollModal' | 'EditProfileModal' | 'ReplyModal' | undefined

interface NavLink {
  label: string
  href: string
}
