import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MovieService } from '../movie.service'
import client from '@/lib/client'
import type { Movie } from '@/types/movie'
import type { MovieResponse } from '@/types/api'

// Mock the client
vi.mock('@/lib/client', () => ({
  default: {
    get: vi.fn(),
  },
}))

describe('MovieService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getMovies', () => {
    const mockMoviesData: MovieResponse<Movie> = {
      page: 1,
      per_page: 10,
      total: 50,
      total_pages: 5,
      data: [
        { Title: 'Spiderman', Year: 2002, imdbID: 'tt0145487' },
        { Title: 'Spiderman 2', Year: 2004, imdbID: 'tt0316654' },
      ],
    }

    it('should fetch movies without params', async () => {
      vi.mocked(client.get).mockResolvedValueOnce({
        data: mockMoviesData,
      })

      const result = await MovieService.getMovies()

      expect(client.get).toHaveBeenCalledWith('/movies/search', { params: undefined })
      expect(result).toEqual(mockMoviesData)
    })

    it('should fetch movies with page param', async () => {
      vi.mocked(client.get).mockResolvedValueOnce({
        data: { ...mockMoviesData, page: 2 },
      })

      const result = await MovieService.getMovies({ page: 2 })

      expect(client.get).toHaveBeenCalledWith('/movies/search', {
        params: { page: 2 },
      })
      expect(result.page).toBe(2)
    })

    it('should fetch movies with Title param', async () => {
      const searchData = {
        ...mockMoviesData,
        data: [{ Title: 'Batman', Year: 1989, imdbID: 'tt0096895' }],
      }

      vi.mocked(client.get).mockResolvedValueOnce({
        data: searchData,
      })

      const result = await MovieService.getMovies({ Title: 'Batman' })

      expect(client.get).toHaveBeenCalledWith('/movies/search', {
        params: { Title: 'Batman' },
      })
      expect(result.data[0].Title).toBe('Batman')
    })

    it('should fetch movies with both page and Title params', async () => {
      vi.mocked(client.get).mockResolvedValueOnce({
        data: mockMoviesData,
      })

      await MovieService.getMovies({ page: 2, Title: 'Spiderman' })

      expect(client.get).toHaveBeenCalledWith('/movies/search', {
        params: { page: 2, Title: 'Spiderman' },
      })
    })

    it('should handle API errors', async () => {
      const errorMessage = 'Network Error'
      vi.mocked(client.get).mockRejectedValueOnce(new Error(errorMessage))

      await expect(MovieService.getMovies()).rejects.toThrow(errorMessage)
    })
  })

  describe('getMovieById', () => {
    const mockMovie: Movie = {
      Title: 'Spiderman',
      Year: 2002,
      imdbID: 'tt0145487',
    }

    it('should fetch a single movie by ID', async () => {
      vi.mocked(client.get).mockResolvedValueOnce({
        data: mockMovie,
      })

      const result = await MovieService.getMovieById('tt0145487')

      expect(client.get).toHaveBeenCalledWith('/movies/tt0145487')
      expect(result).toEqual(mockMovie)
    })

    it('should handle different movie IDs', async () => {
      const differentMovie: Movie = {
        Title: 'Batman',
        Year: 1989,
        imdbID: 'tt0096895',
      }

      vi.mocked(client.get).mockResolvedValueOnce({
        data: differentMovie,
      })

      const result = await MovieService.getMovieById('tt0096895')

      expect(client.get).toHaveBeenCalledWith('/movies/tt0096895')
      expect(result.imdbID).toBe('tt0096895')
    })

    it('should handle API errors for single movie', async () => {
      const errorMessage = 'Movie not found'
      vi.mocked(client.get).mockRejectedValueOnce(new Error(errorMessage))

      await expect(MovieService.getMovieById('tt9999999')).rejects.toThrow(errorMessage)
    })
  })
})
