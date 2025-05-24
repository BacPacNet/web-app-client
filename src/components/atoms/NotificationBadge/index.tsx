type NotificationBadgeProps = {
  count: number
  maxCount?: number // Optional: to display '9+' or similar
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ count, maxCount = 99 }) => {
  const displayCount = count > maxCount ? `${maxCount}+` : count

  return (
    <span
      className={`bg-destructive-600 h-4 rounded-full text-white flex items-center justify-center text-2xs font-semibold ${
        count > 9 ? 'px-1 min-w-4' : 'w-4'
      }`}
    >
      {displayCount}
    </span>
  )
}

export default NotificationBadge
