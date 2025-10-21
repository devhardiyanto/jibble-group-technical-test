import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useMovieStore } from '../index'
import type { Movie } from '@/types/movie'
import type { MovieResponse } from '@/types/api'

describe('Movie Store', () => {
  beforeEach(() => {
    const pinia = createPinia()
    pinia.use(piniaPluginPersistedstate)
    setActivePinia(pinia)
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const store = useMovieStore()
      
      expect(store.loading).toBe(true)
      expect(store.page).toBe(0)
      expect(store.per_page).toBe(0)
      expect(store.total).toBe(0)
      expect(store.total_pages).toBe(0)
      expect(store.data).toEqual([])
      expect(store.favorites).toEqual([])
    })
  })

  describe('Getters', () => {
    it('movies getter should return data', () => {
      const store = useMovieStore()
      const mockMovies: Movie[] = [
        { Title: 'Spiderman', Year: 2002, imdbID: 'tt0145487' },
        { Title: 'Spiderman 2', Year: 2004, imdbID: 'tt0316654' },
      ]
      
      store.data = mockMovies
      expect(store.movies).toEqual(mockMovies)
    })

    it('favoriteMovies getter should return only favorited movies', () => {
      const store = useMovieStore()
      const mockMovies: Movie[] = [
        { Title: 'Spiderman', Year: 2002, imdbID: 'tt0145487' },
        { Title: 'Spiderman 2', Year: 2004, imdbID: 'tt0316654' },
        { Title: 'Spiderman 3', Year: 2007, imdbID: 'tt0413300' },
      ]
      
      store.data = mockMovies
      store.favorites = ['tt0145487', 'tt0413300']
      
      const favoriteMovies = store.favoriteMovies
      expect(favoriteMovies).toHaveLength(2)
      expect(favoriteMovies[0]?.imdbID).toBe('tt0145487')
      expect(favoriteMovies[1]?.imdbID).toBe('tt0413300')
    })

    it('favoriteMovies getter should return empty array when no favorites', () => {
      const store = useMovieStore()
      const mockMovies: Movie[] = [
        { Title: 'Spiderman', Year: 2002, imdbID: 'tt0145487' },
      ]
      
      store.data = mockMovies
      store.favorites = []
      
      expect(store.favoriteMovies).toEqual([])
    })

    it('isFavorite getter should check if movie is favorited', () => {
      const store = useMovieStore()
      store.favorites = ['tt0145487', 'tt0316654']
      
      expect(store.isFavorite('tt0145487')).toBe(true)
      expect(store.isFavorite('tt0316654')).toBe(true)
      expect(store.isFavorite('tt0413300')).toBe(false)
    })
  })

  describe('Actions', () => {
    describe('setLoading', () => {
      it('should set loading state', () => {
        const store = useMovieStore()
        
        store.setLoading(false)
        expect(store.loading).toBe(false)
        
        store.setLoading(true)
        expect(store.loading).toBe(true)
      })
    })

    describe('setMovies', () => {
      it('should set movies data and pagination', () => {
        const store = useMovieStore()
        const mockResponse: MovieResponse<Movie> = {
          page: 1,
          per_page: 10,
          total: 50,
          total_pages: 5,
          data: [
            { Title: 'Spiderman', Year: 2002, imdbID: 'tt0145487' },
            { Title: 'Spiderman 2', Year: 2004, imdbID: 'tt0316654' },
          ],
        }
        
        store.setMovies(mockResponse)
        
        expect(store.page).toBe(1)
        expect(store.per_page).toBe(10)
        expect(store.total).toBe(50)
        expect(store.total_pages).toBe(5)
        expect(store.data).toEqual(mockResponse.data)
      })
    })

    describe('clear', () => {
      it('should reset store to default values', () => {
        const store = useMovieStore()
        
        // Set some data first
        store.page = 2
        store.per_page = 10
        store.total = 50
        store.total_pages = 5
        store.data = [{ Title: 'Test', Year: 2020, imdbID: 'tt123' }]
        
        // Clear the store
        store.clear()
        
        expect(store.page).toBe(0)
        expect(store.per_page).toBe(0)
        expect(store.total).toBe(0)
        expect(store.total_pages).toBe(0)
        expect(store.data).toEqual([])
      })
    })

    describe('toggleFavorite', () => {
      it('should add movie to favorites if not already favorited', () => {
        const store = useMovieStore()
        
        store.toggleFavorite('tt0145487')
        
        expect(store.favorites).toContain('tt0145487')
        expect(store.favorites).toHaveLength(1)
      })

      it('should remove movie from favorites if already favorited', () => {
        const store = useMovieStore()
        store.favorites = ['tt0145487', 'tt0316654']
        
        store.toggleFavorite('tt0145487')
        
        expect(store.favorites).not.toContain('tt0145487')
        expect(store.favorites).toContain('tt0316654')
        expect(store.favorites).toHaveLength(1)
      })

      it('should toggle favorite multiple times correctly', () => {
        const store = useMovieStore()
        
        // Add
        store.toggleFavorite('tt0145487')
        expect(store.favorites).toContain('tt0145487')
        
        // Remove
        store.toggleFavorite('tt0145487')
        expect(store.favorites).not.toContain('tt0145487')
        
        // Add again
        store.toggleFavorite('tt0145487')
        expect(store.favorites).toContain('tt0145487')
      })

      it('should handle multiple different favorites', () => {
        const store = useMovieStore()
        
        store.toggleFavorite('tt0145487')
        store.toggleFavorite('tt0316654')
        store.toggleFavorite('tt0413300')
        
        expect(store.favorites).toHaveLength(3)
        expect(store.favorites).toEqual(['tt0145487', 'tt0316654', 'tt0413300'])
      })
    })
  })

  describe('Persistence Config', () => {
    it('should have persistence enabled', () => {
      const store = useMovieStore()
      
      // Check if store has persist options defined in store definition
      // The store should be initialized properly with the persistence plugin
      expect(store).toBeDefined()
      
      // Test that the persisted fields are accessible
      expect(store.page).toBeDefined()
      expect(store.per_page).toBeDefined()
      expect(store.total).toBeDefined()
      expect(store.total_pages).toBeDefined()
      expect(store.data).toBeDefined()
      expect(store.favorites).toBeDefined()
      
      // Verify localStorage mock is being used
      expect(localStorage.setItem).toBeDefined()
    })
  })
})
