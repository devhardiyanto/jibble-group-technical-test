import client from '@/lib/client'
import type { Movie } from '@/types/movie'
import type { MovieResponse } from '@/types/api'

export const MovieService = {
  async getMovies(params?: { page?: number; Title?: string }): Promise<MovieResponse<Movie>> {
    const { data } = await client.get('/movies/search', { params })
    return data
  },

  async getMovieById(id: string): Promise<Movie> {
    const { data } = await client.get(`/movies/${id}`)
    return data
  }
}