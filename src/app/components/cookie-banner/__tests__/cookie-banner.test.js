import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CookieBanner from '../cookie-banner'

// Mock localStorage avec une implémentation plus robuste
const mockLocalStorage = (() => {
  let store = {}
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = String(value)
    }),
    removeItem: jest.fn((key) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      store = {}
    }),
  }
})()

// Remplacer localStorage global
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
})

// Mock timers pour contrôler setTimeout
beforeAll(() => {
  jest.useFakeTimers()
})

afterAll(() => {
  jest.useRealTimers()
})

describe('CookieBanner Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue(null)
  })

  test('shows banner when no consent is stored', async () => {
    render(<CookieBanner />)
    
    // Avancer le timer de 1000ms (setTimeout dans le composant)
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    
    await waitFor(() => {
      expect(screen.getByText('🍪 Nous utilisons des cookies')).toBeInTheDocument()
    })
  })

  test('component renders without errors', () => {
    render(<CookieBanner />)
    expect(true).toBe(true)
  })

  test('accept all button works correctly', async () => {
    render(<CookieBanner />)
    
    // Avancer le timer pour afficher le banner
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    
    await waitFor(() => {
      expect(screen.getByText('Accepter tout')).toBeInTheDocument()
    })

    // Cliquer sur le bouton
    await act(async () => {
      fireEvent.click(screen.getByText('Accepter tout'))
    })

    // Vérifier que localStorage.setItem a été appelé correctement
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'cookieConsent',
      JSON.stringify({
        necessary: true,
        analytics: true,
        marketing: true,
        functional: true
      })
    )
  })

  test('accept necessary only button works correctly', async () => {
    render(<CookieBanner />)
    
    // Avancer le timer pour afficher le banner
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    
    await waitFor(() => {
      expect(screen.getByText('Nécessaires uniquement')).toBeInTheDocument()
    })

    // Cliquer sur le bouton
    await act(async () => {
      fireEvent.click(screen.getByText('Nécessaires uniquement'))
    })

    // Vérifier que localStorage.setItem a été appelé correctement
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'cookieConsent',
      JSON.stringify({
        necessary: true,
        analytics: false,
        marketing: false,
        functional: false
      })
    )
  })

  test('opens customization modal when customize button is clicked', async () => {
    render(<CookieBanner />)
    
    // Avancer le timer pour afficher le banner
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    
    await waitFor(() => {
      expect(screen.getByText('Personnaliser')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Personnaliser'))

    await waitFor(() => {
      expect(screen.getByText('Préférences des cookies')).toBeInTheDocument()
    })
  })
})