export function parseTimeToSeconds(time: string): number {
  const match = /^(\d+)([smhd])$/.exec(time)
  if (!match) return parseInt(time, 10)

  const value = parseInt(match[1], 10)
  const unit = match[2]

  switch (unit) {
    case 's':
      return value
    case 'm':
      return value * 60
    case 'h':
      return value * 60 * 60
    case 'd':
      return value * 60 * 60 * 24
    default:
      return value
  }
}
