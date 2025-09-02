import { parseTimeToSeconds } from '../parse-time-to-seconds.util'

describe('parseTimeToSeconds', () => {
  describe('seconds', () => {
    it('should parse seconds correctly', () => {
      expect(parseTimeToSeconds('30s')).toBe(30)
      expect(parseTimeToSeconds('1s')).toBe(1)
      expect(parseTimeToSeconds('0s')).toBe(0)
    })

    it('should parse large seconds values', () => {
      expect(parseTimeToSeconds('3600s')).toBe(3600)
      expect(parseTimeToSeconds('86400s')).toBe(86400)
    })
  })

  describe('minutes', () => {
    it('should parse minutes correctly', () => {
      expect(parseTimeToSeconds('1m')).toBe(60)
      expect(parseTimeToSeconds('5m')).toBe(300)
      expect(parseTimeToSeconds('30m')).toBe(1800)
    })

    it('should parse large minutes values', () => {
      expect(parseTimeToSeconds('60m')).toBe(3600)
      expect(parseTimeToSeconds('1440m')).toBe(86400)
    })
  })

  describe('hours', () => {
    it('should parse hours correctly', () => {
      expect(parseTimeToSeconds('1h')).toBe(3600)
      expect(parseTimeToSeconds('2h')).toBe(7200)
      expect(parseTimeToSeconds('12h')).toBe(43200)
    })

    it('should parse large hours values', () => {
      expect(parseTimeToSeconds('24h')).toBe(86400)
      expect(parseTimeToSeconds('48h')).toBe(172800)
    })
  })

  describe('days', () => {
    it('should parse days correctly', () => {
      expect(parseTimeToSeconds('1d')).toBe(86400)
      expect(parseTimeToSeconds('2d')).toBe(172800)
      expect(parseTimeToSeconds('7d')).toBe(604800)
    })

    it('should parse large days values', () => {
      expect(parseTimeToSeconds('30d')).toBe(2592000)
      expect(parseTimeToSeconds('365d')).toBe(31536000)
    })
  })

  describe('numeric values', () => {
    it('should parse numeric strings without units', () => {
      expect(parseTimeToSeconds('30')).toBe(30)
      expect(parseTimeToSeconds('0')).toBe(0)
      expect(parseTimeToSeconds('3600')).toBe(3600)
    })

    it('should parse large numeric values', () => {
      expect(parseTimeToSeconds('86400')).toBe(86400)
      expect(parseTimeToSeconds('31536000')).toBe(31536000)
    })
  })

  describe('edge cases', () => {
    it('should handle zero values', () => {
      expect(parseTimeToSeconds('0s')).toBe(0)
      expect(parseTimeToSeconds('0m')).toBe(0)
      expect(parseTimeToSeconds('0h')).toBe(0)
      expect(parseTimeToSeconds('0d')).toBe(0)
      expect(parseTimeToSeconds('0')).toBe(0)
    })

    it('should handle single digit values', () => {
      expect(parseTimeToSeconds('1s')).toBe(1)
      expect(parseTimeToSeconds('1m')).toBe(60)
      expect(parseTimeToSeconds('1h')).toBe(3600)
      expect(parseTimeToSeconds('1d')).toBe(86400)
    })

    it('should handle decimal values', () => {
      expect(parseTimeToSeconds('1.5')).toBe(1)
      expect(parseTimeToSeconds('2.7m')).toBe(2)
    })
  })

  describe('invalid formats', () => {
    it('should handle invalid unit formats', () => {
      expect(parseTimeToSeconds('30x')).toBe(30)
      expect(parseTimeToSeconds('5z')).toBe(5)
    })

    it('should handle mixed formats', () => {
      expect(parseTimeToSeconds('30sm')).toBe(30)
      expect(parseTimeToSeconds('5hd')).toBe(5)
    })

    it('should handle empty string', () => {
      expect(parseTimeToSeconds('')).toBe(NaN)
    })

    it('should handle whitespace', () => {
      expect(parseTimeToSeconds(' 30s ')).toBe(30)
      expect(parseTimeToSeconds('30 s')).toBe(30)
    })
  })

  describe('real-world examples', () => {
    it('should parse common time formats', () => {
      expect(parseTimeToSeconds('15m')).toBe(900)
      expect(parseTimeToSeconds('2h')).toBe(7200)
      expect(parseTimeToSeconds('1d')).toBe(86400)
      expect(parseTimeToSeconds('7d')).toBe(604800)
    })

    it('should parse session timeout values', () => {
      expect(parseTimeToSeconds('30m')).toBe(1800)
      expect(parseTimeToSeconds('2h')).toBe(7200)
      expect(parseTimeToSeconds('24h')).toBe(86400)
    })
  })
})
