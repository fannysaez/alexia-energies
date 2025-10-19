import { isLoggedIn, isAdmin, isUser } from '../auth'

// Mock window et localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

// Mock document.cookie
Object.defineProperty(document, 'cookie', {
  writable: true,
  value: '',
})

describe('Auth Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.localStorage = mockLocalStorage
    document.cookie = ''
    
    // Mock window
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    })
  })

  describe('isLoggedIn', () => {
    test('returns false when window is undefined (SSR)', () => {
      const originalWindow = global.window
      delete global.window
      
      expect(isLoggedIn()).toBe(false)
      
      global.window = originalWindow
    })

    test('returns true when token cookie exists', () => {
      document.cookie = 'token=some-token; path=/'
      
      expect(isLoggedIn()).toBe(true)
    })

    test('returns true when token in localStorage exists', () => {
      mockLocalStorage.getItem.mockReturnValue('some-token')
      
      expect(isLoggedIn()).toBe(true)
    })

    test('returns false when no token found', () => {
      document.cookie = ''
      mockLocalStorage.getItem.mockReturnValue(null)
      
      expect(isLoggedIn()).toBe(false)
    })

    test('returns true when both cookie and localStorage have tokens', () => {
      document.cookie = 'token=cookie-token; path=/'
      mockLocalStorage.getItem.mockReturnValue('localStorage-token')
      
      expect(isLoggedIn()).toBe(true)
    })
  })

  describe('isAdmin', () => {
    test('returns false when window is undefined (SSR)', () => {
      const originalWindow = global.window
      delete global.window
      
      expect(isAdmin()).toBe(false)
      
      global.window = originalWindow
    })

    test('returns false when no token in localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue(null)
      
      expect(isAdmin()).toBe(false)
    })

    test('returns true when token contains admin role', () => {
      const payload = { role: 'admin', id: '123', email: 'admin@test.com' }
      const base64Payload = btoa(JSON.stringify(payload))
      const mockToken = `header.${base64Payload}.signature`
      
      mockLocalStorage.getItem.mockReturnValue(mockToken)
      
      expect(isAdmin()).toBe(true)
    })

    test('returns false when token contains user role', () => {
      const payload = { role: 'user', id: '123', email: 'user@test.com' }
      const base64Payload = btoa(JSON.stringify(payload))
      const mockToken = `header.${base64Payload}.signature`
      
      mockLocalStorage.getItem.mockReturnValue(mockToken)
      
      expect(isAdmin()).toBe(false)
    })

    test('returns false when token is malformed', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-token')
      
      // Mock console.error to suppress error logs in tests
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      
      expect(isAdmin()).toBe(false)
      expect(consoleSpy).toHaveBeenCalled()
      
      consoleSpy.mockRestore()
    })

    test('handles JSON parsing errors gracefully', () => {
      const invalidBase64 = btoa('invalid json')
      const mockToken = `header.${invalidBase64}.signature`
      
      mockLocalStorage.getItem.mockReturnValue(mockToken)
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      
      expect(isAdmin()).toBe(false)
      expect(consoleSpy).toHaveBeenCalled()
      
      consoleSpy.mockRestore()
    })
  })

  describe('isUser', () => {
    test('returns false when not logged in', () => {
      mockLocalStorage.getItem.mockReturnValue(null)
      document.cookie = ''
      
      expect(isUser()).toBe(false)
    })

    test('returns false when user is admin', () => {
      const payload = { role: 'admin', id: '123', email: 'admin@test.com' }
      const base64Payload = btoa(JSON.stringify(payload))
      const mockToken = `header.${base64Payload}.signature`
      
      mockLocalStorage.getItem.mockReturnValue(mockToken)
      document.cookie = 'token=some-token; path=/'
      
      expect(isUser()).toBe(false)
    })

    test('returns true when user is logged in and not admin', () => {
      const payload = { role: 'user', id: '123', email: 'user@test.com' }
      const base64Payload = btoa(JSON.stringify(payload))
      const mockToken = `header.${base64Payload}.signature`
      
      mockLocalStorage.getItem.mockReturnValue(mockToken)
      document.cookie = 'token=some-token; path=/'
      
      expect(isUser()).toBe(true)
    })
  })

  describe('Edge cases', () => {
    test('handles empty cookie string', () => {
      document.cookie = ''
      mockLocalStorage.getItem.mockReturnValue(null)
      
      expect(isLoggedIn()).toBe(false)
    })

    test('handles multiple cookies without token', () => {
      document.cookie = 'other=value; another=value2'
      mockLocalStorage.getItem.mockReturnValue(null)
      
      expect(isLoggedIn()).toBe(false)
    })

    test('handles token cookie with spaces', () => {
      document.cookie = ' token=some-token ; path=/'
      
      expect(isLoggedIn()).toBe(true)
    })
  })
})