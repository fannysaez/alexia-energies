import { render, screen, waitFor, act } from '@testing-library/react'
import { jest } from '@jest/globals'
import MesArticles from '../mesArticles'

// Mock de next/image
jest.mock('next/image', () => {
  return function MockedImage({ src, alt, ...props }) {
    return <img src={src} alt={alt} {...props} />
  }
})

// Mock de next/link
jest.mock('next/link', () => {
  return function MockedLink({ href, children, className, ...props }) {
    return <a href={href} className={className} {...props}>{children}</a>
  }
})

// Mock du composant Button
jest.mock('@/app/components/button/button', () => {
  return function MockedButton({ text, ...props }) {
    return <button {...props}>{text}</button>
  }
})

// Mock de fetch global
global.fetch = jest.fn()

const mockArticles = [
  {
    id: '1',
    titre: 'Article Test 1',
    description: 'Description de l\'article test 1 pour vérifier l\'affichage',
    image: '/test-image-1.jpg',
    slug: 'article-test-1',
    publishedAt: '2024-01-15T10:00:00Z',
    dateCreation: '2024-01-15T09:00:00Z'
  },
  {
    id: '2',
    titre: 'Article Test 2',
    description: 'Description courte',
    image: '/test-image-2.jpg',
    slug: 'article-test-2',
    publishedAt: '2024-01-20T10:00:00Z',
    dateCreation: '2024-01-20T09:00:00Z'
  },
  {
    id: '3',
    titre: 'Article Test 3',
    description: 'Une très longue description qui devrait être tronquée à 18 caractères pour tester la fonctionnalité',
    image: '/test-image-3.jpg',
    slug: 'article-test-3',
    publishedAt: '2024-01-25T10:00:00Z',
    dateCreation: '2024-01-25T09:00:00Z'
  }
]

describe('MesArticles Component', () => {
  beforeEach(() => {
    fetch.mockClear()
    // Console.error mock pour éviter les logs pendant les tests
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('renders component title and subtitle', () => {
    // Mock d'une réponse API vide
    fetch.mockResolvedValueOnce({
      json: async () => []
    })

    render(<MesArticles />)
    
    expect(screen.getByText('Mes Articles')).toBeInTheDocument()
    expect(screen.getByText(/Découvrez nos derniers articles/)).toBeInTheDocument()
  })

  test('fetches and displays articles correctly', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => mockArticles
    })

    await act(async () => {
      render(<MesArticles />)
    })

    // Attendre que les articles soient chargés
    await waitFor(() => {
      expect(screen.getByText('Article Test 1')).toBeInTheDocument()
    })

    // Vérifier que l'API a été appelée
    expect(fetch).toHaveBeenCalledWith('/api/articles')
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  test('displays main article (most recent) correctly', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => mockArticles
    })

    await act(async () => {
      render(<MesArticles />)
    })

    await waitFor(() => {
      // L'article le plus récent (Article Test 3) devrait être l'article principal
      expect(screen.getByText('Article Test 3')).toBeInTheDocument()
    })

    // Vérifier la présence de l'image
    const mainImage = screen.getByAltText('Article Test 3')
    expect(mainImage).toBeInTheDocument()
    expect(mainImage).toHaveAttribute('src', '/test-image-3.jpg')
  })

  test('displays secondary articles correctly', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => mockArticles
    })

    await act(async () => {
      render(<MesArticles />)
    })

    await waitFor(() => {
      // Les articles secondaires devraient être affichés
      expect(screen.getByText('Article Test 1')).toBeInTheDocument()
      expect(screen.getByText('Article Test 2')).toBeInTheDocument()
    })
  })

  test('truncates long descriptions in secondary articles', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => mockArticles
    })

    await act(async () => {
      render(<MesArticles />)
    })

    await waitFor(() => {
      // La description longue devrait être tronquée (text est "Une très longue de...")
      expect(screen.getByText('Une très longue de...')).toBeInTheDocument()
    })
  })

  test('displays correct date formatting', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => mockArticles
    })

    await act(async () => {
      render(<MesArticles />)
    })

    await waitFor(() => {
      // Vérifier le format de date français
      expect(screen.getByText('25 janv. 2024')).toBeInTheDocument()
    })
  })

  test('generates correct article links', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => mockArticles
    })

    await act(async () => {
      render(<MesArticles />)
    })

    await waitFor(() => {
      // Vérifier les liens "Lire la suite" (il y en a plusieurs)
      const links = screen.getAllByText('Lire la suite')
      expect(links.length).toBeGreaterThan(0)
      
      // Vérifier qu'au moins un lien pointe vers le bon slug
      const articleLinks = screen.getAllByRole('link')
      const articlesLinks = articleLinks.filter(link => 
        link.getAttribute('href')?.includes('/articles/')
      )
      expect(articlesLinks.length).toBeGreaterThan(0)
    })
  })

  test('handles empty articles array', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => []
    })

    await act(async () => {
      render(<MesArticles />)
    })

    await waitFor(() => {
      // Le titre et sous-titre devraient toujours être présents
      expect(screen.getByText('Mes Articles')).toBeInTheDocument()
      
      // Aucun article ne devrait être affiché
      expect(screen.queryByText('Article Test 1')).not.toBeInTheDocument()
    })
  })

  test('handles API fetch error gracefully', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'))

    await act(async () => {
      render(<MesArticles />)
    })

    await waitFor(() => {
      // Le composant devrait toujours s'afficher malgré l'erreur
      expect(screen.getByText('Mes Articles')).toBeInTheDocument()
    })

    // Vérifier que l'erreur a été loggée
    expect(console.error).toHaveBeenCalledWith(
      'Erreur lors de la récupération des articles :',
      expect.any(Error)
    )
  })

  test('handles non-array API response', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({ message: 'Invalid response' })
    })

    await act(async () => {
      render(<MesArticles />)
    })

    await waitFor(() => {
      // Le composant devrait gérer gracieusement une réponse non-array
      expect(screen.getByText('Mes Articles')).toBeInTheDocument()
      expect(screen.queryByText('Article Test 1')).not.toBeInTheDocument()
    })
  })

  test('limits articles to maximum 4', async () => {
    // Créer plus de 4 articles pour tester la limite
    const manyArticles = [
      ...mockArticles,
      {
        id: '4',
        titre: 'Article Test 4',
        description: 'Description 4',
        image: '/test-image-4.jpg',
        slug: 'article-test-4',
        publishedAt: '2024-01-30T10:00:00Z'
      },
      {
        id: '5',
        titre: 'Article Test 5',
        description: 'Description 5',
        image: '/test-image-5.jpg',
        slug: 'article-test-5',
        publishedAt: '2024-02-01T10:00:00Z'
      }
    ]

    fetch.mockResolvedValueOnce({
      json: async () => manyArticles
    })

    await act(async () => {
      render(<MesArticles />)
    })

    await waitFor(() => {
      // Seulement 4 articles maximum devraient être affichés
      // Le composant affiche le dernier en article principal, donc Article Test 4
      expect(screen.getByText('Article Test 4')).toBeInTheDocument()
      
      // Articles secondaires: Test 3, Test 2, Test 1
      expect(screen.getByText('Article Test 3')).toBeInTheDocument()
      expect(screen.getByText('Article Test 2')).toBeInTheDocument()
      expect(screen.getByText('Article Test 1')).toBeInTheDocument()
      
      // Article Test 5 ne devrait pas être affiché (dépassement de limite)
      expect(screen.queryByText('Article Test 5')).not.toBeInTheDocument()
    })
  })
})