type User = {
  _id: string
  [key: string]: any
}

type Page = {
  users: User[]
}

export const processUserList = (
  pages: Page[] | undefined,
  followingMap: Set<string>,
  currentUserId: string,
  pathUserId: string
): (User & { isFollowing: boolean })[] => {
  return (
    pages?.flatMap((page) =>
      page.users
        .filter((user) => (currentUserId === pathUserId ? user._id !== currentUserId : true))
        .map((user) => ({
          ...user,
          isFollowing: followingMap.has(user._id),
        }))
    ) || []
  )
}
